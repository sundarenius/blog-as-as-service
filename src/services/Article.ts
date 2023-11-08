/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import type { IPayload, IFilter } from '../types/globals';
import { Methods, HttpStatusCodes, ArticleStatus } from '../types/globals';
import Article from '../models/Article';
import MongoTransactions from '../mongodb/MongoTransactions';
import {
  verifySimpleAuth,
} from '../utils/auth';
import type { ArticleRepository } from '../repositories/ArticleRepository';
import { Collections } from '../mongodb/mongo-config';
import { getRandomFromArray, triggerAiJob } from '../utils/helpers';
import { v4 as uuidv4 } from 'uuid';
import { findFilterAndOrder } from '../mongodb/transactions';

type IPayloadData = Partial<Article> & { mock?: boolean, articleAiData?: any }

class ArticleService extends MongoTransactions implements ArticleRepository {
  collection = Article.collection;

  payload: { getData: (requireAllFields?: boolean) => IPayloadData } & IPayloadData;

  mock?: boolean = false;

  articleAiData?: any;

  constructor(payload: IPayloadData) {
    super();
    this.payload = new Article(payload as any);
    if (payload.mock) {
      this.mock = payload.mock;
    }
    if (payload.articleAiData) {
      this.articleAiData = payload.articleAiData;
    }
    this.getOne = this.getOne.bind(this);
    this.getMany = this.getMany.bind(this);
    this.create = this.create.bind(this);
  }

  async getOne(): Promise<Article | null> {
    const { articleId, customerId } = this.payload.getData();
    const data = await this.findOne({
      query: { articleId, customerId },
    });

    if (!data) throw new Error(`Article not found ${HttpStatusCodes.BAD_REQUEST}`);
    
    return data as any;
  }

  async getMany(filter: IFilter): Promise<Article[] | null> {
    // need to make a callback collection instead like in connect platform
    const data = await this.findMany({
      collectionCallback: findFilterAndOrder(filter),
    });

    return data as any;
  }

  async create(auth: string): Promise<any> {
    verifySimpleAuth(auth);
    const newData = this.payload.getData();
    const customer = await this.findOne({ query: { customerId: newData.customerId }, collection: Collections.ACCOUNTS });
    if (!customer) throw new Error(`Customer not found ${HttpStatusCodes.BAD_REQUEST}`);

    const configData = await this.findOne({
      query: { customerId: newData.customerId },
      collection: Collections.CONFIG
    });

    if (!configData) throw new Error(`No config found ${HttpStatusCodes.INTERNAL_SERVER_ERROR}`);

    const prevArticles = await this.findMany({
      collection: Collections.ARTICLES,
      collectionCallback: async (collection: any) => {
        const res = await collection.find({})
        .sort({ created: -1 }) // Sort by created field in descending order (latest first)
        .limit(30)             // Limit the result to x documents
        .project({ _id: 0, title: 1 }) // Only return the 'title' field, exclude '_id'
        .toArray();
        return res.map((t: any) => t.title);
      }
    });
    const previousTitles = prevArticles;

    const blogAiConfig = () => ({
      category: getRandomFromArray(configData.categories),
      keywords: configData.keywords,
      language: configData.language,
      includeHolidays: configData.includeHolidays,
      previousTitles,
    })

    const getNewArticleData: any = (data: any) => ({
      customerId: newData.customerId,
      articleId: data.articleId || uuidv4(),
      title: data.title,
      content: data.content,
      pictureUrl: data.pictureUrl,
      category: data.category,
      created: new Date().getTime(),
    });

    if (this.mock) {
      for (let i = 0; i < 50; i++) {
        const mockData = getNewArticleData(getMockArticle());
        const mockArticle = new Article(mockData).getData()
        await this.createOne({ newData: mockArticle} as any);
      }
      // do not continue
      return {
        msg: 'Succesfully created new mock articles',
      };
    }

    const articleId = uuidv4();

    if (!this.articleAiData) {
      const res = await triggerAiJob({ ...blogAiConfig(), articleId, customerId: newData.customerId });
      if (res.statusCode === 200) {
        await this.createOne({
          newData: {
            customerId: newData.customerId,
            articleId: articleId,
            status: ArticleStatus.PENDING,
            message: 'Job triggered'
          },
          collection: Collections.ARTICLE_STATUS,
        } as any);

        return {
          msg: res.data.msg,
          articleId,
        };
      } else {
        return {
          msg: res.data.errorMsg,
          articleId,
          statusCode: 500
        };
      }
    }

    if (this.articleAiData.error) {
      await this.updateOne({
        query: {
          customerId: this.articleAiData.customerId,
          articleId: this.articleAiData.articleId,
        },
        newData: {status: ArticleStatus.FAILED, message: `Error from EC2: ${this.articleAiData.error}`},
        collection: Collections.ARTICLE_STATUS,
      })
      return { msg: 'Status updated to failed' }
    }

    if (this.articleAiData) {
      const newArticle = new Article(getNewArticleData(this.articleAiData)).getData();
      const result = await this.createOne({ newData: newArticle, collection: Collections.ARTICLES })
      if (result.acknowledged) {
        await this.updateOne({
          query: {
            customerId: this.articleAiData.customerId,
            articleId: this.articleAiData.articleId,
          },
          newData: {status: ArticleStatus.SUCCESS, message: 'Done!'},
          collection: Collections.ARTICLE_STATUS,
        })
        return { msg: 'Succesfully added new article.', articleId: this.articleAiData.articleId, };
      } else {
        await this.updateOne({
          query: {
            customerId: this.articleAiData.customerId,
            articleId: this.articleAiData.articleId,
          },
          newData: {status: ArticleStatus.FAILED, message: 'Could not add document'},
          collection: Collections.ARTICLE_STATUS,
        })
        return { msg: 'Could not add document.', articleId: this.articleAiData.articleId, };
      }
    }

    return { msg: 'No work done ...', articleId, };
  }
}

const article = async ({
  method,
  payload,
  auth,
  filter,
}: IPayload<IPayloadData>) => {
  const service = new ArticleService(payload as IPayloadData);

  const getBodyRes = async (callback: any) => {
    const res = await callback();
    return {
      body: res,
      statusCode: 200,
    };
  };

  switch (method) {
    case Methods.GET:
      return getBodyRes(service.getOne);
    case Methods.POST:
      return getBodyRes(filter ? () => service.getMany(filter) : () => service.create(auth));

    default:
      throw new Error('Method not implemented.');
  }
};

const getMockArticle = () => ({
  pictureUrl: 'https://pixabay.com/get/g6a26d9999b0968b5098c4f9ffbb135620c03db78a7fbfabf35a6768f0859926493bf6f6feb81f4beed6ed23dad0ac5299ecbad3b888b71975d5baa82c531e313_640.jpg',
  category: 'Long-Distance Relationships',
  title: 'Building Successful Long-Distance Relationships: Insights from a JW Singles Perspective',
  created: new Date().getTime(),
  content: "<p>Long-distance relationships can pose unique challenges, but with the right approach, they can thrive. As a JW single, it's important to apply biblical principles and truths to your dating journey. By focusing on shared faith and values, you can establish a strong foundation from the start.</p><p>Online dating can be a useful tool, enabling JW singles to connect with like-minded individuals worldwide. Jehovas Witnesses dating site online are available, providing a platform tailored to the needs of JW singles.</p><p>However, success in long-distance relationships goes beyond technology. Regular communication, trust, and understanding are key. Make time for video calls, send handwritten letters, and always be open and honest with your partner.</p><p>Remember that true success is not measured solely by physical proximity, but by the love and commitment you share. Ultimately, it's God who watches over and blesses our relationships. By following His guidance and seeking His will, you can build a successful long-distance relationship that stands the test of time.</p>"
});

export default article;

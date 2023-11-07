/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import type { IPayload, IFilter } from '../types/globals';
import { Methods, HttpStatusCodes } from '../types/globals';
import Article from '../models/Article';
import MongoTransactions from '../mongodb/MongoTransactions';
import {
  verifyJwtToken,
  decodeJwtToken,
} from '../utils/auth';
import type { ArticleRepository } from '../repositories/ArticleRepository';
import { generateBlogPost } from '../utils/create-blog-post';
import { Collections } from '../mongodb/mongo-config';

type IPayloadData = Partial<Article>

class ArticleService extends MongoTransactions implements ArticleRepository {
  collection = Article.collection;

  payload: { getData: (requireAllFields?: boolean) => IPayloadData } & IPayloadData;

  constructor(payload: IPayloadData) {
    super();
    this.payload = new Article(payload as any);
    this.getOne = this.getOne.bind(this);
    this.create = this.create.bind(this);
  }

  async getOne(): Promise<Article | null> {
    const { customerId } = this.payload.getData();
    const data = await this.findOne({
      query: { customerId },
    });

    if (!data) throw new Error(`Article not found ${HttpStatusCodes.BAD_REQUEST}`);
    
    return data as any;
  }

  async getMany(filter: IFilter): Promise<Article[] | null> {
    // need to make a callback collection instead like in connect platform
    const data = await this.findOne({
      query: { filter },
    });

    return data as any;
  }

  // create happens after an Accounts was made
  async create(): Promise<any> {
    const newData = this.payload.getData();
    if (!newData.customerId) throw new Error(`Must pass in customerId ${HttpStatusCodes.BAD_REQUEST}`);

    const configData = await this.findOne({
      query: { customerId: newData.customerId },
      collection: Collections.CONFIG
    });

    if (!configData) throw new Error(`No config found ${HttpStatusCodes.INTERNAL_SERVER_ERROR}`);

    const blogConfig = {
      category: getRandomFromArray(configData.categories),
      keywords: configData.keywords,
    }
    // get config from Config table and choose random category with subject
    // also fetch previous titles
    const aiRes: any = await generateBlogPost(blogConfig as any);
    // const newBlogData = new Article({
    //   customerId: '',
    //   title: '',
    //   content: '',
    //   created: new Date().getTime(),
    // });

    // await this.createOne({
    //   newData: {
    //     ...newBlogData,
    //   },
    // } as any);

    return {
      msg: 'Succesfully created new article',
      article: aiRes,
    };
  }
}

function getRandomFromArray(arr: string[]) {
  if (arr.length === 0) {
    return null; // Return null if the array is empty
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

// Generate config from another collection and choose random subject and category from an array.
// Make another model with these values:
const config = {
  category: 'piece and security',
  keywords: ['piece', 'security', 'Israel', 'War', 'Food', 'Water', 'Planet', 'Green future'],
  previousTitles: [],
}

const article = async ({
  method,
  payload,
  auth,
  filter,
}: IPayload<IPayloadData>) => {
  const service = new ArticleService(payload as IPayloadData);

  const tokenData: any = decodeJwtToken(auth);
  const getBodyRes = async (callback: any) => {
    const res = await callback(tokenData);
    return {
      body: res,
      statusCode: 200,
    };
  };

  switch (method) {
    case Methods.GET:
      return getBodyRes(filter ? service.getMany : service.getOne);
    case Methods.POST:
      return getBodyRes(service.create);

    default:
      throw new Error('Method not implemented.');
  }
};

export default article;

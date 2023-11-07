/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import type { IPayload, IFilter } from '../types/globals';
import { Methods, HttpStatusCodes } from '../types/globals';
import ArticleStatus from '../models/ArticleStatus';
import MongoTransactions from '../mongodb/MongoTransactions';
import {
  verifySimpleAuth,
} from '../utils/auth';
import type { ArticleStatusRepository } from '../repositories/ArticleStatusRepository';

type IPayloadData = Partial<ArticleStatus> & { mock?: boolean }

class ArticleStatusService extends MongoTransactions implements ArticleStatusRepository {
  collection = ArticleStatus.collection;

  payload: { getData: (requireAllFields?: boolean) => IPayloadData } & IPayloadData;

  constructor(payload: IPayloadData) {
    super();
    this.payload = new ArticleStatus(payload as any);
    this.getOne = this.getOne.bind(this);
  }

  async getOne(): Promise<ArticleStatus | null> {
    const { articleId, customerId } = this.payload.getData();
    const data = await this.findOne({
      query: { articleId, customerId },
    });

    if (!data) throw new Error(`Article not found ${HttpStatusCodes.BAD_REQUEST}`);
    
    return data as any;
  }
}

const article = async ({
  method,
  payload,
  auth,
  filter,
}: IPayload<IPayloadData>) => {
  const service = new ArticleStatusService(payload as IPayloadData);

  const getBodyRes = async (callback: any) => {
    const res = await callback();
    return {
      body: res,
      statusCode: 200,
    };
  };

  switch (method) {
    case Methods.GET:
      verifySimpleAuth(auth);
      return getBodyRes(service.getOne);

    default:
      throw new Error('Method not implemented.');
  }
};

const getMockArticle = () => ({
  pictureUrl: 'https://pixabay.com/get/g6a26d9999b0968b5098c4f9ffbb135620c03db78a7fbfabf35a6768f0859926493bf6f6feb81f4beed6ed23dad0ac5299ecbad3b888b71975d5baa82c531e313_640.jpg',
  category: 'Long-Distance Relationships',
  title: 'Building Successful Long-Distance Relationships: Insights from a JW Singles Perspective',
  created: new Date().getTime(),
  id: Math.random() * 12999,
  content: "<p>Long-distance relationships can pose unique challenges, but with the right approach, they can thrive. As a JW single, it's important to apply biblical principles and truths to your dating journey. By focusing on shared faith and values, you can establish a strong foundation from the start.</p><p>Online dating can be a useful tool, enabling JW singles to connect with like-minded individuals worldwide. Jehovas Witnesses dating site online are available, providing a platform tailored to the needs of JW singles.</p><p>However, success in long-distance relationships goes beyond technology. Regular communication, trust, and understanding are key. Make time for video calls, send handwritten letters, and always be open and honest with your partner.</p><p>Remember that true success is not measured solely by physical proximity, but by the love and commitment you share. Ultimately, it's God who watches over and blesses our relationships. By following His guidance and seeking His will, you can build a successful long-distance relationship that stands the test of time.</p>"
});

export default article;

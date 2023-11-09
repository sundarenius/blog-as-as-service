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

export default article;

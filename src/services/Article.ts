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
    const { id } = this.payload.getData();
    // const data = await this.findOne({
    //   query: { likeId },
    // });

    return {} as any;
  }

  async getMany(filter: IFilter): Promise<Article[] | null> {
    const { id } = this.payload.getData();
    // const data = await this.findOne({
    //   query: { likeId },
    // });

    return {} as any;
  }

  // create happens after an Accounts was made
  async create(): Promise<any> {
    const newData = this.payload.getData(true);
    await this.createOne({
      newData: {
        ...newData,
        created: new Date().getTime(),
      },
    } as any);

    return {
      msg: 'Succesfully created new article',
    };
  }
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

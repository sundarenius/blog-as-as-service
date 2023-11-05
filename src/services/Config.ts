/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import type { IPayload, IFilter } from '../types/globals';
import { Methods, HttpStatusCodes } from '../types/globals';
import Config from '../models/Config';
import MongoTransactions from '../mongodb/MongoTransactions';
import {
  verifyJwtToken,
  decodeJwtToken,
} from '../utils/auth';
import type { ConfigRepository } from '../repositories/ConfigRepository';

type IPayloadData = Partial<Config>

class ConfigService extends MongoTransactions implements ConfigRepository {
  collection = Config.collection;

  payload: { getData: (requireAllFields?: boolean) => IPayloadData } & IPayloadData;

  constructor(payload: IPayloadData) {
    super();
    this.payload = new Config(payload as any);
    this.getOne = this.getOne.bind(this);
    this.create = this.create.bind(this);
  }

  async getOne(): Promise<Config | null> {
    const { customerId } = this.payload.getData();
    const data = await this.findOne({
      query: { customerId },
    });

    if (!data) throw new Error(`Config not found ${HttpStatusCodes.BAD_REQUEST}`);
    
    return data as any;
  }

  // create happens after an Accounts was made
  async create(): Promise<any> {
    const newData = this.payload.getData(true);

    await this.createOne({
      newData,
    } as any);

    return {
      msg: 'Succesfully created new config',
    };
  }
}

const config = async ({
  method,
  payload,
  auth,
  filter,
}: IPayload<IPayloadData>) => {
  const service = new ConfigService(payload as IPayloadData);

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
      return getBodyRes(service.getOne);
    case Methods.POST:
      return getBodyRes(service.create);

    default:
      throw new Error('Method not implemented.');
  }
};

export default config;

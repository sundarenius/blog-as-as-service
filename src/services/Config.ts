/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import type { IPayload, IFilter } from '../types/globals';
import { Methods, HttpStatusCodes } from '../types/globals';
import Config from '../models/Config';
import MongoTransactions from '../mongodb/MongoTransactions';
import {
  verifySimpleAuth,
} from '../utils/auth';
import type { ConfigRepository } from '../repositories/ConfigRepository';

type IPayloadData = Partial<Config> & { categoriesOnly?: boolean };

class ConfigService extends MongoTransactions implements ConfigRepository {
  collection = Config.collection;

  payload: { getData: (requireAllFields?: boolean) => IPayloadData } & IPayloadData;

  categoriesOnly?: boolean = false;

  constructor(payload: IPayloadData) {
    super();
    this.payload = new Config(payload as any);
    if (payload.categoriesOnly) {
      this.categoriesOnly = payload.categoriesOnly;
    }
    this.getOne = this.getOne.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
  }

  async getOne(): Promise<Config | null> {
    const { customerId } = this.payload.getData();
    const data = await this.findOne({
      query: { customerId },
    });

    if (!data) throw new Error(`Config not found ${HttpStatusCodes.BAD_REQUEST}`);

    if (this.categoriesOnly) {
      return data.categories;
    }
    
    return data as any;
  }

  // create happens after an Accounts was made
  async create(): Promise<any> {
    const newData = this.payload.getData(true);
    const data = await this.findOne({ query: { customerId: newData.customerId } });
    if (data) throw new Error(`CustomerID already exists in Config ${HttpStatusCodes.BAD_REQUEST}`);

    await this.createOne({
      newData,
    } as any);

    return {
      msg: 'Succesfully created new config',
    };
  }

  // create happens after an Accounts was made
  async update(): Promise<any> {
    const newData = this.payload.getData();
    const data = await this.findOne({ query: { customerId: newData.customerId } });
    if (!data) throw new Error(`CustomerID do not exist ${HttpStatusCodes.BAD_REQUEST}`);


    await this.updateOne({
      query: { customerId: newData.customerId },
      newData,
    } as any);

    return {
      msg: 'Succesfully updated config',
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
    case Methods.POST:
      verifySimpleAuth(auth);
      return getBodyRes(service.create);
    case Methods.PUT:
      verifySimpleAuth(auth);
      return getBodyRes(service.update);

    default:
      throw new Error('Method not implemented.');
  }
};

export default config;

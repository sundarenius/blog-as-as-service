/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import type { IPayload, IFilter } from '../types/globals';
import { Methods, HttpStatusCodes } from '../types/globals';
import Account from '../models/Account';
import MongoTransactions from '../mongodb/MongoTransactions';
import {
  verifySimpleAuth,
} from '../utils/auth';
import type { AccountRepository } from '../repositories/AccountRepository';
import { Collections } from '../mongodb/mongo-config';

type IPayloadData = Partial<Account>

class AccountService extends MongoTransactions implements AccountRepository {
  collection = Collections.ACCOUNTS;

  payload: { getData: (requireAllFields?: boolean) => IPayloadData } & IPayloadData;

  constructor(payload: IPayloadData) {
    super();
    this.payload = new Account(payload as any);
    this.getOne = this.getOne.bind(this);
    this.create = this.create.bind(this);
  }

  async getOne(): Promise<Account | null> {
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
    const data = await this.findOne({ query: { customerId: this.payload.customerId } });
    if (data) throw new Error(`CustomerID already exists ${HttpStatusCodes.BAD_REQUEST}`);
    const findMail = await this.findOne({ query: { mail: this.payload.mail } });
    if (findMail) throw new Error(`Customer with this mail already exists ${HttpStatusCodes.BAD_REQUEST}`);
    

    await this.createOne({
      newData,
    } as any);

    return {
      msg: 'Succesfully created new account',
    };
  }
}

const account = async ({
  method,
  payload,
  auth,
  filter,
}: IPayload<IPayloadData>) => {
  const service = new AccountService(payload as IPayloadData);

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

    default:
      throw new Error('Method not implemented.');
  }
};

export default account;

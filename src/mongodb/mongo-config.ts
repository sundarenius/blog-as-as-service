/* eslint-disable max-len */
import dotenv from 'dotenv';

dotenv.config();

export enum MongoDbTransactionTypes {
  INSERT_MANY = 'insertMany',
  INSERT_ONE = 'insertOne',
  FIND = 'find',
  FIND_ONE = 'findOne',
  DELETE_MANY = 'deleteMany',
  DELETE_ONE = 'deleteOne',
  UPDATE_ONE = 'updateOne',
  UPDATE_MANY = 'updateMany',
  REPLACE_ONE = 'replaceOne',
}

// Make it const to set environment as prefix from process.env.NODE_ENV
export const DbName = () => `${process.env.APP_NAME}-${process.env.NODE_ENV || process.env.ENVIRONMENT}`;

export enum Collections {
  ARTICLES = 'ARTICLES',
}

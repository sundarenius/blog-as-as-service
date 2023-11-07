import mongoInstance from './init-mongo';
import { MongoDbTransactionTypes } from './mongo-config';
import type { Collections } from './mongo-config';

interface ITransactionParam {
  query?: Record<any, any>,
  newData?: Record<any, any>
  collectionCallback?: any
  collection?: Collections
}

abstract class MongoTransactions {
  abstract collection: Collections;

  findOne({ query, collectionCallback, collection }: ITransactionParam) {
    return mongoInstance({
      transaction: MongoDbTransactionTypes.FIND_ONE,
      query,
      collectionName: collection || this.collection,
      collectionCallback,
    });
  }

  findMany({ query, collectionCallback, collection }: ITransactionParam) {
    return mongoInstance({
      transaction: MongoDbTransactionTypes.FIND,
      query,
      collectionName: collection || this.collection,
      collectionCallback,
    });
  }

  createOne({ newData, collectionCallback, collection }: ITransactionParam) {
    return mongoInstance({
      transaction: MongoDbTransactionTypes.INSERT_ONE,
      newData,
      collectionName: collection || this.collection,
      collectionCallback,
    });
  }

  createMany({ newData, collectionCallback, collection }: ITransactionParam) {
    return mongoInstance({
      transaction: MongoDbTransactionTypes.INSERT_MANY,
      newData,
      collectionName: collection || this.collection,
      collectionCallback,
    });
  }

  updateOne({
    query,
    newData,
    collectionCallback,
    collection,
  }: ITransactionParam) {
    return mongoInstance({
      transaction: MongoDbTransactionTypes.UPDATE_ONE,
      newData,
      query,
      collectionName: collection || this.collection,
      collectionCallback,
    });
  }

  updateMany({
    query,
    newData,
    collectionCallback,
    collection,
  }: ITransactionParam) {
    return mongoInstance({
      transaction: MongoDbTransactionTypes.UPDATE_MANY,
      newData,
      query,
      collectionName: collection || this.collection,
      collectionCallback,
    });
  }

  deleteOne({ query, collectionCallback, collection }: ITransactionParam) {
    return mongoInstance({
      transaction: MongoDbTransactionTypes.DELETE_ONE,
      query,
      collectionName: collection || this.collection,
      collectionCallback,
    });
  }

  deleteMany({ query, collectionCallback, collection }: ITransactionParam) {
    return mongoInstance({
      transaction: MongoDbTransactionTypes.DELETE_MANY,
      query,
      collectionName: collection || this.collection,
      collectionCallback,
    });
  }
}

export default MongoTransactions;

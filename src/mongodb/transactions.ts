/* eslint-disable no-restricted-syntax */
/* eslint-disable dot-notation */
/* eslint-disable max-len */
import { MongoDbTransactionTypes } from './mongo-config';
import { v4 as uuidv4 } from 'uuid';
import type { IFilter } from '../types/globals'

const newIdKey = '_TID_';
const generateNewId = (currentId: string) => {
  if (currentId && currentId.includes(newIdKey)) return currentId;
  const uuid = uuidv4();
  const id = `${uuid}${newIdKey}-${new Date().getMinutes()}`;
  return id;
};

const getTidFromID = (id: string) => {
  const split = id.split('-');
  return split[split.length - 1];
};

const getTid = (data: any) => {
  const {
    customerId,
  } = data;
  if (customerId) {
    return getTidFromID(customerId);
  }
};

const collectionCallbackHandler = async (collectionCallback: any, collection: any) => {
  const callbackRes = await collectionCallback(collection);
  return callbackRes;
};

const mongoTransactions = (collection: any): Record<MongoDbTransactionTypes, any> => ({
  [MongoDbTransactionTypes.INSERT_MANY]: async (newData: any) => {
    const res = await collection.insertMany(newData);
    return res;
  },
  [MongoDbTransactionTypes.INSERT_ONE]: async (newData: any) => {
    const customerId = generateNewId(newData.customerId);
    const TID = getTid({ customerId });
    const res = await collection.insertOne({
      ...newData,
      customerId,
      created: new Date().getTime(),
      ...TID && { TID },
    });
    return res;
  },
  [MongoDbTransactionTypes.FIND_ONE]: async (newData: any, query: any) => {
    const TID = getTid(query);
    const res = await collection.findOne({
      ...query,
      ...TID && { TID },
    });
    return res;
  },
  [MongoDbTransactionTypes.FIND]: async (newData: any, query: any, collectionCallback: any) => {
    if (collectionCallback) return collectionCallbackHandler(collectionCallback, collection);
    const TID = getTid(query);
    const res = await collection.find({
      ...query,
      ...TID && { TID },
    }).sort({ created: -1 }).toArray();
    return res;
  },
  [MongoDbTransactionTypes.DELETE_MANY]: async (newData: any, query: any) => {
    const res = await collection.deleteMany(query);
    return res;
  },
  [MongoDbTransactionTypes.DELETE_ONE]: async (newData: any, query: any) => {
    const TID = getTid(query);
    const res = await collection.deleteOne({
      ...query,
      ...TID && { TID },
    });
    return res;
  },
  [MongoDbTransactionTypes.UPDATE_ONE]: async (newData: any, query: any, collectionCallback: any) => {
    if (collectionCallback) return collectionCallbackHandler(collectionCallback, collection);
    const TID = getTid(query);
    const data = {
      ...newData,
    };
    delete data.created;
    const res = await collection.updateOne({
      ...query,
      ...TID && { TID },
    },
    {
      $set: newData,
    },
    { upsert: false });
    return res;
  },
  [MongoDbTransactionTypes.UPDATE_MANY]: async (newData: any, query: any, collectionCallback: any) => {
    if (collectionCallback) return collectionCallbackHandler(collectionCallback, collection);
    const TID = getTid(query);
    const data = {
      ...newData,
    };
    delete data.created;
    const res = await collection.updateMany({
      ...query,
      ...TID && { TID },
    },
    {
      $set: newData,
    },
    { upsert: false });
    return res;
  },
  [MongoDbTransactionTypes.REPLACE_ONE]: async (newData: any, query: any) => {
    const res = await collection.replaceOne(query, newData, {
      upsert: true,
      filter: {},
    });
    return res;
  },
});

export const findFilterAndOrder = (filter: IFilter) => async (collection: any): Promise<any[]> => {
  // Constructing the filter criteria based on the provided filter object
  const query: any = {};
  const max = filter.max || 99;

  // Sorting based on orderByKey field
  const sort: any = {};
  const sortField = filter.orderByKey;
  sort[sortField] = -1; // 1 for ascending, -1 for descending

  // Add keyMatch criteria to the query if provided
  if (filter.keyMatch) {
    Object.keys(filter.keyMatch).forEach(key => {
      query[key] = { $in: (<any>filter.keyMatch)[key] };
    });
  }

  // Performing the find operation with filter, sort, startIndex, and max
  const res = await collection
    .find(query)
    .sort(sort)
    .skip(filter.startIndex || 0)
    .limit(max)
    .toArray();
  return res;
};

export default mongoTransactions;

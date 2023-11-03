import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import mongoTransactions from './transactions';
import { MongoDbTransactionTypes, DbName } from './mongo-config';

dotenv.config();

const url:string = process.env.NODE_ENV === 'development'
  ? 'mongodb://localhost:27017'
  // eslint-disable-next-line max-len
  : process.env.MONGODB_DB_URL as string;

const connectMongo = async ({
  transaction,
  newData,
  query,
  collectionName,
  collectionCallback,
}: any) => {
  const client = new MongoClient(url);
  await client.connect();
  console.log('Connected successfully to mongodb server');
  console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);
  const dbName = DbName();

  if (query && query.mail) {
    query.mail = query.mail.toLowerCase();
  }
  if (newData && newData.mail) {
    newData.mail = newData.mail.toLowerCase();
  }

  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  const transactions = mongoTransactions(collection);

  const res = await transactions[transaction as MongoDbTransactionTypes
    || MongoDbTransactionTypes.FIND](newData, query, collectionCallback);

  const resData = {
    success: true,
    db: dbName,
    collection: collectionName,
    type: `Type of transaction: ${transaction || MongoDbTransactionTypes.FIND}`,
    res,
  };

  console.log('Log from connectMongo function:');
  console.log(JSON.stringify(resData, null, 4));

  await client.close();

  return res;
};

const mongoInstance = async (parameters: any) => {
  try {
    const res = await connectMongo(parameters);
    return res;
  } catch (err) {
    console.error(err);
    throw new Error(err as any);
  }
};

if (process.argv[2] === 'run') {
  console.log(process.argv);
  mongoInstance({});
}

export default mongoInstance;

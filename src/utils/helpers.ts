import type { Response } from 'express';
import type { IPayload } from '../types/globals';
import { HttpStatusCodes, ArticleStatus } from '../types/globals';
import { API } from '../http/http';

export const formatResponse = (
  body: IPayload<Record<any, any>>['payload'],
  statusCode: number,
  res: Response,
) => {
  if (Object.keys(body).length > 0) {
    deleteSensitive(body);
  }

  const options = {
    statusCode,
    body: JSON.stringify({
      success: statusCode === 200 ? 'true' : 'false',
      statusCode,
      data: body,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'content-type': 'application/json',
    },
  };
  res.status(statusCode);
  res.header(options.headers);
  res.send(options.body);
};

export const deleteSensitive = (data: any) => {
  if (Array.isArray(data)) {
    data.forEach((d) => {
      // eslint-disable-next-line no-underscore-dangle
      delete d._id;
      delete d.TID;
      delete d.pwd;
      delete d.blockedUsers;
    })
  } else {
    // eslint-disable-next-line no-underscore-dangle
    delete data._id;
    delete data.TID;
    delete data.pwd;
    delete data.blockedUsers;
  }
};

export const getModelData = <IEntity>(allRequired: boolean, data: Record<any, any>) => {
  // Remove properties with undefined values
  Object.keys(data).forEach((key) => {
    if (allRequired && data[key] === undefined) {
      throw new Error(`This method requires all fields ${HttpStatusCodes.BAD_REQUEST}`);
    }
    if (typeof data[key] === 'string') {
      data[key] = data[key].trim();
    }
    return data[key] === undefined && delete data[key];
  });

  return data as Partial<IEntity>;
};

export function getRandomFromArray(arr: Array<number|string>) {
  if (arr.length === 0) {
    return null; // Return null if the array is empty
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

function urlEncodeString(inputString: string) {
  return encodeURIComponent(inputString);
}

// Make this in EC2
export const triggerAiJob = async (data: any) => {
  console.log('triggerAiJob:');
  const triggerRes = await API.triggerEc2(data);
  console.log(triggerRes);
  return triggerRes;
}

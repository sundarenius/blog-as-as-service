/* eslint-disable import/no-extraneous-dependencies */
import type { IPayload } from '../types/globals';
import { HttpStatusCodes, Methods } from '../types/globals';
import article from '../services/Article';

export const formatErrorRes = (body: IPayload<unknown>['payload'], statusCode: HttpStatusCodes) => ({
  body,
  statusCode,
});

const catchWrapper = async (handler: any, payload: IPayload<unknown>) => {
  try {
    return await handler(payload);
  } catch (err: any) {
    // status can be set as "throw new Error(`some message ${statusCode}`)" (last index in message)
    const splitted = err.message.split(' ');
    const statusCodeFromMsg = Number(splitted[splitted.length - 1]);

    const errorMsg = !Number.isNaN(statusCodeFromMsg)
      ? splitted.filter((val: string) => Number.isNaN(Number(val))).join(' ')
      : err.message;
    const body = {
      errorMsg,
      err,
    };

    const failedStatus = statusCodeFromMsg || HttpStatusCodes.INTERNAL_SERVER_ERROR;
    console.log(errorMsg);
    console.log(err.stack);
    return formatErrorRes(body, failedStatus);
  }
};

// Custom routes. Grapgql route is defined from main.ts
export const routes = [
  {
    path: '/article',
    handler: (payload: IPayload<unknown>) => catchWrapper(article, payload),
    Methods: [Methods.GET, Methods.POST],
  },
];

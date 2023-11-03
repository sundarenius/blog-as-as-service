/* eslint-disable import/no-extraneous-dependencies */
import { formatResponse } from '../utils/helpers';
import type { IPayload } from '../types/globals';
import type { Response, Request } from 'express';

export const formatPayloadAndReturnHandler = (
  handler: (body: IPayload<unknown>) => Promise<any>,
) => async (req: Request, res: Response) => {
  const { method } = req;
  console.log(`method: ${method}`);
  const payload = Object.keys(req.body).length > 0 ? req.body : req.query;
  console.log('payload:');
  console.log(payload);

  let filter = null;
  if (payload.filter) {
    const clonePayload = JSON.parse(JSON.stringify(payload));
    filter = clonePayload.filter;
    delete payload.filter;
  }

  const { body, statusCode } = await handler(<IPayload<unknown>>{
    payload,
    method,
    auth: req.header('Authorization'),
    ...filter && { filter },
    req,
    res,
  });
  formatResponse(body, statusCode, res);
};

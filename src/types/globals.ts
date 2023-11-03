import type { Request } from 'express';

export enum HttpStatusCodes {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  INTERNAL_SERVER_ERROR = 500,
  NOT_FOUND = 404,
  OK = 200
}

export interface IPayload<I> {
  payload: I;
  method: Request['method'],
  auth: string,
  filter?: IFilter
}

export type TSetHttpStatus = (status: HttpStatusCodes) => void;

export interface IPayloadFilter {
  from?: number
  end?: number,
}

export enum Methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export interface IFilter {
  keyMatch: Record<string, Array<string|boolean|number>> | null,
  orderByKey: string,
  startIndex: number,
  max?: number,
}

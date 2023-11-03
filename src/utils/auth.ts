/* eslint-disable import/no-extraneous-dependencies */
import { HttpStatusCodes } from '../types/globals';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const secretKey = 'a123asd98-x-dfdflkjdpppYHDNL83678';

const extractTokenFromHeader = (authHeader: string) => {
  if (authHeader.includes('bearer')) {
    const split = authHeader.split('bearer ');
    return split[1] as string;
  }
  if (authHeader.includes('Bearer')) {
    const split = authHeader.split('Bearer ');
    return split[1] as string;
  }
  return '';
};

export const signNewJwtToken = (data: Record<any, any>, expiry: string = '2h') => {
  const token = jwt.sign(data, secretKey, { expiresIn: expiry });
  return token;
};

export const verifyJwtToken = (t: string) => {
  const token: string = extractTokenFromHeader(t);

  if (!token) {
    throw new Error(`Access denied, token missing ${HttpStatusCodes.FORBIDDEN}`);
  }

  try {
    jwt.verify(token, secretKey);
  } catch (error) {
    throw new Error(`Access denied. Invalid token ${HttpStatusCodes.BAD_REQUEST}`);
  }
};

export const getTokenClientData = (data: any): Record<any, any> => {
  const d = { ...data };
  // eslint-disable-next-line no-underscore-dangle
  delete d._id;
  delete d.pwd;
  return d;
};

export const decodeJwtToken = (t: string) => {
  if (!t) return null;
  const token: string = extractTokenFromHeader(t);
  const data = jwt.decode(token);
  return data;
};

export const validatePwd = async (pwd: string, dbHash: any) => new Promise((resolve, reject) => {
  bcrypt
    .compare(pwd, dbHash)
    .then((res) => {
      resolve(res); // will be true if they match
    })
    .catch((err) => {
      console.log(err);
      reject(err.message);
    });
});

export const hashPwd = async (pwd: string) => {
  const saltRounds = 10;
  return new Promise((resolve, reject) => {
    bcrypt
      .hash(pwd, saltRounds)
      .then((hash) => {
        resolve(hash);
      })
      .catch((err) => reject(err.message));
  });
};

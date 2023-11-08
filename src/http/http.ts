import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();


enum MethodTypes {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

const fetchMethod = async (url: string, method: MethodTypes, payload: any, extraHeaders = {}) => {
  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...extraHeaders,
      },
      ...payload && { body: JSON.stringify(payload) },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log('failed');
    console.log(err);
    return false;
  }
};

export const API = {
  getPictures: async ({ keyword, tag }: any) => {
    const url = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${keyword}&image_type=photo&category=${tag}`;
    const data = await fetchMethod(url, MethodTypes.GET, null);
    return data;
  },
  triggerEc2: async (payload: any) => {
    // ec2 instance IP
    const url = `${process.env.EC2_IP_ENDPOINT}/api/v1/article`;
    const data = await fetchMethod(
      url,
      MethodTypes.POST,
      payload,
      { Authorization: `Bearer ${process.env.MY_API_POST_KEY}`, }
    );
    return data;
  },
};

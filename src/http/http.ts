import fetch from 'node-fetch';


enum MethodTypes {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

const fetchMethod = async (url: string, method: MethodTypes, payload: any) => {
  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
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
};

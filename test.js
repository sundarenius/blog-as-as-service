// make a script to init DB with two accounts, conversations and messages between them
const fetch = require('node-fetch');
require('dotenv').config();

const req = (token) => async(
  method,
  payload,
  url,
) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const response = await fetch(url, {
      method,
      ...payload && { body: JSON.stringify(payload) },
      headers,
    });
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error(error);
    throw new Error('Error from req');
  }
}

const urls = {
  dev: 'http://localhost:3030/api/v1',
}

const getUrl = () => urls.dev;


const init = async () => {
  const getPictures = await req(process.env.HAKAN_API_SECRET)(
    'GET',
    null,
    `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q="Dating in Different Cultures"&image_type=photo`
  )
  console.log(getPictures);
}

init();

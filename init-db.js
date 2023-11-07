// make a script to init DB with two accounts, conversations and messages between them
const fetch = require('node-fetch');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const decodeJwtToken = jwt.decode;

const encryptPwdV1 = (pwd) => pwd
  .replace(/1/g, 'Z').replace(/2/g, '9').replace(/3/g, 'G').replace(/4/g, 'F')
  .replace(/5/g, '3')
  .replace(/6/g, 'K')
  .replace(/7/g, '3')
  .replace(/8/g, 'C')
  .replace(/9/g, 'W')
  .replace(/0/g, 'J')
  .replace(/q/g, 'Z')
  .replace(/w/g, 'R')
  .replace(/e/g, 'T')
  .replace(/r/g, 'M')
  .replace(/t/g, 'N')
  .replace(/y/g, '7')
  .replace(/u/g, '9')
  .replace(/i/g, '9')
  .replace(/o/g, 'I')
  .replace(/p/g, '4')
  .replace(/å/g, '8')
  .replace(/a/g, 'W')
  .replace(/s/g, '7')
  .replace(/d/g, '8')
  .replace(/f/g, 'C')
  .replace(/g/g, 'R')
  .replace(/h/g, '9')
  .replace(/j/g, '6')
  .replace(/k/g, 'R')
  .replace(/l/g, 'L')
  .replace(/ö/g, 'C')
  .replace(/ä/g, 'E')
  .replace(/z/g, 'V')
  .replace(/x/g, 'A')
  .replace(/c/g, 'W')
  .replace(/v/g, 'G')
  .replace(/b/g, 'M')
  .replace(/g/g, '5')
  .replace(/m/g, '7')
  .replace(/,/g, 'B')
  .replace(/-/g, 'S');

const now = () => new Date().getTime();

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
  staging: 'https://bookified-staging.herokuapp.com/api/v1',
  production: 'https://www.bookified.se/api/v1'
}

const getUrl = () => urls.dev;

const article = async (_req, pwd, mail) => {
  const payload = {
    pictureUrl: 'https://pixabay.com/get/g6a26d9999b0968b5098c4f9ffbb135620c03db78a7fbfabf35a6768f0859926493bf6f6feb81f4beed6ed23dad0ac5299ecbad3b888b71975d5baa82c531e313_640.jpg',
    category: 'Long-Distance Relationships',
    title: 'Building Successful Long-Distance Relationships: Insights from a JW Singles Perspective',
    created: 1699360050832,
    id: Math.random() * 12999,
    content: "<p>Long-distance relationships can pose unique challenges, but with the right approach, they can thrive. As a JW single, it's important to apply biblical principles and truths to your dating journey. By focusing on shared faith and values, you can establish a strong foundation from the start.</p><p>Online dating can be a useful tool, enabling JW singles to connect with like-minded individuals worldwide. Jehovas Witnesses dating site online are available, providing a platform tailored to the needs of JW singles.</p><p>However, success in long-distance relationships goes beyond technology. Regular communication, trust, and understanding are key. Make time for video calls, send handwritten letters, and always be open and honest with your partner.</p><p>Remember that true success is not measured solely by physical proximity, but by the love and commitment you share. Ultimately, it's God who watches over and blesses our relationships. By following His guidance and seeking His will, you can build a successful long-distance relationship that stands the test of time.</p>"
  };
  const res = await _req(
    'POST',
    payload,
    `${getUrl()}/article`,
  )

  const { data } = res;
  SOME_VALID_JWT_TOKEN = data.token;
  return data;
}

const init = async () => {
  const accountOne = await createAccount(req(''), 'test', 'mail@mail.com');
}

init();

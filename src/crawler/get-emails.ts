import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Function to get a new temporary email address

const options = (apiUrl: string) => ({
  method: 'GET',
  url: apiUrl,
  headers: {
    'X-RapidAPI-Key': process.env.X_RapidAPI_Key,
    'X-RapidAPI-Host': 'privatix-temp-mail-v1.p.rapidapi.com'
  }
});

export async function getEmail(email: string) {
  const md5Hash = crypto.createHash('md5').update(email).digest('hex');
  const apiUrl = `https://privatix-temp-mail-v1.p.rapidapi.com/request/mail/id/${md5Hash}`;
  try {
    const response = await axios.request(options(apiUrl));
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function getDomains() {
  const apiUrl = `https://privatix-temp-mail-v1.p.rapidapi.com/request/domains/`;
  try {
    const response = await axios.request(options(apiUrl));
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

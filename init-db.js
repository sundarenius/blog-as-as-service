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

const createAccount = async (_req, pwd, mail) => {
  const payload = {
    "pwd": encryptPwdV1(pwd),
    "mail": mail,
    "userId": "x",
    "mailNotifications": {
      "matches": true,
      "likes": true,
      "messages": true
    },
    "contactPreferences": "All",
    "subscription": null,
    "autoRenewal": true,
    "trialTo": 1634524800000,
    showPictures: 'All',
  }
  const res = await _req(
    'POST',
    payload,
    `${getUrl()}/account`,
  )

  const { data } = res;
  SOME_VALID_JWT_TOKEN = data.token;
  return data;
}

const createProfile = async (_req, gender, userName, pictures) => {
  const payload = {
    gender,
    userName,
    "dateOfBirth": "1990-01-01",
    "continent": "North America",
    "country": "United States",
    "city": "New York",
    "lastLogin": now(),
    "modified": now(),
    "created": now(),
    userId: 'x',
    "headline": "Hello World!",
    "aboutMe": "I am a friendly person who loves to travel and explore new places.",
    "aboutMyMatch": "I am looking for someone who shares my passion for adventure and has a great sense of humor.",
    pictures,
    "blockedUsers": ["blockedUser1", "blockedUser2"],
    preferences: [
      {
        key: 'gender',
        label: ['Gender'],
        values: [gender === 'male' ? 'male' : 'female', gender === 'male' ? 'female' : 'male'],
      },
      {
        key: 'location',
        label: ['Match location'],
        values: [null, ['Sweden', 'Denmark']],
      },
      {
        key: 'ageInterval',
        label: ['Age interval'],
        values: [null, ['25 - 45']],
      },
      {
        key: 'height',
        label: ['Height', 'Min height'],
        values: ['160 cm', '170 cm'],
      },
      {
        key: 'attractiveness',
        label: ['Attractiveness'],
        values: ['Attractive', ['Average', 'Attractive', 'VeryAttractive']],
      },
      {
        key: 'bodyType',
        label: ['Body type'],
        values: ['Athletic', 'All'],
      },
      {
        key: 'relationshipStatus',
        label: ['Relationship status'],
        values: ['Single', 'All'],
      },
      {
        key: 'educationLevel',
        label: ['Educational level'],
        values: ['High school', 'All'],
      },
      {
        key: 'languages',
        label: ['Languages'],
        values: [['English', 'Swedish'], 'English'],
      },
      {
        key: 'ethnicity',
        label: ['Ethnicity'],
        values: ['Mixed', 'All'],
      },
      {
        key: 'drinkingHabits',
        label: ['Drinking habits'],
        values: ['Social drinker', 'All'],
      },
      {
        key: 'hasKids',
        label: ['Has kids'],
        values: ['No', 'All'],
      },
      {
        key: 'wantKids',
        label: ['Want kids'],
        values: ['Maybe', 'All'],
      },
      {
        key: 'lookingFor',
        label: ['Looking for'],
        values: ['Marriage', 'Marriage'],
      },
      {
        key: 'income',
        label: ['Income'],
        values: ['Enough', 'All'],
      },
    ],    
  };

  const res = await _req(
    'POST',
    payload,
    `${getUrl()}/profile`,
  )

  const { data } = res;
  return data;
}

const createMessage= async (_req, recieverUserId) => {
  const payload = {
    "userId": "x",
    recieverUserId,
    "youHaveRead": false,
    "lastMessageSent": now(),
    "conversationId": "x",
    "archived": false
  };

  const res = await _req(
    'POST',
    payload,
    `${getUrl()}/messages`,
  )

  const { data } = res;
  return data;
}

const init = async () => {
  const accountOne = await createAccount(req(''), 'test', 'mail@mail.com');
  const accountTwo = await createAccount(req(''), 'test', 'sundarenius@gmail.com');
  const accountThree = await createAccount(req(''), 'test', 'emma@stone.com');
  const userIdTwo = decodeJwtToken(accountTwo.token).userId;
  await createProfile(
    req(accountOne.token),
    'female',
    'some_women_123',
    [
      {
        "main": true,
        "url": "https://heroku-static.herokuapp.com/mega-fox.jpg"
      },
      {
        "main": false,
        "url": "https://cdn.britannica.com/75/191075-050-DC41EAFD/Megan-Fox-2012.jpg"
      }
    ]
  );
  await createProfile(
    req(accountTwo.token),
    'male',
    'some_man_123',
    [
      {
        "main": true,
        "url": "https://heroku-static.herokuapp.com/chris-hemsworth.webp"
      },
      {
        "main": false,
        "url": "https://m.media-amazon.com/images/M/MV5BOTU2MTI0NTIyNV5BMl5BanBnXkFtZTcwMTA4Nzc3OA@@._V1_FMjpg_UX1000_.jpg"
      }
    ]
  );
  await createProfile(
    req(accountThree.token),
    'female',
    'emma_stone_123',
    [
      {
        "main": true,
        "url": "https://m.media-amazon.com/images/M/MV5BMjI4NjM1NDkyN15BMl5BanBnXkFtZTgwODgyNTY1MjE@._V1_FMjpg_UX1000_.jpg"
      },
      {
        "main": false,
        "url": "https://cdn.britannica.com/78/194178-050-7ABF2B15/Emma-Stone-La-Land-Damien-Chazelle.jpg"
      }
    ]
  );

  await createMessage(req(accountOne.token), userIdTwo);
}

init();
  
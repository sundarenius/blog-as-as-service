/* eslint-disable */
const fetch = require('node-fetch');

const req = async(
  method,
  payload,
  url,
  apiKey,
) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...apiKey && { 'x-api-key': apiKey },
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

const baseUrl = 'http://localhost:3030/api/v1';

const start = async () => {
  // new customer
  const newCustomer = await req(
    'POST',
    {
      "customerId": "",
      "name": "another company",
      "frontEndTemplate": "standard-white",
      "logo": "some_url.com.x",
      "mail": "john.doe@mail.com",
      "phone": "070000000",
      "businessHours": ["09:00", "19:00"],
      "lunchBreak": ["12:00", "13:00"],
      "services": [{
          "title": "Klippning kort hår man",
          "price": 399,
          "currency": "SEK",
          "durationMinutes": 30
      }]
    },
    `${baseUrl}/customer`
  );

  const customerId = newCustomer.data.customerId;

  // new staff
  await req(
    'POST',
    {
      "customerId": customerId,
      "fullname": "My Name",
      "picture": "picture.url",
      "mail": null,
      "phone": "076700000",
      "availability": {
          "startDate": 1677661828502,
          "endDate": 1683706281823,
          "availability": [
              {
                  "dayOfWeek": 1,
                  "startTime": "09:00",
                  "lunchTime": ["12:00", "13:00"],
                  "endTime": "17:00"
              }
          ]
      },
      "notificationBy": "phone"
    },
    `${baseUrl}/staff`
  );

  // new texts
  await req(
    'POST',
    {
      "customerId": customerId,
      "texts": {
          "dif": "bra grejer",
          "hej": "asd",
          "okej": "hej"
      }
    },
    `${baseUrl}/staff`
  );

  // new users
  await req(
    'POST',
    {
      "customerId": customerId,
      "fullname": "my name",
      "role": "admin",
      "username": "myusername",
      "pwd": "hejsan",
      "createdBy": "admin"
    },
    `${baseUrl}/users`
  );

  // new appointments
  const appointment = await req(
    'POST',
    {
      "customerId": customerId,
      "appointmentId": "",
      "service": "Man kort hår",
      "startTime": 1682756644592,
      "durationMinutes": 30,
      "staff": "Maja Fox",
      "price": 399,
      "currency": "SEK",
      "attendee": "John Doe",
      "seen": false,
      "comment": "Bra service och nöjd, tuseen tack!!",
      "cancelled": false,
      "addedByAdmin": false
    },
    `${baseUrl}/appointments`
  );

  await req(
    'POST',
    {
      "customerId": customerId,
      "appointmentId": "",
      "service": "Kvinna långt hår",
      "startTime": new Date(new Date().setDate(34)).getTime(),
      "durationMinutes": 30,
      "staff": "Maja Fox",
      "price": 399,
      "currency": "SEK",
      "attendee": "Lisa Ajax",
      "seen": false,
      "comment": "Bra service och nöjd, tack så mycket!!",
      "cancelled": false,
      "addedByAdmin": true
    },
    `${baseUrl}/appointments`
  );

  const appointmentId = appointment.data.appointmentId;

  // new feedback
  await req(
    'POST',
    {
      "customerId": customerId,
      "appointmentId": appointmentId,
      "service": "Man kort hår",
      "startTime": new Date(new Date().setDate(-10)).getTime(),
      "staff": "Maja Fox",
      "price": 399,
      "currency": "SEK",
      "attendee": "John Doe2",
      "seen": false,
      "review": "Bra service och nöjd, tusen tack!!",
      "public": false,
      "rating": 5
    },
    `${baseUrl}/feedback`
  );

}

start();

import { generateRandomFullName } from './names';
import { eventTypes } from './scrape-anything';

const getMail = async (name: string) => {
  // get domain mail from temp API
  return `${name.split(' ').join('.')}@mail.com`;
};

const instagramSignUp = ({ mail, name }: any) => {
  return {
    url: 'https://www.instagram.com/accounts/emailsignup/',
    events: [
      {
        type: eventTypes.CLICK,
        textTarget: 'Allow all cookies',
      },
      {
        type: eventTypes.INPUT,
        textTarget: 'Mobile number or email address',
        value: mail,
      },
      {
        type: eventTypes.INPUT,
        textTarget: 'Full Name',
        value: name,
      },
      {
        type: eventTypes.CLICK,
        textTarget: 'Refresh Suggestion',
      },
      {
        type: eventTypes.INPUT,
        textTarget: 'Password',
        value: 'hejsan'
      },
      {
        type: eventTypes.CLICK,
        textTarget: 'Next',
      },
      {
        type: eventTypes.SELECT,
        value: 'August'
      },
      {
        type: eventTypes.SELECT,
        value: '1'
      },
      {
        type: eventTypes.SELECT,
        value: '2000'
      },
      {
        type: eventTypes.CLICK,
        textTarget: 'Next',
      },
    ],
  };
}

const getConfig = async () => {
  const name = generateRandomFullName();
  const mail = await getMail(name);
  const config = instagramSignUp({
    name,
    mail
  });
  return config;
}

export default getConfig as any;
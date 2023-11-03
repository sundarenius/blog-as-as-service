import { eventTypes } from './scrape-anything';
import { generateRandomFullMaleName, generateRandomFullFemaleName } from './names';
import { getDomains, getEmail } from './get-emails';

const jwMatchTest = ({
  username,
  pwd,
}: any) => {
  return {
    browserStayOpen: false,
    url: 'https://www.jwmatch.com/s/',
    events: [
      {
        type: eventTypes.CLICK,
        selector: '#loginBox',
      },
      {
        type: eventTypes.INPUT,
        selector: '#loginUsername_headerLogin',
        value: username,
      },
      {
        type: eventTypes.INPUT,
        selector: '#loginPassword_headerLogin',
        value: pwd,
      },
      {
        type: eventTypes.CLICK,
        textTarget: 'Log In',
      },
      {
        waitBefore: 5000,
        type: eventTypes.CLICK,
        selector: 'img[class="noPic responsive"]',
      },
      {
        type: eventTypes.CLICK,
        selector: 'a[href="/s/profile/"]',
      },
      {
        waitBefore: 5000,
        type: eventTypes.CLICK,
        selector: 'a[id=profile_meNav]',
      },
      {
        waitBefore: 5000,
        ifTextTarget: 'Tell us about yourself',
        type: eventTypes.CLICK,
        textTarget: 'Save & Continue',
        navigateBottom: true,
      },
      {
        waitBefore: 5000,
        ifTextTarget: 'Help us find your best matches',
        type: eventTypes.CLICK,
        textTarget: 'Save & Continue',
        navigateBottom: true,
      },
      {
        waitBefore: 5000,
        type: eventTypes.INPUT,
        textTarget: 'headline',
        value: 'Visit jwdate[dot]org for free and improved JW singles exclusive dating'
      },
      {
        type: eventTypes.INPUT,
        selector: 'textarea[id=narrative]',
        value: matchText,
      },
      {
        type: eventTypes.INPUT,
        selector: 'textarea[id=mNarrative]',
        value: matchText,
      },
      {
        type: eventTypes.CLICK,
        textTarget: 'Save & Continue',
      },
    ],
  };
}

const matchText = 'Visit jwdate[dot]org for free and improved JW singles only dating - Meet brothers and sisters looking for partners worldwide - This is a new site where single JW people can meet and mingle affordable without high costs - It’s free and with powerful matching features';

const getConfig = async () => {
  const configMailOne = jwMatchTest({
    username: 'Joseph_7664',
    pwd: 'hejsan',
  });
  return configMailOne;
}

export default getConfig as any;
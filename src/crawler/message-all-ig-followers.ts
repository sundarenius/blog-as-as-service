import { eventTypes } from './scrape-anything';

const messageAllFollowersPerAccount = ({ mail, pwd, urls }: any) => {
  return {
    browserStayOpen: true,
    url: 'https://www.instagram.com/accounts/login/',
    events: [
      {
        type: eventTypes.CLICK,
        textTarget: 'Allow all cookies',
      },
      {
        type: eventTypes.INPUT,
        textTarget: 'Phone number, username or email address',
        value: mail,
      },
      {
        type: eventTypes.INPUT,
        textTarget: 'Password',
        value: pwd,
      },
      {
        type: eventTypes.CLICK,
        textTarget: 'Log in',
        waitForNavigationAfterEvent: true,
      },
      {
        type: eventTypes.NAVIGATION,
        goto: urls[0],
      },
      {
        type: eventTypes.EVALUATE,
        evaluateCallback: evaluates.followFromFollowersList,
      },
    ],
  };
}

const messages = [
  `Hello! I hope this message finds you well!
I just shortly want to recommend you a new dating for JW singles only. Brothers and sisters looking for partners in the truth.
It is totally to free. Visit www.jwdate.org.
Best regards //
August`,
  `Greetings! Wanted to share a new JW singles dating site: www.jwdate.org. It's free and exclusive to those seeking partners in the truth. Best wishes, August.`,
  `Hi there! Quick recommendation: www.jwdate.org, a new dating site for JW singles. It's free and dedicated to helping brothers and sisters find partners in the truth. Warm regards, August.`,
]

const getConfig = async () => {
  const configMailOne = messageAllFollowersPerAccount({
    mail: 'dejerop427@monutri.com',
    pwd: 'hejsan',
    urls: [
      'https://www.instagram.com/jw_singles/followers/',
      'https://www.instagram.com/jw_singles_int/followers/',
    ]
  });
  return configMailOne;
}

const evaluates = {
  followFromFollowersList: async () => {
    let newFollowed = 0;
    const getUsers = () => Array.from(document.querySelectorAll("body > div > div > div > div > div > div > div > div > div > div > div > div._aano > div:nth-child(1) > div > div"));
    let usersLenght = 0;
    const loopUsers = async () => {
      const users = getUsers();
      usersLenght = users.length;
      for (let i = 0; i < users.length; i++) {
        usersLenght = i;
        const user: any = users[i];
        if (user.innerText.includes('Follow') && !user.innerText.includes('Following')) {
          user.querySelector('button').click();
          await new Promise((resolve) => { setTimeout(() => { resolve(''); }, 1500);})
          newFollowed += 1;
        }
      }
    }
    const loadMore = async () => {
      const contentDiv = document.querySelector("body > div > div > div > div > div > div > div > div > div > div > div > div._aano") as HTMLElement;
      contentDiv.scrollTop = contentDiv.scrollHeight;

      const users = getUsers();
      if (users.length > (usersLenght - 5) && newFollowed < 200) {
        await loopUsers();
        loadMore();
      }
    }

    await loadMore();
  },
  getProfileUrlsFromFollowerList: async () => {
    let urls: string[] = [];
    const getUsersArr: any = () => Array.from(document.querySelectorAll("body > div > div > div > div > div > div > div > div > div > div > div > div._aano > div:nth-child(1) > div a"));
    const getUsersUrls = () => {
      const userUrls = getUsersArr().map((v: any) => v.href);
      urls = userUrls as string[];
      return userUrls;
    }
    const loadMore = async () => {
      const contentDiv = document.querySelector("body > div > div > div > div > div > div > div > div > div > div > div > div._aano") as HTMLElement;
      contentDiv.scrollTop = contentDiv.scrollHeight;
    }
    const fillUrls = async () => {
      getUsersUrls();
      loadMore();
      await new Promise((resolve) => { setTimeout(() => { resolve(''); }, 3500)});
      if (getUsersArr().length > urls.length) {
        await fillUrls();
      }
    }
    await fillUrls();
    const uniqueStrings = new Set(urls);
    return Array.from(uniqueStrings);
  }
}

const eachEvaluateResEvents = {
  sendMessageToUrlList: (url: string) => ([
    {
      type: eventTypes.NAVIGATION,
      goto: url,
    },
    {
      type: eventTypes.CLICK,
      textTarget: 'Follow'
    },
    {
      type: eventTypes.CLICK,
      textTarget: 'Message'
    },
    {
      type: eventTypes.CLICK,
      textTarget: 'Not Now'
    },
    {
      type: eventTypes.INPUT,
      textTarget: 'Message...',
      value: messages[Math.floor(Math.random() * messages.length)],
    },
    {
      type: eventTypes.CLICK,
      textTarget: 'Send',
    },
  ])
}

export default getConfig as any;
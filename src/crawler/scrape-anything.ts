import puppeteer from 'puppeteer';
import getConfig from './jw-match-acc-marketing';
import dotenv from 'dotenv';

dotenv.config();

const initBrowser = async (url: any) => {
  const puppeteerOptions = {
    devtools: false, // false for headless
    args: [
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ],
    slowMo: 10,
    defaultViewport: null,
    executablePath: process.env.CHROMIUM_PATH,
  }
  const browser = await puppeteer.launch(puppeteerOptions);
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');

  await page.goto(url);
  return {
    browser,
    page
  };
};

const getSelectorByText = async (page: any, targetText: any, eventType: any, value: any) => {
  const result = await page.evaluate(({ targetText, eventType, value }: any) => {
    const start = (targetText: any) => {
      const getCssSelector = (el: any) => {
        let path: any = [];
        let parent: any = null;
        while (parent = el.parentNode) {
          path.unshift(`${el.tagName}:nth-child(${[].indexOf.call(parent.children, el as never)+1})`);
          el = parent;
        }
        return `${path.join(' > ')}`.toLowerCase();
      };
      
      const elements = document.getElementsByTagName('*');
      for (let i = 0; i < elements.length; i++) {
        const element: any = elements[i];

        const getIsElMatch = (el: any, _targetText: any) => {
          // const elValue = el.value;
          const elPlaceholder = el.placeholder;
          const elAriaLabel = el.getAttribute('aria-label');
          const labelAttr = el.getAttribute('label');
          const label = el.label;
          const elContent = el.textContent;
          const innerHTML = el.innerHTML;
          const innerText = el.innerHTML;
          const title = el.title;
          const name = el.name;
          const id = el.id;
          const value = el.value;
          const result = elContent === _targetText
          || elPlaceholder === _targetText
          || elAriaLabel === _targetText
          || labelAttr === _targetText
          || label === _targetText
          || innerHTML === _targetText
          || innerText === _targetText
          || title === _targetText
          || id === _targetText
          || value === _targetText
          || name === _targetText;
          return result;
        }

        // If isInputField it should only match input fields
        if (eventType === 'input' && element.tagName !== 'INPUT') {
          continue;
        }

        if (eventType === 'select' && element.tagName === 'SELECT' && getIsElMatch(element, targetText)) {
          const options = element.querySelectorAll('option');
          for (let j = 0; j < options.length; j++) {
            const option = options[j];
            const elMatch = getIsElMatch(option, value);
            if (elMatch) {
              element.style.color = 'red';
              return getCssSelector(element as any);
            }
          }
        }

        // IF did not pass above, should not continue
        if (eventType === 'select' && element.tagName === 'SELECT') {
          continue;
        }

        const isElMatch = getIsElMatch(element, targetText);
  
        if (isElMatch) {
            element.style.color = 'red'; // just to see something
            return getCssSelector(element);
        }
      }
    }
    return start(targetText);
  }, {
    targetText,
    eventType,
    value
  })

  console.log('result:');
  console.log(result);
  return result;
}

const input = async (page: any, selector: any, text: any) => {
  await page.type(selector, text, {delay: 50});
};

const select = async (page: any, selector: any, text: any) => {
  await page.select(selector, text);
};

const click = async (page: any, selector: any) => {
  await page.click(selector);
};

const identifyAndSolveCaptcha = async (page: any) => {
  return null;
}

const scrape = async (config: any) => {
  console.log('config.url:');
  console.log(config.url);
  const { browser, page } = await initBrowser(config.url);
  await page.waitForSelector('body');

  await loopConfigEvents(config.events, page);
  
  // Close the browser
  if (!config.browserStayOpen) {
    await browser.close();
  }
}

const tryCatch = async (callback: any) => {
  try {
    await callback();
  } catch (error) {
    console.log(error);
  }
}

const configEventFunction = async (i: number, events: any, page: any, next: any) => {
  const event = events[i];
  const eventType = event.type;
  let value = event.value;
  const textTarget = event.textTarget;
  await delay(1500);

  if (event.getValue) {
    const val = event.getValue();
    value = val;
  }

  if (event.waitBefore) {
    await delay(event.waitBefore);
  }

  if (event.navigateBottom) {
    await page.evaluate(() => {
      const contentDiv = document.querySelector("body") as HTMLElement;
      contentDiv.scrollTop = contentDiv.scrollHeight;
    });
    await new Promise((resolve) => { setTimeout(() => { resolve(''); }, 1000);});
  }

  // Check for captchas and clouflare verifications and solve first if they exist
  // I have no solution at moment for cloudflare, but for captchas we can use 2captchas
  // Let's make it simple and focus on sites with no anti bot verifications.
  await identifyAndSolveCaptcha(page);

  const getDom = async () => {
    if (textTarget) {
      const selector = await getSelectorByText(page, textTarget, eventType, value);
      return selector;
    }
    if (event.selector) {
      return event.selector
    }
  }

  if (event.ifTextTarget) {
    // only execute event "ifTextTarget" is available "eventTypes.CLICK" because we are only looking for general text
    const dom = await getSelectorByText(page, event.ifTextTarget, eventTypes.CLICK, value);
    if (!dom) {
      next();
    }
  }
  
  console.log(`eventType: ${eventType}`);
  if (eventType === eventTypes.CLICK) {
    const selector = await getDom();
    if (selector) {
      await click(page, selector);
      await delay(5000);
    }
  } else if (eventType === eventTypes.INPUT) {
    const selector = await getDom();
    if (selector) {
      await input(page, selector, value);
    }
  } else if (eventType === eventTypes.SELECT) {
    const selector = await getDom();
    if (selector) {
      await select(page, selector, value);
    }
  } else if (eventType === eventTypes.NAVIGATION) {
    await page.goto(event.goto);
    await page.waitForSelector('body');
  } else if (eventType === eventTypes.EVALUATE) {
    await delay(1500);
    const res = await page.evaluate(event.evaluateCallback);
    console.log(res);
    if (event.eachEvaluateResEvents) {
      const newEvents = res.map((r: any) => ([ ...event.eachEvaluateResEvents(r) ])).flat();
      console.log(newEvents);
      return { newEvents };
    }
  } else if (eventType === eventTypes.CALLBACK) {
    await event.callback();
  }
  

  if (event.waitForNavigationAfterEvent) {
    await page.waitForNavigation();
  }
}
const loopConfigEvents = async (events: any, page: any) => {
  for (let i = 0; i < events.length; i++) {
    const next = () => {
      return;
    }
    await tryCatch(() => configEventFunction(i, events, page, next));
  }
}

export const eventTypes = {
  CLICK: 'click',
  INPUT: 'input',
  SELECT: 'select',
  NAVIGATION: 'navigation',
  EVALUATE: 'evaluate',
  CALLBACK: 'callback',
}

const delay = (time: number) => {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}

const start = async () => {
  if (Array.isArray(getConfig)) {
    for (let i = 0; i < getConfig.length; i++) {
      const config = await getConfig[i]();
      await scrape(config);
    }
  } else {
    const config = await getConfig();
    scrape(config);
  }
}

start();

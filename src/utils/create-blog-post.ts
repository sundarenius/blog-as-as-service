import OpenAI from 'openai';
import dotenv from 'dotenv';
import { getRandomFromArray } from './helpers';

dotenv.config();

const openai = new OpenAI();

const pixabayAcceptedCategories = [
  'backgrounds',
  'fashion',
  'nature',
  'science',
  'education',
  'feelings',
  'health',
  'people',
  // 'religion',
  'places',
  'animals',
  'industry',
  'computer',
  'food',
  'sports',
  'transportation',
  'travel',
  'buildings',
  'business',
  'music',
];

const msg = (data: IGenerateBlogPost) => `Generate a ${getBlogPostLength()} words long blog post in ${data.language}.

Be expert in your field. But do not use overly academic words.

Category: "${data.category}"

${data.includeHolidays ? `Take into consideration if there are a special time period (such as holidays) right now into the context if it makes sense.` : ''}

It should be SEO optimised, and you should use some of these keywords that is most relevent to the context (but not all).
${data.keywords.join(', ')}

Embed your texts in <p> tags, and make a new <p> tag for each paragraph. Each paragraph should consist of maximum 200 words or 3-4 sentences.

Also add a few subtitles and logical sections in the text as <h3> tags.

Also if possible, include 1 or 3 "a" html tags like "<a href={...} target='_blank'>" to some reputable sites for reference or recommendation.

Here are some previous "titles":
${data.previousTitles?.join(', ')}

Make something different from them.

Some rules:
 - If the context is dating as a JW. Focus on them dating each other, not someone outside that wants to date them.
 - Focus on high quality interesting texts.

Your response should be an stringified object like:
{
  title: string # title of the post,
  content: string # content of the post, no introduction or summary
  keyword: string # most relevant and generic keyword in ${data.language} for this post. Max two words.
  tag: string # choose the most relevant tag from this list: ${pixabayAcceptedCategories}
}
`

const getBlogPostLength = () => {
  if (process.env.NODE_ENV !== 'production') return 20;
  const lengths = [400, 500, 800, 900, 1200];
  return getRandomFromArray(lengths);
};
interface IGenerateBlogPost {
  category: string,
  keywords: string[],
  previousTitles?: string[],
  includeHolidays: boolean,
  language: string,
}

export const generateBlogPost = async (data: IGenerateBlogPost) => {
  const completion = await openai.chat.completions.create({
    messages: [{
      role: "system",
      content: msg(data),
    }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);

  return completion.choices[0];
}

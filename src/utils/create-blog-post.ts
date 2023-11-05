import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI();

const msg = ({
  subject,
  category,
  keywords,
  previousTitles,
}: IGenerateBlogPost) => `I want you to generate a 500 - 1000 words long blog post. Act like an expert in your field.
Subject: "${subject}"
Category: "${category}"

Include world events or current time period (such as holidays) that we are in into the context if it makes sense.

It should be SEO optimised, and you should use some of these keywords that is most relevent to the context (not all though).
${keywords.join(', ')}

Embed your texts in <p> tags, and make a new <p> tag for each paragraph. Each paragraph should consist of maximum 200 words or 3-4 sentences.

Also if possible, inclde 1 or 3 "a" html tags like "<a href={...} target='_blank'>" to reference a source to another website.

Here are some previous "titles":
${previousTitles?.join(', ')}

Make something different from them.

Make this an array:

First index is the "title" of the post.

Second index is the content of the post, no introduction or summary.

Third index is a "keyword" that is most relevant to your post that I will use to fetch from a picture gallery (Pixabay API) to include in the post.
`

interface IGenerateBlogPost {
  subject: string,
  category: string,
  keywords: string[],
  previousTitles?: string[],
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

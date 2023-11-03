import { Collections } from '../mongodb/mongo-config';
import { HttpStatusCodes } from '../types/globals';

export interface ArticleEntity {
  id: string,
  title: string,
  content: string,
  created: number,
}

class Article implements ArticleEntity {
  public static collection = Collections.ARTICLES;

  id: string;

  title: string;

  content: string;

  created: number;

  constructor(payload: ArticleEntity) {
    this.id = payload.id;
    this.title = payload.title;
    this.content = payload.content;
    this.created = payload.created;
  }

  getData(allRequired = false): Partial<ArticleEntity> {
    const data: any = {
      id: this.id,
      title: this.title,
      content: this.content,
      created: this.created,
    };

    // Remove properties with undefined values
    Object.keys(data).forEach((key) => {
      if (allRequired && data[key] === undefined) {
        throw new Error(`This method requires all fields ${HttpStatusCodes.BAD_REQUEST}`);
      }
      return data[key] === undefined && delete data[key];
    });

    return data as Partial<ArticleEntity>;
  }
}

export default Article;

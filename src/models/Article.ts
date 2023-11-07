import { Collections } from '../mongodb/mongo-config';
import { getModelData } from '../utils/helpers';

export interface ArticleEntity {
  customerId: string,
  articleId: string,
  title: string,
  category: string,
  content: string,
  pictureUrl: string,
  created: number,
}

class Article implements ArticleEntity {
  public static collection = Collections.ARTICLES;

  customerId: string;

  articleId: string;

  title: string;

  category: string;

  content: string;

  pictureUrl: string;

  created: number;

  constructor(payload: ArticleEntity) {
    this.customerId = payload.customerId;
    this.articleId = payload.articleId;
    this.title = payload.title;
    this.category = payload.category;
    this.content = payload.content;
    this.pictureUrl = payload.pictureUrl;
    this.created = payload.created;
  }

  getData(allRequired = false): Partial<ArticleEntity> {
    const data: any = {
      customerId: this.customerId,
      articleId: this.articleId,
      title: this.title,
      category: this.category,
      content: this.content,
      pictureUrl: this.pictureUrl,
      created: this.created,
    };

    return getModelData<ArticleEntity>(allRequired, data);
  }
}

export default Article;

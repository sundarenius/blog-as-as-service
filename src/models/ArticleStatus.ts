import { Collections } from '../mongodb/mongo-config';
import { getModelData } from '../utils/helpers';
import type { ArticleStatus as ArticleStatusEnums } from '../types/globals';

export interface ArticleStatusEntity {
  customerId: string,
  articleId: string,
  status: ArticleStatusEnums,
  message?: string
}

class ArticleStatus implements ArticleStatusEntity {
  public static collection = Collections.ARTICLE_STATUS;

  customerId: string;

  articleId: string;

  status: ArticleStatusEnums;

  message?: string;

  constructor(payload: ArticleStatusEntity) {
    this.customerId = payload.customerId;
    this.articleId = payload.articleId;
    this.status = payload.status;
    this.message = payload.message;
  }

  getData(allRequired = false): Partial<ArticleStatusEntity> {
    const data: any = {
      customerId: this.customerId,
      articleId: this.articleId,
      status: this.status,
      message: this.message,
    };

    return getModelData<ArticleStatusEntity>(allRequired, data);
  }
}

export default ArticleStatus;

import type { IFilter } from '../types/globals';
import type ArticleStatus from '../models/ArticleStatus';

export interface ArticleStatusRepository {
  getOne(): Promise<ArticleStatus | null>;
}

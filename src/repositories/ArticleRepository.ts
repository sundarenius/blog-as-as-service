import type { IFilter } from '../types/globals';
import type Article from '../models/Article';

export interface ArticleRepository {
  getOne(): Promise<Article | null>;
  getMany(filter: IFilter): Promise<Partial<Article[]> | null>;
  create(): Promise<void>;
}

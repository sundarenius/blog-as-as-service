import { Collections } from '../mongodb/mongo-config';
import { getModelData } from '../utils/helpers';

export interface ConfigEntity {
  customerId: string,
  categories: string[],
  keywords: string[],
  includeHolidays: boolean
  language: string,
}

class Config implements ConfigEntity {
  public static collection = Collections.CONFIG;

  customerId: string;

  categories: string[];

  keywords: string[];

  includeHolidays: boolean;

  language: string;

  constructor(payload: ConfigEntity) {
    this.customerId = payload.customerId;
    this.categories = payload.categories;
    this.keywords = payload.keywords;
    this.includeHolidays = payload.includeHolidays;
    this.language = payload.language;
  }

  getData(allRequired = false): Partial<ConfigEntity> {
    const data: any = {
      customerId: this.customerId,
      categories: this.categories,
      keywords: this.keywords,
      includeHolidays: this.includeHolidays,
      language: this.language,
    };

    return getModelData<ConfigEntity>(allRequired, data);
  }
}

export default Config;

import { Collections } from '../mongodb/mongo-config';
import { getModelData } from '../utils/helpers';

export interface ConfigEntity {
  customerId: string,
  categories: string[],
  keywords: string[],
}

class Config implements ConfigEntity {
  public static collection = Collections.CONFIG;

  customerId: string;

  categories: string[];

  keywords: string[];

  constructor(payload: ConfigEntity) {
    this.customerId = payload.customerId;
    this.categories = payload.categories;
    this.keywords = payload.keywords;
  }

  getData(allRequired = false): Partial<ConfigEntity> {
    const data: any = {
      customerId: this.customerId,
      categories: this.categories,
      keywords: this.keywords,
    };

    return getModelData<ConfigEntity>(allRequired, data);
  }
}

export default Config;

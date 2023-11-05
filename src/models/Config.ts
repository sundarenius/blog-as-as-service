import { Collections } from '../mongodb/mongo-config';
import { HttpStatusCodes } from '../types/globals';

export interface ConfigEntity {
  customerId: string,
  subjects: string[],
  categories: string[],
  keywords: string[],
}

class Config implements ConfigEntity {
  public static collection = Collections.CONFIG;

  customerId: string;

  subjects: string[];

  categories: string[];

  keywords: string[];

  constructor(payload: ConfigEntity) {
    this.customerId = payload.customerId;
    this.subjects = payload.subjects;
    this.categories = payload.categories;
    this.keywords = payload.keywords;
  }

  getData(allRequired = false): Partial<ConfigEntity> {
    const data: any = {
      customerId: this.customerId,
      subjects: this.subjects,
      categories: this.categories,
      keywords: this.keywords,
    };

    // Remove properties with undefined values
    Object.keys(data).forEach((key) => {
      if (allRequired && data[key] === undefined) {
        throw new Error(`This method requires all fields ${HttpStatusCodes.BAD_REQUEST}`);
      }
      return data[key] === undefined && delete data[key];
    });

    return data as Partial<ConfigEntity>;
  }
}

export default Config;

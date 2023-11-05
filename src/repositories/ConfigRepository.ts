import type Config from '../models/Config';

export interface ConfigRepository {
  getOne(): Promise<Config | null>;
  create(): Promise<void>;
}

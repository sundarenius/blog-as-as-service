import type Account from '../models/Account';

export interface AccountRepository {
  getOne(): Promise<Account | null>;
  create(): Promise<void>;
}

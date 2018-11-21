import { Config } from './config.interface';

export interface AuthTarget {
  host: string;
  nameSpace: string;
  page: string;
}

export interface AuthConfig extends Config {
  target: AuthTarget;
}

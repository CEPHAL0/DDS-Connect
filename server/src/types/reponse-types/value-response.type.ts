import { Value } from 'src/entities/values.entity';
import { ApiReponse } from './base-response.type';

export type ValueResponse = ApiReponse<Value>;

export type ValuesResponse = ApiReponse<Value[]>;

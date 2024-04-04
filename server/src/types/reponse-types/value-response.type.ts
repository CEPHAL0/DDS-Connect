import { Value } from 'src/entities/values.entity';
import { ApiResponse } from './base-response.type';

export type ValueResponse = ApiResponse<Value>;

export type ValuesResponse = ApiResponse<Value[]>;

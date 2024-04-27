import { Form } from 'src/entities/form.entity';
import { ApiResponse } from './base-response.type';
import { CreateFormDto } from 'src/dtos/create-form.dto';

export type FormResponse = ApiResponse<Form>;
export type FormsReponse = ApiResponse<Form[]>;

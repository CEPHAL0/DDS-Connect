import { Form } from 'src/entities/form.entity';
import { ApiReponse } from './base-response.type';
import { CreateFormDto } from 'src/dtos/create-form.dto';

export type FormReponse = ApiReponse<Form>;
export type FormsReponse = ApiReponse<Form[]>;

import { ApiReponse } from 'src/responses/baseresponse';
import { CreateUserDto } from 'src/users/dtos/CreateUser.doto';

export type UserReponse = ApiReponse<CreateUserDto>;

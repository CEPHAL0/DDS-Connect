import { ApiReponse } from 'src/responses/baseresponse';
import { CreateUserDto } from 'src/users/dtos/CreateUser.doto';

export type UserResponseData = Omit<CreateUserDto, 'password'>;

export type UserReponse = ApiReponse<UserResponseData>;
export type UsersResponse = ApiReponse<UserResponseData[]>;

import { ApiReponse } from 'src/types/reponse-types/base-response.type';
import { CreateUserDto } from 'src/dtos/create-user.dto';

export type UserResponseData = Omit<CreateUserDto, 'password'>;

export type UserReponse = ApiReponse<UserResponseData>;
export type UsersResponse = ApiReponse<UserResponseData[]>;

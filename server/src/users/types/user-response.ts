import { ApiReponse } from 'src/responses/base-response.type';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

export type UserResponseData = Omit<CreateUserDto, 'password'>;

export type UserReponse = ApiReponse<UserResponseData>;
export type UsersResponse = ApiReponse<UserResponseData[]>;

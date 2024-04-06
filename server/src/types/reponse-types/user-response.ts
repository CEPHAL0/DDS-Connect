import { ApiResponse } from 'src/types/reponse-types/base-response.type';
import { CreateUserDto } from 'src/dtos/create-user.dto';

export type UserResponseData = Omit<CreateUserDto, 'password'>;

export type UserReponse = ApiResponse<UserResponseData>;
export type UsersResponse = ApiResponse<UserResponseData[]>;

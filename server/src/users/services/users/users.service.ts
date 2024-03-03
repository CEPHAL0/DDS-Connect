import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dtos/CreateUser.doto';
import { User } from 'src/users/entitites/user.entity';
import { DataSource, Repository } from 'typeorm';
import {
  UserResponseData,
  UserReponse,
  UsersResponse,
} from 'src/users/types/user-response';

@Injectable()
export class UsersService {
  public constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<UsersResponse> {
    const users = await this.userRepository.find();

    // Removing password from all user data
    const usersResponse: Array<UserResponseData> = users.map((user) => {
      const userData = { ...user };
      delete userData.password;
      return userData;
    });

    // Returning the response as array of objects in data field of users response
    const response: UsersResponse = {
      data: usersResponse,
      message: 'Users fetched successfully',
      statusCode: 200,
    };
    return response;
  }

  async findOne(id: number): Promise<UserReponse> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    delete user.password;
    const userResponse: UserReponse = {
      data: user,
      message: 'User Retrieved successfully',
      statusCode: 200,
    };
    return userResponse;
  }

  async remove(id: number): Promise<UserReponse> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new HttpException('User Doesnot Exist', 404);
    }

    await this.userRepository.delete({ id });
    const userResponse: UserReponse = {
      data: null,
      message: 'Successfully deleted data',
      statusCode: 200,
    };
    return userResponse;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserReponse> {
    const user: User = new User();

    // Check if the user with email exists
    const userExists: boolean = await this.userRepository
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.email = :email', { email: createUserDto.email })
      .getExists();

    if (userExists) {
      throw new HttpException('User with Email already exists', 409);
    }

    user.username = createUserDto.username;
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.role = createUserDto.role;

    let userResponse: UserReponse = { data: null, message: '', statusCode: 0 };

    await this.userRepository.save(user).then(() => {
      const userData = { ...user };

      delete userData.password;

      userResponse = {
        data: userData,
        message: 'User Created Successfully',
        statusCode: 200,
      };
    });
    return userResponse;
  }
}

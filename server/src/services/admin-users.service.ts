import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import {
  UserResponseData,
  UserReponse,
  UsersResponse,
} from 'src/types/reponse-types/user-response';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  public constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<UsersResponse> {
    const users = await this.userRepository.find();

    const usersResponse: Array<UserResponseData> = users.map((user) => {
      const userData = { ...user };
      delete userData.password;
      return userData;
    });

    const response: UsersResponse = {
      data: usersResponse,
      message: 'Users fetched successfully',
      statusCode: 200,
    };
    return response;
  }

  //#region Find One
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

  //#region Find One By Username
  async findOneByUsername(username: any): Promise<User> {
    const user: User = await this.userRepository
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.username = :username', { username: username })
      .getOne();

    if (user == null) {
      throw new HttpException('User not found', 404);
    }
    return user;
  }

  //#region Delete One
  async remove(id: number): Promise<UserReponse> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new HttpException('User Doesnot Exist', 404);
    }

    if (user.username == 'admin') {
      console.log('Cannot Delete Admin Profile');
      throw new HttpException('Forbidden Resource', 401);
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
    const userWithEmailExists: boolean = await this.userRepository
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.email = :email', { email: createUserDto.email })
      .getExists();

    if (userWithEmailExists) {
      throw new HttpException('User with Email already exists', 409);
    }

    const userWithUsernameExists: boolean = await this.userRepository
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.username = :username', { username: createUserDto.username })
      .getExists();

    if (userWithUsernameExists) {
      throw new HttpException('User with Username already exists', 409);
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    await this.userRepository.save(createUserDto).catch(() => {
      throw new HttpException('Failed to Create User', 400);
    });

    const userData = { ...createUserDto };

    delete userData.password;

    const userResponse: UserReponse = {
      data: userData,
      message: 'User Created Successfully',
      statusCode: 200,
    };
    return userResponse;
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserReponse> {
    const userExists = await this.userRepository
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.id = :id', { id: id })
      .getExists();

    if (!userExists) {
      throw new HttpException('User not found', 404);
    }

    const userWithEmailExists = await this.userRepository
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.email = :email ', { email: updateUserDto.email })
      .andWhere('user.id != :id', { id: id })
      .getExists();

    if (userWithEmailExists) {
      throw new HttpException('User with email already exists', 409);
    }

    const userWithUsernameExists = await this.userRepository
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.username = :username ', { username: updateUserDto.username })
      .andWhere('user.id != :id', { id: id })
      .getExists();

    if (userWithUsernameExists) {
      throw new HttpException('User with username already exists', 409);
    }

    await this.userRepository.update(id, updateUserDto).catch((error) => {
      throw new HttpException('Failed to update user', 400);
    });

    const userResponse: UserReponse = {
      data: null,
      message: 'User Updated Successfully',
      statusCode: 200,
    };
    return userResponse;
  }
}

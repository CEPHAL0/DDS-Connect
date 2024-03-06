import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @IsNotEmpty({ message: 'Username cannot be empty' })
  username: string;

  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Enter a valid email' })
  email: string;

  @IsNotEmpty({
    message: 'Role Must be one of the following: admin, member, user',
  })
  @IsEnum(['admin', 'member', 'user'], {
    message: 'Role Must be one of the following: admin, member, user',
  })
  role: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(8, { message: 'Password must be atleast 8 characters long' })
  password: string;
}

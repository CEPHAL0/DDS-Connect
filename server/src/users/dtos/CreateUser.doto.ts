import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Enter a valid email' })
  email: string;

  @IsNotEmpty()
  @IsEnum(['admin', 'member', 'user'])
  role: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be atleast 8 characters long' })
  password: string;
}

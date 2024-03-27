import { IsNotEmpty, MinLength } from 'class-validator';
import { User } from 'src/entities/user.entity';

export class CreateFormDto {
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  description?: string;
}

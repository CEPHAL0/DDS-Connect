import { IsNotEmpty } from 'class-validator';

export class CreateValueDto {
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;
}

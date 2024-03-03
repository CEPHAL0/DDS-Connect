import { IsEmail, IsNotEmpty } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['admin', 'manager', 'user'] })
  role: string;

  @Column({ unique: true })
  email: string;
}

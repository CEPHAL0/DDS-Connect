import { IsEmail, IsNotEmpty } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Form } from './form.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['admin', 'manager', 'user'] })
  role: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Form, (form) => form.created_by)
  forms: Form[];
}

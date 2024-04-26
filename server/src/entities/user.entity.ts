import { IsEmail, IsNotEmpty } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Form } from './form.entity';
import { Response } from './response.entity';

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

  @Column({ type: 'enum', enum: ['admin', 'member', 'user'] })
  role: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Form, (form) => form.created_by, { cascade: true })
  forms: Form[];

  @OneToMany(() => Response, (response) => response.filled_by, {
    cascade: true,
  })
  responses: Response[];
}

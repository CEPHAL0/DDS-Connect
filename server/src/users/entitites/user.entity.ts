import { IsEmail, IsNotEmpty } from 'class-validator';
import { Form } from 'src/forms/entities/form.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

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

  @OneToMany(() => Form, (form) => form.user)
  forms: Form[];
}

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum roles {
  admin = 'admin',
  member = 'member',
  user = 'user',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  role: roles;
}

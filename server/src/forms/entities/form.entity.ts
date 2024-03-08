import { User } from 'src/users/entitites/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Form {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.forms)
  user: User;

  @Column({type: 'enum', enum:['open', 'closed']})
  status: string;

  @Column({type: 'date'})
  createdOn: string;
}

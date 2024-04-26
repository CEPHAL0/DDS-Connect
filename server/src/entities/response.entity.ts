import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Form } from './form.entity';
import { Value } from './values.entity';
import { User } from './user.entity';
import { Answer } from './answer.entity';

@Entity()
export class Response {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.responses, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  filled_by: User;

  @ManyToOne(() => Form, (form) => form.responses, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  form: Form;

  @OneToMany(() => Answer, (answer) => answer.response)
  answers: Answer[];
}

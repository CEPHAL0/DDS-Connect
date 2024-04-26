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
import { Question } from './question.entity';
import { response } from 'express';
import { Response } from './response.entity';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  question_value: string;

  @Column({ length: 400 })
  answer: string;

  @ManyToOne(() => Question, (question) => question.answers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  question: Question;

  @ManyToOne(() => Response, (response) => response.answers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  response: Response;
}

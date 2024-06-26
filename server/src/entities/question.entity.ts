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
import { Answer } from './answer.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', width: 200 })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'enum', enum: ['Single', 'Multiple', 'Date', 'YesNo'] })
  type: 'Single' | 'Multiple' | 'Date' | 'YesNo';

  @ManyToOne(() => Form, (form) => form.questions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  form: Form;

  @OneToMany(() => Value, (value) => value.question)
  values: Value[];

  @OneToMany(() => Answer, (answer) => answer.question, { cascade: true })
  answers: Answer[];
}

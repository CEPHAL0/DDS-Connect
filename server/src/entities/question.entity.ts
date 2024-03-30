import { Form } from './form.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', width: 250 })
  question: string;

  @Column({ enum: ['Check', 'Radio', 'Range', 'Date', 'Short', 'Long'] })
  type: string;

  @ManyToOne(() => Form, (form) => form.questions, {
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  form: Form;
}

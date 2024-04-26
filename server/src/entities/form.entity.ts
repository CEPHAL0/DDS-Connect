import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { FormStatus } from 'src/types/form-status.enum';
import { Question } from './question.entity';
import { Response } from './response.entity';

@Entity()
export class Form {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', width: 500, nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'enum', enum: ['Open', 'Closed'] })
  status: string;

  @ManyToOne(() => User, (user) => user.forms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  created_by: User;

  @OneToMany(() => Question, (question) => question.form, { cascade: true })
  questions: Question[];

  @OneToMany(() => Response, (response) => response.form, { cascade: true })
  responses: Response[];
}

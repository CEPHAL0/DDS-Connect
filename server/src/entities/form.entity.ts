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

  @Column({ enum: ['Open', 'Closed'] })
  status: string;

  @ManyToOne(() => User, (user) => user.forms)
  created_by: User;
}

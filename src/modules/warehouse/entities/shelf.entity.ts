import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Section } from './section.entity';

@Entity('shelves')
export class Shelf {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 2 })
  code: string;

  @OneToMany(() => Section, (section) => section.shelf)
  sections: Section[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

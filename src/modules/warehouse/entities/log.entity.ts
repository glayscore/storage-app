import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { LogAction } from '../enums/log-action.enum';

@Entity('warehouse_logs')
export class WarehouseLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: LogAction,
  })
  action: LogAction;

  @Column()
  success: boolean;

  @Column({ type: 'json' })
  details: any;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}

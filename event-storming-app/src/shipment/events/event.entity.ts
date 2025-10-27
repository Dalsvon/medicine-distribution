import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('events')
export class EventEntity {
  @PrimaryColumn()
  eventId: string;

  @Column()
  aggregateId: string;

  @Column()
  eventType: string;

  @Column({ type: 'jsonb' })
  eventData: any;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ type: 'int', default: 1 })
  version: number;
}
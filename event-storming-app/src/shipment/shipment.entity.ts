import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ShipmentStatus } from './shipment.aggregate';

@Entity('shipments')
export class ShipmentEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  orderId: string;

  @Column()
  destination: string;

  @Column({
    type: 'enum',
    enum: ShipmentStatus,
    default: ShipmentStatus.CREATED,
  })
  status: ShipmentStatus;

  @Column({ type: 'jsonb', default: [] })
  medicines: Array<{
    medicineId: string;
    medicineName: string;
    quantity: number;
  }>;

  @Column({ nullable: true })
  carrier?: string;

  @Column({ nullable: true })
  trackingNumber?: string;

  @Column({ type: 'jsonb', default: [] })
  trackingHistory: Array<{
    location: string;
    status: string;
    timestamp: Date;
  }>;

  @Column({ nullable: true })
  recipientName?: string;

  @Column({ nullable: true })
  failureReason?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

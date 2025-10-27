import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment } from './shipment.aggregate';
import { ShipmentEntity } from './shipment.entity';

@Injectable()
export class ShipmentRepository {
  constructor(
    @InjectRepository(ShipmentEntity)
    private readonly repository: Repository<ShipmentEntity>,
  ) {}

  async save(shipment: Shipment): Promise<void> {
    const entity = this.toEntity(shipment);
    await this.repository.save(entity);
  }

  async findById(id: string): Promise<Shipment | undefined> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : undefined;
  }

  async findAll(): Promise<Shipment[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => this.toDomain(entity));
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  generateId(): string {
    return `SHIP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  private toEntity(shipment: Shipment): ShipmentEntity {
    const entity = new ShipmentEntity();
    entity.id = shipment.id;
    entity.orderId = shipment.orderId;
    entity.destination = shipment.destination;
    entity.status = shipment.status;
    entity.medicines = shipment.medicines;
    entity.carrier = shipment.carrier;
    entity.trackingNumber = shipment.trackingNumber;
    entity.trackingHistory = shipment.trackingHistory;
    entity.recipientName = shipment.recipientName;
    entity.failureReason = shipment.failureReason;
    entity.createdAt = shipment.createdAt;
    entity.updatedAt = shipment.updatedAt;
    return entity;
  }

  private toDomain(entity: ShipmentEntity): Shipment {
    const shipment = new Shipment(entity.id, entity.orderId, entity.destination);
    shipment.status = entity.status;
    shipment.medicines = entity.medicines;
    shipment.carrier = entity.carrier;
    shipment.trackingNumber = entity.trackingNumber;
    shipment.trackingHistory = entity.trackingHistory;
    shipment.recipientName = entity.recipientName;
    shipment.failureReason = entity.failureReason;
    shipment.createdAt = entity.createdAt;
    shipment.updatedAt = entity.updatedAt;
    return shipment;
  }
}
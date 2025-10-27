import { Injectable } from '@nestjs/common';
import { Shipment } from './shipment.aggregate';

@Injectable()
export class ShipmentRepository {
  private shipments: Map<string, Shipment> = new Map();

  save(shipment: Shipment): void {
    this.shipments.set(shipment.id, shipment);
  }

  findById(id: string): Shipment | undefined {
    return this.shipments.get(id);
  }

  findAll(): Shipment[] {
    return Array.from(this.shipments.values());
  }

  delete(id: string): boolean {
    return this.shipments.delete(id);
  }

  generateId(): string {
    return `SHIP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
}
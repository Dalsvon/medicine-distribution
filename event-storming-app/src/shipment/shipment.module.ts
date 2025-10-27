import { Module } from '@nestjs/common';
import { ShipmentController } from './shipment.controller';
import { ShipmentService } from './shipment.service';
import { ShipmentRepository } from './shipment.repository';
import { EventStore } from './events/event-store';

@Module({
  controllers: [ShipmentController],
  providers: [ShipmentService, ShipmentRepository, EventStore],
  exports: [ShipmentService],
})
export class ShipmentModule {}
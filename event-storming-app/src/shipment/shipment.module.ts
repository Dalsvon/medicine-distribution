import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentController } from './shipment.controller';
import { ShipmentService } from './shipment.service';
import { ShipmentRepository } from './shipment.repository';
import { EventStore } from './events/event-store';
import { ShipmentEntity } from './shipment.entity';
import { EventEntity } from './events/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShipmentEntity, EventEntity])],
  controllers: [ShipmentController],
  providers: [ShipmentService, ShipmentRepository, EventStore],
  exports: [ShipmentService],
})
export class ShipmentModule {}
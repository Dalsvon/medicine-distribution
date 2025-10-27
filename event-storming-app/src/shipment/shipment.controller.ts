import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import * as Commands from './commands/shipment.commands';
import * as Dto from './dto/shipment.dtos';

@Controller('shipments')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createShipment(@Body() dto: Dto.CreateShipmentDto) {
    const command = new Commands.CreateShipment(dto.orderId, dto.destination);
    const shipmentId = this.shipmentService.createShipment(command);
    return { shipmentId };
  }

  @Post(':id/medicines')
  @HttpCode(HttpStatus.OK)
  packMedicine(
    @Param('id') shipmentId: string,
    @Body() dto: Dto.PackMedicineDto,
  ) {
    const command = new Commands.PackMedicineForShipment(
      shipmentId,
      dto.medicineId,
      dto.medicineName,
      dto.quantity,
    );
    this.shipmentService.packMedicine(command);
    return { message: 'Medicine packed successfully' };
  }

  @Post(':id/dispatch')
  @HttpCode(HttpStatus.OK)
  dispatchShipment(
    @Param('id') shipmentId: string,
    @Body() dto: Dto.DispatchShipmentDto,
  ) {
    const command = new Commands.DispatchShipment(
      shipmentId,
      dto.carrier,
      dto.trackingNumber,
    );
    this.shipmentService.dispatchShipment(command);
    return { message: 'Shipment dispatched successfully' };
  }

  @Put(':id/tracking')
  @HttpCode(HttpStatus.OK)
  updateTracking(
    @Param('id') shipmentId: string,
    @Body() dto: Dto.UpdateTrackingDto,
  ) {
    const command = new Commands.UpdateShipmentTracking(
      shipmentId,
      dto.location,
      dto.status,
    );
    this.shipmentService.updateTracking(command);
    return { message: 'Tracking updated successfully' };
  }

  @Post(':id/delivery/confirm')
  @HttpCode(HttpStatus.OK)
  confirmDelivery(
    @Param('id') shipmentId: string,
    @Body() dto: Dto.ConfirmDeliveryDto,
  ) {
    const command = new Commands.ConfirmDelivery(
      shipmentId,
      dto.recipientName,
    );
    this.shipmentService.confirmDelivery(command);
    return { message: 'Delivery confirmed successfully' };
  }

  @Post(':id/delivery/fail')
  @HttpCode(HttpStatus.OK)
  reportDeliveryFailure(
    @Param('id') shipmentId: string,
    @Body() dto: Dto.ReportFailureDto,
  ) {
    const command = new Commands.ReportDeliveryFailure(
      shipmentId,
      dto.reason,
    );
    this.shipmentService.reportDeliveryFailure(command);
    return { message: 'Delivery failure reported' };
  }

  @Get(':id')
  getShipment(@Param('id') id: string) {
    return this.shipmentService.getShipment(id);
  }

  @Get()
  getAllShipments() {
    return this.shipmentService.getAllShipments();
  }

  @Get(':id/events')
  getShipmentEvents(@Param('id') id: string) {
    return this.shipmentService.getShipmentEvents(id);
  }

  @Get('events/all')
  getAllEvents() {
    return this.shipmentService.getAllEvents();
  }
}
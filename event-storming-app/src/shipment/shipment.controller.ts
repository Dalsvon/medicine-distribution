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
import { NotFoundException } from '@nestjs/common';

@Controller('shipments')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createShipment(@Body() dto: Dto.CreateShipmentDto) {
    try {
      const command = new Commands.CreateShipment(dto.orderId, dto.destination);
      const shipmentId = this.shipmentService.createShipment(command);
      return { shipmentId };
    } catch (error) {
      return { statusCode: HttpStatus.BAD_REQUEST, message: error.message };
    }
  }

  @Post(':id/medicines')
  @HttpCode(HttpStatus.OK)
  packMedicine(
    @Param('id') shipmentId: string,
    @Body() dto: Dto.PackMedicineDto,
  ) {
    try {
      const command = new Commands.PackMedicineForShipment(
        shipmentId,
        dto.medicineId,
        dto.medicineName,
        dto.quantity,
      );
      this.shipmentService.packMedicine(command);
      return { message: 'Medicine packed successfully' };
    } catch (error) {
      return {
        statusCode: error instanceof NotFoundException ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  @Post(':id/dispatch')
  @HttpCode(HttpStatus.OK)
  dispatchShipment(
    @Param('id') shipmentId: string,
    @Body() dto: Dto.DispatchShipmentDto,
  ) {
    try {
      const command = new Commands.DispatchShipment(
        shipmentId,
        dto.carrier,
        dto.trackingNumber,
      );
      this.shipmentService.dispatchShipment(command);
      return { message: 'Shipment dispatched successfully' };
    } catch (error) {
      return {
        statusCode: error instanceof NotFoundException ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  @Put(':id/tracking')
  @HttpCode(HttpStatus.OK)
  updateTracking(
    @Param('id') shipmentId: string,
    @Body() dto: Dto.UpdateTrackingDto,
  ) {
    try {
      const command = new Commands.UpdateShipmentTracking(
        shipmentId,
        dto.location,
        dto.status,
      );
      this.shipmentService.updateTracking(command);
      return { message: 'Tracking updated successfully' };
    } catch (error) {
      return {
        statusCode: error instanceof NotFoundException ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  @Post(':id/delivery/confirm')
  @HttpCode(HttpStatus.OK)
  confirmDelivery(
    @Param('id') shipmentId: string,
    @Body() dto: Dto.ConfirmDeliveryDto,
  ) {
    try {
      const command = new Commands.ConfirmDelivery(
        shipmentId,
        dto.recipientName,
      );
      this.shipmentService.confirmDelivery(command);
      return { message: 'Delivery confirmed successfully' };
    } catch (error) {
      return {
        statusCode: error instanceof NotFoundException ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  @Post(':id/delivery/fail')
  @HttpCode(HttpStatus.OK)
  reportDeliveryFailure(
    @Param('id') shipmentId: string,
    @Body() dto: Dto.ReportFailureDto,
  ) {
    try {
      const command = new Commands.ReportDeliveryFailure(
        shipmentId,
        dto.reason,
      );
      this.shipmentService.reportDeliveryFailure(command);
      return { message: 'Delivery failure reported' };
    } catch (error) {
      return {
        statusCode: error instanceof NotFoundException ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  @Get(':id')
  getShipment(@Param('id') id: string) {
    try {
      return this.shipmentService.getShipment(id);
    } catch (error) {
      return {
        statusCode: error instanceof NotFoundException ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  @Get()
  getAllShipments() {
    try {
      return this.shipmentService.getAllShipments();
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  @Get(':id/events')
  getShipmentEvents(@Param('id') id: string) {
    try {
      return this.shipmentService.getShipmentEvents(id);
    } catch (error) {
      return {
        statusCode: error instanceof NotFoundException ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  @Get('events/all')
  getAllEvents() {
    try {
      return this.shipmentService.getAllEvents();
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { ShipmentRepository } from './shipment.repository';
import { EventStore } from './events/event-store';
import { Shipment } from './shipment.aggregate';
import * as Commands from './commands/shipment.commands';
import * as Events from './events/shipment.events';

@Injectable()
export class ShipmentService {
  constructor(
    private readonly repository: ShipmentRepository,
    private readonly eventStore: EventStore,
  ) {}

  createShipment(command: Commands.CreateShipment): string {
    const shipmentId = this.repository.generateId();
    const shipment = new Shipment(
      shipmentId,
      command.orderId,
      command.destination,
    );

    this.repository.save(shipment);

    const event = new Events.ShipmentCreated(
      shipmentId,
      command.orderId,
      command.destination,
      new Date(),
    );
    this.eventStore.append(shipmentId, 'ShipmentCreated', event);

    return shipmentId;
  }

  packMedicine(command: Commands.PackMedicineForShipment): void {
    const shipment = this.repository.findById(command.shipmentId);
    if (!shipment) {
      throw new NotFoundException(
        `Shipment ${command.shipmentId} not found`,
      );
    }

    shipment.addMedicine(
      command.medicineId,
      command.medicineName,
      command.quantity,
    );
    this.repository.save(shipment);

    const event = new Events.MedicinePackedForShipment(
      command.shipmentId,
      command.medicineId,
      command.medicineName,
      command.quantity,
      new Date(),
    );
    this.eventStore.append(command.shipmentId, 'MedicinePackedForShipment', event);
  }

  dispatchShipment(command: Commands.DispatchShipment): void {
    const shipment = this.repository.findById(command.shipmentId);
    if (!shipment) {
      throw new NotFoundException(
        `Shipment ${command.shipmentId} not found`,
      );
    }

    shipment.dispatch(command.carrier, command.trackingNumber);
    this.repository.save(shipment);

    const event = new Events.ShipmentDispatched(
      command.shipmentId,
      command.carrier,
      command.trackingNumber,
      new Date(),
    );
    this.eventStore.append(command.shipmentId, 'ShipmentDispatched', event);
  }

  updateTracking(command: Commands.UpdateShipmentTracking): void {
    const shipment = this.repository.findById(command.shipmentId);
    if (!shipment) {
      throw new NotFoundException(
        `Shipment ${command.shipmentId} not found`,
      );
    }

    shipment.updateTracking(command.location, command.status);
    this.repository.save(shipment);

    const event = new Events.ShipmentTrackingUpdated(
      command.shipmentId,
      command.location,
      command.status,
      new Date(),
    );
    this.eventStore.append(command.shipmentId, 'ShipmentTrackingUpdated', event);
  }

  confirmDelivery(command: Commands.ConfirmDelivery): void {
    const shipment = this.repository.findById(command.shipmentId);
    if (!shipment) {
      throw new NotFoundException(
        `Shipment ${command.shipmentId} not found`,
      );
    }

    shipment.confirmDelivery(command.recipientName);
    this.repository.save(shipment);

    const event = new Events.ShipmentDelivered(
      command.shipmentId,
      command.recipientName,
      new Date(),
    );
    this.eventStore.append(command.shipmentId, 'ShipmentDelivered', event);
  }

  reportDeliveryFailure(command: Commands.ReportDeliveryFailure): void {
    const shipment = this.repository.findById(command.shipmentId);
    if (!shipment) {
      throw new NotFoundException(
        `Shipment ${command.shipmentId} not found`,
      );
    }

    shipment.reportFailure(command.reason);
    this.repository.save(shipment);

    const event = new Events.ShipmentDeliveryFailed(
      command.shipmentId,
      command.reason,
      new Date(),
    );
    this.eventStore.append(command.shipmentId, 'ShipmentDeliveryFailed', event);
  }

  getShipment(id: string): Shipment {
    const shipment = this.repository.findById(id);
    if (!shipment) {
      throw new NotFoundException(`Shipment ${id} not found`);
    }
    return shipment;
  }

  getAllShipments(): Shipment[] {
    return this.repository.findAll();
  }

  getShipmentEvents(id: string) {
    return this.eventStore.getEventsByAggregateId(id);
  }

  getAllEvents() {
    return this.eventStore.getAllEvents();
  }
}

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

  async createShipment(command: Commands.CreateShipment): Promise<string> {
    const shipmentId = this.repository.generateId();
    const shipment = new Shipment(
      shipmentId,
      command.orderId,
      command.destination,
    );

    await this.repository.save(shipment);

    const event = new Events.ShipmentCreated(
      shipmentId,
      command.orderId,
      command.destination,
      new Date(),
    );
    await this.eventStore.append(shipmentId, 'ShipmentCreated', event);

    return shipmentId;
  }

  async packMedicine(command: Commands.PackMedicineForShipment): Promise<void> {
    const shipment = await this.repository.findById(command.shipmentId);
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
    await this.repository.save(shipment);

    const event = new Events.MedicinePackedForShipment(
      command.shipmentId,
      command.medicineId,
      command.medicineName,
      command.quantity,
      new Date(),
    );
    await this.eventStore.append(command.shipmentId, 'MedicinePackedForShipment', event);
  }

  async dispatchShipment(command: Commands.DispatchShipment): Promise<void> {
    const shipment = await this.repository.findById(command.shipmentId);
    if (!shipment) {
      throw new NotFoundException(
        `Shipment ${command.shipmentId} not found`,
      );
    }

    shipment.dispatch(command.carrier, command.trackingNumber);
    await this.repository.save(shipment);

    const event = new Events.ShipmentDispatched(
      command.shipmentId,
      command.carrier,
      command.trackingNumber,
      new Date(),
    );
    await this.eventStore.append(command.shipmentId, 'ShipmentDispatched', event);
  }

  async updateTracking(command: Commands.UpdateShipmentTracking): Promise<void> {
    const shipment = await this.repository.findById(command.shipmentId);
    if (!shipment) {
      throw new NotFoundException(
        `Shipment ${command.shipmentId} not found`,
      );
    }

    shipment.updateTracking(command.location, command.status);
    await this.repository.save(shipment);

    const event = new Events.ShipmentTrackingUpdated(
      command.shipmentId,
      command.location,
      command.status,
      new Date(),
    );
    await this.eventStore.append(command.shipmentId, 'ShipmentTrackingUpdated', event);
  }

  async confirmDelivery(command: Commands.ConfirmDelivery): Promise<void> {
    const shipment = await this.repository.findById(command.shipmentId);
    if (!shipment) {
      throw new NotFoundException(
        `Shipment ${command.shipmentId} not found`,
      );
    }

    shipment.confirmDelivery(command.recipientName);
    await this.repository.save(shipment);

    const event = new Events.ShipmentDelivered(
      command.shipmentId,
      command.recipientName,
      new Date(),
    );
    await this.eventStore.append(command.shipmentId, 'ShipmentDelivered', event);
  }

  async reportDeliveryFailure(command: Commands.ReportDeliveryFailure): Promise<void> {
    const shipment = await this.repository.findById(command.shipmentId);
    if (!shipment) {
      throw new NotFoundException(
        `Shipment ${command.shipmentId} not found`,
      );
    }

    shipment.reportFailure(command.reason);
    await this.repository.save(shipment);

    const event = new Events.ShipmentDeliveryFailed(
      command.shipmentId,
      command.reason,
      new Date(),
    );
    await this.eventStore.append(command.shipmentId, 'ShipmentDeliveryFailed', event);
  }

  async getShipment(id: string): Promise<Shipment> {
    const shipment = await this.repository.findById(id);
    if (!shipment) {
      throw new NotFoundException(`Shipment ${id} not found`);
    }
    return shipment;
  }

  async getAllShipments(): Promise<Shipment[]> {
    return this.repository.findAll();
  }

  async getShipmentEvents(id: string) {
    return this.eventStore.getEventsByAggregateId(id);
  }

  async getAllEvents() {
    return this.eventStore.getAllEvents();
  }
}

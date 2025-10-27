export enum ShipmentStatus {
  CREATED = 'CREATED',
  PACKING = 'PACKING',
  DISPATCHED = 'DISPATCHED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

export interface MedicineItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
}

export interface TrackingUpdate {
  location: string;
  status: string;
  timestamp: Date;
}

export class Shipment {
  id: string;
  orderId: string;
  destination: string;
  status: ShipmentStatus;
  medicines: MedicineItem[];
  carrier?: string;
  trackingNumber?: string;
  trackingHistory: TrackingUpdate[];
  recipientName?: string;
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(id: string, orderId: string, destination: string) {
    this.id = id;
    this.orderId = orderId;
    this.destination = destination;
    this.status = ShipmentStatus.CREATED;
    this.medicines = [];
    this.trackingHistory = [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  addMedicine(medicineId: string, medicineName: string, quantity: number) {
    this.medicines.push({ medicineId, medicineName, quantity });
    this.status = ShipmentStatus.PACKING;
    this.updatedAt = new Date();
  }

  dispatch(carrier: string, trackingNumber: string) {
    if (this.medicines.length === 0) {
      throw new Error('Cannot dispatch shipment without medicines');
    }
    this.carrier = carrier;
    this.trackingNumber = trackingNumber;
    this.status = ShipmentStatus.DISPATCHED;
    this.updatedAt = new Date();
  }

  updateTracking(location: string, status: string) {
    this.trackingHistory.push({
      location,
      status,
      timestamp: new Date(),
    });
    this.status = ShipmentStatus.IN_TRANSIT;
    this.updatedAt = new Date();
  }

  confirmDelivery(recipientName: string) {
    this.recipientName = recipientName;
    this.status = ShipmentStatus.DELIVERED;
    this.updatedAt = new Date();
  }

  reportFailure(reason: string) {
    this.failureReason = reason;
    this.status = ShipmentStatus.FAILED;
    this.updatedAt = new Date();
  }
}
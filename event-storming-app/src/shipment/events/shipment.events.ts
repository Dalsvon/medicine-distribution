export class ShipmentCreated {
  constructor(
    public readonly shipmentId: string,
    public readonly orderId: string,
    public readonly destination: string,
    public readonly timestamp: Date,
  ) {}
}

export class MedicinePackedForShipment {
  constructor(
    public readonly shipmentId: string,
    public readonly medicineId: string,
    public readonly medicineName: string,
    public readonly quantity: number,
    public readonly timestamp: Date,
  ) {}
}

export class ShipmentDispatched {
  constructor(
    public readonly shipmentId: string,
    public readonly carrier: string,
    public readonly trackingNumber: string,
    public readonly timestamp: Date,
  ) {}
}

export class ShipmentTrackingUpdated {
  constructor(
    public readonly shipmentId: string,
    public readonly location: string,
    public readonly status: string,
    public readonly timestamp: Date,
  ) {}
}

export class ShipmentDelivered {
  constructor(
    public readonly shipmentId: string,
    public readonly recipientName: string,
    public readonly timestamp: Date,
  ) {}
}

export class ShipmentDeliveryFailed {
  constructor(
    public readonly shipmentId: string,
    public readonly reason: string,
    public readonly timestamp: Date,
  ) {}
}

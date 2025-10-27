export class CreateShipment {
  constructor(
    public readonly orderId: string,
    public readonly destination: string,
  ) {}
}

export class PackMedicineForShipment {
  constructor(
    public readonly shipmentId: string,
    public readonly medicineId: string,
    public readonly medicineName: string,
    public readonly quantity: number,
  ) {}
}

export class DispatchShipment {
  constructor(
    public readonly shipmentId: string,
    public readonly carrier: string,
    public readonly trackingNumber: string,
  ) {}
}

export class UpdateShipmentTracking {
  constructor(
    public readonly shipmentId: string,
    public readonly location: string,
    public readonly status: string,
  ) {}
}

export class ConfirmDelivery {
  constructor(
    public readonly shipmentId: string,
    public readonly recipientName: string,
  ) {}
}

export class ReportDeliveryFailure {
  constructor(
    public readonly shipmentId: string,
    public readonly reason: string,
  ) {}
}
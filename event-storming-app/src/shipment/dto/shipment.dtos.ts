export class CreateShipmentDto {
  orderId: string;
  destination: string;
}

export class PackMedicineDto {
  medicineId: string;
  medicineName: string;
  quantity: number;
}

export class DispatchShipmentDto {
  carrier: string;
  trackingNumber: string;
}

export class UpdateTrackingDto {
  location: string;
  status: string;
}

export class ConfirmDeliveryDto {
  recipientName: string;
}

export class ReportFailureDto {
  reason: string;
}
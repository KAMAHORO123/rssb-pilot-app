export type FeedbackState = {
  type: "success" | "error";
  message: string;
} | null;

export type TrackingFormState = {
  status: string;
  note: string;
  locationLat: string;
  locationLng: string;
};

export type AuditLogFilters = {
  actionType: string;
  targetType: string;
  actorUserId: string;
  sortOrder: "asc" | "desc";
};

export type AdminTabKey = "overview" | "shipments" | "users" | "audit";

export type ShipmentUpdate = {
  id?: string;
  shipmentId: string;
  status: string;
  locationLat?: number;
  locationLng?: number;
  note?: string | null;
  createdAt?: string;
};

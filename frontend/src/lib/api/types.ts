/** Types derived from BuzzQ FastAPI OpenAPI schemas. Do not invent fields. */

export type PersonnelRole = "OWNER" | "STAFF";

export type QueueStatus = "NEW" | "IN_PROGRESS" | "INACTIVE";

export type QueueEntryStatus =
  | "NEW"
  | "CURRENT"
  | "IN_QUEUE"
  | "CUT_OFF"
  | "DONE";

export type AuthRole = "admin" | "personnel";

export interface Token {
  access_token: string;
  token_type: string;
}

export interface Admin {
  id: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface AdminCreate {
  username: string;
  password: string;
}

export interface Organization {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationCreate {
  name: string;
}

export interface Personnel {
  id: string;
  organization_id: string;
  role: PersonnelRole;
  name: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface PersonnelCreate {
  organization_id: string;
  name: string;
  username: string;
  password: string;
  role?: PersonnelRole;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  queue_entries?: QueueEntry[];
  created_at: string;
  updated_at: string;
}

export interface ClientCreate {
  name: string;
  phone: string;
}

export interface Queue {
  id: string;
  organization_id: string;
  ticket_prefix: string;
  name: string;
  status: QueueStatus;
  created_at: string;
  updated_at: string;
}

export interface QueueCreate {
  ticket_prefix: string;
  organization_id: string;
  name: string;
}

export interface QueueEntry {
  id: string;
  client_id: string;
  queue_id: string;
  ticket_number: string;
  ticket_order: number;
  status: QueueEntryStatus;
  created_at: string;
  updated_at: string;
}

export interface QueueEntryCreate {
  client_id: string;
  queue_id: string;
}

export interface ValidationErrorDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
  input?: unknown;
  ctx?: Record<string, unknown>;
}

export interface HTTPValidationError {
  detail?: ValidationErrorDetail[] | string;
}

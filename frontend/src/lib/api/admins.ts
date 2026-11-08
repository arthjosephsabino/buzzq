import { apiRequest } from "./client";
import type { Admin, AdminCreate } from "./types";

export async function getAdmins(token: string): Promise<Admin[]> {
  return apiRequest<Admin[]>("/admins", { token });
}

export async function createAdmin(
  token: string,
  data: AdminCreate,
): Promise<Admin> {
  return apiRequest<Admin>("/admins", {
    method: "POST",
    token,
    body: data,
  });
}

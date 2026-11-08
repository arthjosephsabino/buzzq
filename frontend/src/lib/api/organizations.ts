import { apiRequest } from "./client";
import type { Organization, OrganizationCreate, Personnel } from "./types";

export async function getOrganizations(token: string): Promise<Organization[]> {
  return apiRequest<Organization[]>("/organizations", { token });
}

export async function getOrganization(
  token: string,
  organizationId: string,
): Promise<Organization> {
  return apiRequest<Organization>(`/organizations/${organizationId}`, {
    token,
  });
}

export async function createOrganization(
  token: string,
  data: OrganizationCreate,
): Promise<Organization> {
  return apiRequest<Organization>("/organizations", {
    method: "POST",
    token,
    body: data,
  });
}

export async function getOrganizationPersonnel(
  token: string,
  organizationId: string,
): Promise<Personnel[]> {
  return apiRequest<Personnel[]>(
    `/organizations/${organizationId}/personnel`,
    { token },
  );
}

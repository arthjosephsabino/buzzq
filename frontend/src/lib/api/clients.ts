import { apiRequest } from "./client";
import type { Client, ClientCreate } from "./types";

export async function getClients(token: string): Promise<Client[]> {
  return apiRequest<Client[]>("/clients", { token });
}

export async function getClient(
  token: string,
  clientId: string,
): Promise<Client> {
  return apiRequest<Client>(`/clients/${clientId}`, { token });
}

export async function createClient(
  token: string,
  data: ClientCreate,
): Promise<Client> {
  return apiRequest<Client>("/clients", {
    method: "POST",
    token,
    body: data,
  });
}

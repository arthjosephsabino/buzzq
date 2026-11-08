import { apiRequest } from "./client";
import type { Personnel, PersonnelCreate } from "./types";

export async function getPersonnel(
  token: string,
  personnelId: string,
): Promise<Personnel> {
  return apiRequest<Personnel>(`/personnel/${personnelId}`, { token });
}

export async function createPersonnel(
  token: string,
  data: PersonnelCreate,
): Promise<Personnel> {
  return apiRequest<Personnel>("/personnel", {
    method: "POST",
    token,
    body: data,
  });
}

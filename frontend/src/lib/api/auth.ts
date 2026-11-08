import { apiRequest } from "./client";
import type { Token } from "./types";

/** POST /auth/admins/token — application/x-www-form-urlencoded */
export async function loginAdmin(
  username: string,
  password: string,
): Promise<Token> {
  return apiRequest<Token>("/auth/admins/token", {
    method: "POST",
    form: { username, password },
  });
}

/** POST /auth/personnel/token — application/x-www-form-urlencoded */
export async function loginPersonnel(
  username: string,
  password: string,
): Promise<Token> {
  return apiRequest<Token>("/auth/personnel/token", {
    method: "POST",
    form: { username, password },
  });
}

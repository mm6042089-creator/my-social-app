import { http, unwrap } from "../../config/api";
import { setToken, clearToken } from "../../utils/token";
import { normalizeUser } from "../users/users.api";

/**
 * @param {import('../../types/auth.types').RegisterRequest} values
 * @returns {Promise<import('../../types/auth.types').AuthResponse>}
 */
export async function register({ name, username, email, password, rePassword, dateOfBirth, gender }) {
  const res = await http.post("/users/signup", {
    name,
    username,
    email,
    password,
    rePassword,
    dateOfBirth,
    gender,
  });
  const data = unwrap(res);
  if (data?.token) setToken(data.token);
  return { token: data?.token, user: normalizeUser(data?.user || data) };
}

/**
 * @param {import('../../types/auth.types').LoginRequest} values
 * @returns {Promise<import('../../types/auth.types').AuthResponse>}
 */
export async function login({ email, password }) {
  const res = await http.post("/users/signin", { email, password });
  const data = unwrap(res);
  if (data?.token) setToken(data.token);
  return { token: data?.token, user: normalizeUser(data?.user || data) };
}

/**
 * @param {import('../../types/auth.types').ChangePasswordRequest} values
 */
export async function changePassword({ currentPassword, newPassword }) {
  const res = await http.patch("/users/change-password", {
    password: currentPassword,
    newPassword,
  });
  const data = unwrap(res);
  if (data?.token) setToken(data.token);
  return data;
}

export function logout() {
  clearToken();
}

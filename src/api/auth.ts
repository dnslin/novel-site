import instance from "./instance";
import type { RegisterForm } from "@/types/user";

interface LoginParams {
  username: string;
  password: string;
}

export const authApi = {
  login(data: LoginParams) {
    return instance.post<never, string>("/auth/login", data);
  },
  logout() {
    return instance.post<never, void>("/auth/logout");
  },
  register(data: Omit<RegisterForm, "confirmPassword">) {
    return instance.post<never, string>("/auth/register", data);
  },
  requestPasswordReset(email: string) {
    return instance.post<never, void>(`/auth/password/reset-request`, null, {
      params: { email },
    });
  },
};

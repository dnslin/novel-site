import instance from "./instance";

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
};

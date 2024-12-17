import instance from "./instance";
import type { User } from "@/types/user";

export const userApi = {
  getCurrentUser() {
    return instance.get<never, User>("/auth/current-user");
  },
};

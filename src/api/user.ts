import instance from "./instance";
import type { User } from "@/types/user";
import type { UpdateProfileData } from "@/types/profile";

export const userApi = {
  getCurrentUser() {
    return instance.get<never, User>("/auth/current-user");
  },
  updateProfile: async (data: UpdateProfileData) => {
    const response = await instance.put<never, User>("/auth/update", data);
    return response;
  },
};

import { defineStore } from "pinia";
import { userApi } from "@/api/user";
import type { User } from "@/types/user";
import { ref, computed } from "vue";
import { authApi } from "@/api/auth";

export const useUserStore = defineStore(
  "user",
  () => {
    const currentUser = ref<User | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const isLoggedIn = computed(() => !!currentUser.value);

    async function fetchCurrentUser() {
      loading.value = true;
      try {
        const user = await userApi.getCurrentUser();
        currentUser.value = user;
        return user;
      } catch (err: any) {
        error.value = err.message;
        return null;
      } finally {
        loading.value = false;
      }
    }

    function clearUser() {
      currentUser.value = null;
      localStorage.removeItem("token");
    }

    async function logout() {
      loading.value = true;
      try {
        await authApi.logout();
        clearUser();
      } catch (err: any) {
        error.value = err.message;
        throw err;
      } finally {
        loading.value = false;
      }
    }

    return {
      currentUser,
      loading,
      error,
      isLoggedIn,
      fetchCurrentUser,
      clearUser,
      logout,
    };
  },
  {
    persist: {
      key: "user-store",
      storage: localStorage,
      serializer: {
        deserialize: JSON.parse,
        serialize: JSON.stringify,
      },
    },
  }
);

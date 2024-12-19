import { defineStore } from "pinia";
import { ref } from "vue";
import { preferencesApi } from "@/api/preferences";
import type { UserPreferences } from "@/api/preferences";

export const usePreferencesStore = defineStore("preferences", () => {
  const hasSetPreferences = ref<boolean | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const showPreferencesModal = ref(false);

  // 检查偏好设置状态
  const checkPreferencesStatus = async () => {
    loading.value = true;
    error.value = null;
    try {
      const result = await preferencesApi.getPreferencesStatus();
      hasSetPreferences.value = result;
      if (!result) {
        showPreferencesModal.value = true;
      }
    } catch (err: any) {
      console.error("获取偏好设置状态失败:", err);
    } finally {
      loading.value = false;
    }
  };

  // 保存用户偏好设置
  const savePreferences = async (preferences: UserPreferences) => {
    loading.value = true;
    error.value = null;
    try {
      await preferencesApi.savePreferences(preferences);
      hasSetPreferences.value = true;
    } catch (err: any) {
      error.value = err.message;
      console.error("保存偏好设置失败:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    hasSetPreferences,
    loading,
    error,
    showPreferencesModal,
    checkPreferencesStatus,
    savePreferences,
  };
});

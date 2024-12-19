import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { tagApi } from "@/api/tags";
import type { TagCloud } from "@/api/tags";

export const useTagStore = defineStore(
  "tags",
  () => {
    const tags = ref<TagCloud[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const tagsLastUpdated = ref(0);

    // 获取标签云数据
    const fetchTags = async () => {
      if (tags.value.length > 0) {
        return; // 如果已有数据，直接返回
      }

      loading.value = true;
      error.value = null;
      try {
        const result = await tagApi.getAllTags();
        tags.value = result;
        tagsLastUpdated.value = Date.now();
      } catch (err: any) {
        error.value = err.message;
        console.error("获取标签云数据失败:", err);
      } finally {
        loading.value = false;
      }
    };

    // 根据权重获取标签的样式类
    const getTagStyle = (weight: number) => {
      const baseClasses =
        "inline-block px-3 py-1 rounded-full m-1 transition-all duration-300";

      switch (true) {
        case weight >= 9:
          return `${baseClasses} text-lg font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white`;
        case weight >= 7:
          return `${baseClasses} text-base font-semibold bg-blue-100 text-blue-600 hover:bg-blue-500 hover:text-white`;
        case weight >= 5:
          return `${baseClasses} text-sm bg-green-100 text-green-600 hover:bg-green-500 hover:text-white`;
        case weight >= 3:
          return `${baseClasses} text-sm bg-yellow-100 text-yellow-600 hover:bg-yellow-500 hover:text-white`;
        default:
          return `${baseClasses} text-xs bg-gray-100 text-gray-600 hover:bg-gray-500 hover:text-white`;
      }
    };

    return {
      tags,
      loading,
      error,
      tagsLastUpdated,
      fetchTags,
      getTagStyle,
    };
  },
  {
    persist: {
      key: "tag-store",
      storage: localStorage,
    },
  }
);

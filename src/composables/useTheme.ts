import { ref, watch } from "vue";

export interface Theme {
  value: "light" | "dark";
}

// 创建一个全局的主题状态
const globalTheme = ref<Theme["value"]>(
  (localStorage.getItem("theme") as Theme["value"]) || "light"
);

export function useTheme() {
  // 切换主题
  const toggleTheme = () => {
    globalTheme.value = globalTheme.value === "light" ? "dark" : "light";
  };

  // 监听主题变化并更新 DOM
  watch(
    globalTheme,
    (newTheme) => {
      // 保存到 localStorage
      localStorage.setItem("theme", newTheme);

      // 更新 DOM 的 class
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    { immediate: true }
  );

  return {
    theme: globalTheme,
    toggleTheme,
  };
}

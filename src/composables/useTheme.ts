import { ref, watch } from "vue";

export interface Theme {
  value: "light" | "dark";
}

export function useTheme() {
  // 从 localStorage 获取主题设置，默认为 light
  const theme = ref<Theme["value"]>(
    (localStorage.getItem("theme") as Theme["value"]) || "light"
  );

  // 切换主题
  const toggleTheme = () => {
    theme.value = theme.value === "light" ? "dark" : "light";
  };

  // 监听主题变化并更新 DOM
  watch(
    theme,
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

  // 初始化时检查系统主题偏好
  const initTheme = () => {
    if (!localStorage.getItem("theme")) {
      // 检查系统主题偏好
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      theme.value = prefersDark ? "dark" : "light";
    }
  };

  // 监听系统主题变化
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      theme.value = e.matches ? "dark" : "light";
    }
  });

  // 初始化主题
  initTheme();

  return {
    theme,
    toggleTheme,
  };
}

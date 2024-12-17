import { ref } from "vue";
import { authApi } from "@/api/auth";
import { useUserStore } from "@/stores/user";
import { useToast } from "vue-toastification";

interface LoginForm {
  username: string;
  password: string;
}

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function useAuth() {
  const isLoading = ref(false);
  const emailError = ref("");
  const usernameError = ref("");
  const toast = useToast();

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@(gmail\.com|qq\.com|163\.com|126\.com|outlook\.com|hotmail\.com|yahoo\.com|foxmail\.com|live\.com|msn\.com|icloud\.com|me\.com|sina\.com|sohu\.com|yeah\.net)$/i;

  const validateUsername = (username: string) => {
    if (!username) {
      usernameError.value = "请输入用户名";
      return false;
    }
    usernameError.value = "";
    return true;
  };

  const validateEmail = (email: string) => {
    if (!email) {
      emailError.value = "请输入邮箱地址";
      return false;
    }
    if (!emailRegex.test(email)) {
      emailError.value =
        "目前仅支持以下邮箱：gmail.com、qq.com、163.com、126.com、outlook.com、hotmail.com、yahoo.com、foxmail.com、live.com、msn.com、icloud.com、me.com、sina.com、sohu.com、yeah.net";
      return false;
    }
    emailError.value = "";
    return true;
  };

  const login = async (form: LoginForm) => {
    if (isLoading.value) return false;
    if (!validateUsername(form.username)) return false;

    isLoading.value = true;
    try {
      const token = await authApi.login(form);
      localStorage.setItem("token", token);
      const userStore = useUserStore();
      await userStore.fetchCurrentUser();
      toast.success("登录成功");
      return true;
    } catch (error: any) {
      toast.error(error.message || "登录失败");
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (form: RegisterForm) => {
    if (isLoading.value) return;
    if (!validateEmail(form.email)) return false;
    if (!validateUsername(form.username)) return false;

    isLoading.value = true;
    try {
      // 调用注册 API
      // await registerApi(form)
      return true;
    } catch (error) {
      // 处理错误
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    emailError,
    usernameError,
    validateEmail,
    validateUsername,
    login,
    register,
  };
}

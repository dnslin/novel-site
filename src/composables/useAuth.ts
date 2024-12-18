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
  nickname?: string;
  introduction?: string;
}

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

export function useAuth() {
  const isLoading = ref(false);
  const emailError = ref("");
  const usernameError = ref("");
  const passwordError = ref("");
  const nicknameError = ref("");
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

  const validatePassword = (password: string, confirmPassword: string) => {
    if (!password) {
      passwordError.value = "请输入密码";
      return false;
    }
    if (!passwordRegex.test(password)) {
      passwordError.value =
        "密码必须包含大小写字母、数字和特殊字符，长度在8-20之间";
      return false;
    }
    if (password !== confirmPassword) {
      passwordError.value = "两次输入的密码不一致";
      return false;
    }
    passwordError.value = "";
    return true;
  };

  const validateNickname = (nickname?: string) => {
    if (nickname && nickname.length > 50) {
      nicknameError.value = "昵称长度不能超过50";
      return false;
    }
    nicknameError.value = "";
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
    if (isLoading.value) return false;

    // 验证表单
    if (!validateEmail(form.email)) return false;
    if (!validateUsername(form.username)) return false;
    if (!validatePassword(form.password, form.confirmPassword)) return false;
    if (!validateNickname(form.nickname)) return false;

    if (form.introduction && form.introduction.length > 250) {
      toast.error("个人简介不能超过250字");
      return false;
    }

    isLoading.value = true;
    try {
      const token = await authApi.register({
        username: form.username,
        password: form.password,
        email: form.email,
        nickname: form.nickname || form.username,
        introduction: form.introduction,
      });

      localStorage.setItem("token", token);
      const userStore = useUserStore();
      await userStore.fetchCurrentUser();
      toast.success("注册成功");
      return true;
    } catch (error: any) {
      toast.error(error.message || "注册失败");
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    emailError,
    usernameError,
    passwordError,
    nicknameError,
    validateEmail,
    validateUsername,
    validatePassword,
    validateNickname,
    login,
    register,
  };
}

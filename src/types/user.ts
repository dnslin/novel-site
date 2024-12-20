export interface User {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
  email: string;
  introduction: string;
  createTime: string;
  roles: string[];
  preference?: string;
}

export interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  nickname?: string;
  introduction?: string;
}

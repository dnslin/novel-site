import instance from "./instance";

// 枚举类型定义
export enum ReadingTimeRange {
  MORNING = "MORNING",
  AFTERNOON = "AFTERNOON",
  EVENING = "EVENING",
  NIGHT = "NIGHT",
}

export enum PreferredLength {
  SHORT = "SHORT", // 10万字以下
  MEDIUM = "MEDIUM", // 10-50万字
  LONG = "LONG", // 50-100万字
  EPIC = "EPIC", // 100万字以上
}

export enum UpdateFrequency {
  DAILY = "DAILY", // 每天更新
  WEEKLY = "WEEKLY", // 每周更新
  MULTIPLE = "MULTIPLE", // 多次更新
  COMPLETED = "COMPLETED", // 完结作品
}

// 分类偏好
export interface CategoryPreference {
  categoryId: number;
  preferenceLevel: number; // 0-100
}

// 标签偏好
export interface TagPreference {
  tagId: string;
  preferenceLevel: number; // 0-100
}

// 用户偏好设置接口
export interface UserPreferences {
  readingTimeRange: ReadingTimeRange;
  preferredLength: PreferredLength;
  updateFrequency: UpdateFrequency;
  seriesPreference: boolean;
  updateNotification: boolean;
  categoryPreferences: Record<number, CategoryPreference>;
  tagPreferences: Record<string, TagPreference>;
}

export const preferencesApi = {
  // 获取偏好设置状态
  getPreferencesStatus() {
    return instance.get<never, boolean>("/preferences/status");
  },

  // 保存用户偏好设置
  savePreferences(preferences: UserPreferences) {
    return instance.post<never, string>("/preferences", preferences);
  },
};

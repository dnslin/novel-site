import instance from "./instance";

export interface TagCloud {
  name: string;
  weight: number;
  useCount: number;
}

export const tagApi = {
  // 获取标签云数据
  getTagCloud() {
    return instance.get<never, TagCloud[]>("/tags/cloud");
  },

  // 获取所有标签列表
  getAllTags() {
    return instance.get<never, TagCloud[]>("/tags/cloud"); // 使用同一个接口
  },
};

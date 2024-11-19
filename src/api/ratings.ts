import instance from "./instance";
import type { RatingType, CreateRatingParams } from "@/types";

export const ratingApi = {
  // 获取评分类型列表
  getRatingTypes() {
    return instance.get<never, RatingType[]>("/ratings/types");
  },

  // 创建评分
  createRating(data: CreateRatingParams) {
    return instance.post("/ratings", data);
  },
};

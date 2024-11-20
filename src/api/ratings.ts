import instance from "./instance";
import type {
  RatingType,
  CreateRatingParams,
  BookRatingStats,
  PaginatedResponse,
} from "@/types";

export const ratingApi = {
  // 获取评分类型列表
  getRatingTypes() {
    return instance.get<never, PaginatedResponse<RatingType>>("/rating-types");
  },

  // 创建评分
  createRating(data: CreateRatingParams) {
    return instance.post("/book-ratings", data);
  },

  // 获取书籍评分统计
  getBookRatingStats(bookId: number) {
    return instance.get<never, { stats: BookRatingStats }>(
      `/book-ratings/${bookId}/rating-stats`
    );
  },
};

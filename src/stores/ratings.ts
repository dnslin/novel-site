import { defineStore } from "pinia";
import { ratingApi } from "@/api";
import type { RatingType, BookRatingStats } from "@/types";

interface RatingState {
  ratingTypes: RatingType[];
  currentBookStats: BookRatingStats | null;
  loading: boolean;
  error: string | null;
}

export const useRatingStore = defineStore("ratings", {
  state: (): RatingState => ({
    ratingTypes: [],
    currentBookStats: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchRatingTypes() {
      this.loading = true;
      this.error = null;
      try {
        const response = await ratingApi.getRatingTypes();
        this.ratingTypes = response.items;
      } catch (error: any) {
        this.error = error.message;
        console.error("获取评分类型失败:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchBookRatingStats(bookId: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await ratingApi.getBookRatingStats(bookId);
        this.currentBookStats = response.stats;
      } catch (error: any) {
        this.error = error.message;
        console.error("获取书籍评分统计失败:", error);
      } finally {
        this.loading = false;
      }
    },

    async createRating(bookId: number, ratingTypeId: number, comment?: string) {
      this.loading = true;
      this.error = null;
      try {
        await ratingApi.createRating({
          book_id: bookId,
          rating_type_id: ratingTypeId,
          comment,
        });
        // 重新获取评分统计
        await this.fetchBookRatingStats(bookId);
      } catch (error: any) {
        this.error = error.message;
        console.error("创建评分失败:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});

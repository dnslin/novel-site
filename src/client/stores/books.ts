import { defineStore } from "pinia";
import { bookApi } from "@client/api";
import type { Book } from "@client/types";

interface BookState {
  latestBooks: Book[];
  popularBooks: Book[];
  categories: Array<{
    name: string;
    icon: string;
  }>;
  loading: boolean;
  error: string | null;
}

export const useBookStore = defineStore("books", {
  state: (): BookState => ({
    latestBooks: [],
    popularBooks: [],
    categories: [
      { name: "玄幻", icon: "🐉" },
      { name: "修真", icon: "⚔️" },
      { name: "都市", icon: "🌆" },
      { name: "历史", icon: "📚" },
      { name: "科幻", icon: "🚀" },
      { name: "网游", icon: "🎮" },
    ],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchLatestBooks() {
      this.loading = true;
      this.error = null;
      try {
        const data = await bookApi.getBooks({
          page: 1,
          limit: 6,
          sort: "created_at",
        });
        this.latestBooks = data.list;
      } catch (error: any) {
        this.error = error.message;
        console.error("获取最新书籍失败:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchPopularBooks() {
      this.loading = true;
      this.error = null;
      try {
        const data = await bookApi.getBooks({
          page: 1,
          limit: 6,
          sort: "rating",
        });
        this.popularBooks = data.list;
      } catch (error: any) {
        this.error = error.message;
        console.error("获取热门书籍失败:", error);
      } finally {
        this.loading = false;
      }
    },

    async searchBooks(keyword: string) {
      this.loading = true;
      this.error = null;
      try {
        const data = await bookApi.searchBooks(keyword);
        return data.list;
      } catch (error: any) {
        this.error = error.message;
        console.error("搜索书籍失败:", error);
        return [];
      } finally {
        this.loading = false;
      }
    },
  },
});

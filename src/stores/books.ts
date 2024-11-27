import { defineStore } from "pinia";
import { bookApi } from "@/api";
import type { Book } from "@/types";
import { useToast } from "vue-toastification";

// 定义分类图标映射
const SORT_ICONS: Record<string, string> = {
  悬疑: new URL("@/assets/svg/悬疑.svg", import.meta.url).href,
  科幻: new URL("@/assets/svg/科幻.svg", import.meta.url).href,
  历史: new URL("@/assets/svg/历史.svg", import.meta.url).href,
  文学: new URL("@/assets/svg/文学.svg", import.meta.url).href,
  玄幻: new URL("@/assets/svg/玄幻.svg", import.meta.url).href,
  都市: new URL("@/assets/svg/都市.svg", import.meta.url).href,
  体育: new URL("@/assets/svg/体育.svg", import.meta.url).href,
  游戏: new URL("@/assets/svg/游戏.svg", import.meta.url).href,
  武侠: new URL("@/assets/svg/武侠.svg", import.meta.url).href,
  仙侠: new URL("@/assets/svg/仙侠.svg", import.meta.url).href,
  军事: new URL("@/assets/svg/军事.svg", import.meta.url).href,
  奇幻: new URL("@/assets/svg/奇幻.svg", import.meta.url).href,
  现代言情: new URL("@/assets/svg/现代言情.svg", import.meta.url).href,
  游戏竞技: new URL("@/assets/svg/竞技.svg", import.meta.url).href,
  古代言情: new URL("@/assets/svg/古代言情.svg", import.meta.url).href,
  浪漫青春: new URL("@/assets/svg/浪漫青春.svg", import.meta.url).href,
  传记: new URL("@/assets/svg/传记.svg", import.meta.url).href,
  修真玄幻: new URL("@/assets/svg/修真玄幻.svg", import.meta.url).href,
  玄幻言情: new URL("@/assets/svg/玄幻言情.svg", import.meta.url).href,
  穿越: new URL("@/assets/svg/穿越.svg", import.meta.url).href,
  青春文学: new URL("@/assets/svg/青春文学.svg", import.meta.url).href,
  轻小说: new URL("@/assets/svg/轻小说.svg", import.meta.url).href,
  韩娱小说: new URL("@/assets/svg/韩娱小说.svg", import.meta.url).href,
  现代都市: new URL("@/assets/svg/现代都市.svg", import.meta.url).href,
  现实: new URL("@/assets/svg/现实.svg", import.meta.url).href,
};

interface BookState {
  latestBooks: Book[];
  popularBooks: Book[];
  categories: Array<{
    name: string;
    icon: string;
  }>;
  allCategories: string[];
  loading: boolean;
  error: string | null;
  searchSuggestions: Book[];
}

export const useBookStore = defineStore("books", {
  state: (): BookState => ({
    latestBooks: [],
    popularBooks: [],
    categories: [],
    allCategories: [],
    loading: false,
    error: null,
    searchSuggestions: [],
  }),

  getters: {
    // 获取热门分类（展示前12个）
    hotCategories: (state) => {
      return state.categories.slice(0, 12);
    },
  },

  actions: {
    async fetchCategories() {
      this.loading = true;
      this.error = null;
      try {
        const { sorts } = await bookApi.getBookSorts();
        this.allCategories = sorts;

        // 转换为带图标的分类数组
        this.categories = sorts.map((sort) => ({
          name: sort,
          icon: SORT_ICONS[sort] || SORT_ICONS.default,
        }));
      } catch (error: any) {
        this.error = error.message;
        console.error("获取分类失败:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchLatestBooks() {
      const toast = useToast();
      this.loading = true;
      this.error = null;
      try {
        const data = await bookApi.getBooks({
          page: 1,
          page_size: 6,
          type: "latest",
        });
        this.latestBooks = data.items;
        return data;
      } catch (error: any) {
        this.error = error.message;
        toast.error("获取最新书籍失败");
        throw error;
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
          page_size: 6,
          type: "hotest",
        });
        this.popularBooks = data.items;
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
        return data.items;
      } catch (error: any) {
        this.error = error.message;
        console.error("搜索书籍失败:", error);
        return [];
      } finally {
        this.loading = false;
      }
    },

    async getBookDetail(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const data = await bookApi.getBookDetail(id);
        return data;
      } catch (error: any) {
        this.error = error.message;
        console.error("获取书籍详情失败:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchSearchSuggestions(keyword: string) {
      if (!keyword.trim()) {
        this.searchSuggestions = [];
        return;
      }

      try {
        const data = await bookApi.searchSuggestions(keyword);
        this.searchSuggestions = data.items;
      } catch (error: any) {
        console.error("获取搜索建议失败:", error);
        this.searchSuggestions = [];
      }
    },

    async getBooksByCategory(
      category: string,
      page: number = 1,
      pageSize: number = 12
    ) {
      this.loading = true;
      this.error = null;
      try {
        console.log("Fetching category books with params:", {
          category,
          page,
          pageSize,
        });
        const data = await bookApi.getBooks({
          page,
          page_size: pageSize,
          sort: category,
        });
        console.log("Received data:", data);
        return data;
      } catch (error: any) {
        this.error = error.message;
        console.error("获取分类书籍失败:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getLatestBooks(page: number, pageSize: number) {
      this.loading = true;
      this.error = null;
      try {
        const data = await bookApi.getBooks({
          page,
          page_size: pageSize,
          type: "latest",
        });
        return data;
      } catch (error: any) {
        this.error = error.message;
        console.error("获取最新书籍失败:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getPopularBooks(page: number, pageSize: number) {
      this.loading = true;
      this.error = null;
      try {
        const data = await bookApi.getBooks({
          page,
          page_size: pageSize,
          type: "hotest",
        });
        return data;
      } catch (error: any) {
        this.error = error.message;
        console.error("获取热门书籍失败:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearSearchSuggestions() {
      this.searchSuggestions = [];
    },
  },
});

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { bookApi } from "@/api";
import type { Book } from "@/types";

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
  修真: new URL("@/assets/svg/修真.svg", import.meta.url).href,
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
  仙侠奇缘: new URL("@/assets/svg/仙侠奇缘.svg", import.meta.url).href,
  乡村: new URL("@/assets/svg/乡村.svg", import.meta.url).href,
  二次元: new URL("@/assets/svg/二次元.svg", import.meta.url).href,
  其他: new URL("@/assets/svg/其他.svg", import.meta.url).href,
  同人: new URL("@/assets/svg/同人.svg", import.meta.url).href,
  搞笑: new URL("@/assets/svg/搞笑.svg", import.meta.url).href,
  无限: new URL("@/assets/svg/无限.svg", import.meta.url).href,
  星际: new URL("@/assets/svg/星际.svg", import.meta.url).href,
  末世: new URL("@/assets/svg/末世.svg", import.meta.url).href,
  校园: new URL("@/assets/svg/校园.svg", import.meta.url).href,
  灵异: new URL("@/assets/svg/灵异.svg", import.meta.url).href,
  爽文: new URL("@/assets/svg/爽文.svg", import.meta.url).href,
  电竞: new URL("@/assets/svg/电竞.svg", import.meta.url).href,
  番茄言情: new URL("@/assets/svg/番茄言情.svg", import.meta.url).href,
  种田: new URL("@/assets/svg/种田.svg", import.meta.url).href,
  空间: new URL("@/assets/svg/空间.svg", import.meta.url).href,
  系统: new URL("@/assets/svg/系统.svg", import.meta.url).href,
  综漫: new URL("@/assets/svg/综漫.svg", import.meta.url).href,
  美食: new URL("@/assets/svg/美食.svg", import.meta.url).href,
  职场: new URL("@/assets/svg/职场.svg", import.meta.url).href,
  重生: new URL("@/assets/svg/重生.svg", import.meta.url).href,
  青春: new URL("@/assets/svg/青春.svg", import.meta.url).href,
};

export const useBookStore = defineStore(
  "books",
  () => {
    const latestBooks = ref<Book[]>([]);
    const popularBooks = ref<Book[]>([]);
    const categories = ref<Array<{ name: string; icon: string; id: number }>>(
      []
    );
    const allCategories = ref<Array<{ id: number; name: string }>>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const searchSuggestions = ref<Book[]>([]);
    const categoriesLastUpdated = ref(0);

    // Getters
    const hotCategories = computed(() => categories.value.slice(0, 12));
    const shouldUpdateCategories = computed(() => {
      const ONE_DAY = 24 * 60 * 60 * 1000;
      return (
        categories.value.length === 0 ||
        Date.now() - categoriesLastUpdated.value > ONE_DAY
      );
    });

    // Actions
    const fetchCategories = async () => {
      // 如果分类数据未过期，直接返回
      if (!shouldUpdateCategories.value) {
        return;
      }

      loading.value = true;
      error.value = null;
      try {
        const result = await bookApi.getBookSorts();
        allCategories.value = result;

        // 转换为带图标的分类数组
        categories.value = result.map(
          (category: { id: number; name: string }) => ({
            id: category.id,
            name: category.name,
            icon: SORT_ICONS[category.name] || SORT_ICONS.其他,
          })
        );

        // 更新最后更新时间
        categoriesLastUpdated.value = Date.now();
      } catch (error: any) {
        error.value = error.message;
        console.error("获取分类失败:", error);
      } finally {
        loading.value = false;
      }
    };

    const searchBooks = async (keyword: string) => {
      loading.value = true;
      error.value = null;
      try {
        const data = await bookApi.searchBooks(keyword);
        return data.items;
      } catch (error: any) {
        error.value = error.message;
        console.error("搜索书籍失败:", error);
        return [];
      } finally {
        loading.value = false;
      }
    };

    const getBookDetail = async (id: number) => {
      loading.value = true;
      error.value = null;
      try {
        const data = await bookApi.getBookDetail(id);
        return data;
      } catch (error: any) {
        error.value = error.message;
        console.error("获取书籍详情失败:", error);
        throw error;
      } finally {
        loading.value = false;
      }
    };

    const fetchSearchSuggestions = async (keyword: string) => {
      if (!keyword.trim()) {
        searchSuggestions.value = [];
        return;
      }

      try {
        const data = await bookApi.searchSuggestions(keyword);
        searchSuggestions.value = data.content.map((book: Book) => ({
          ...book,
          title: book.bookName,
        }));
      } catch (error: any) {
        console.error("获取搜索建议失败:", error);
        searchSuggestions.value = [];
      }
    };

    const getBooksByCategory = async (
      categoryId: number,
      page: number = 1,
      pageSize: number = 12
    ) => {
      if (!categoryId || isNaN(categoryId)) {
        throw new Error("无效的分类ID");
      }

      loading.value = true;
      error.value = null;
      try {
        const response = await bookApi.getBooksByCategory(categoryId, {
          page,
          size: pageSize,
        });

        // 检查响应
        if (!response?.content) {
          throw new Error("返回数据格式错误");
        }

        // 适配返回的数据结构
        return {
          items: response.content || [],
          total: response.totalElements || 0,
          page: response.number || 0,
          limit: response.size || pageSize,
        };
      } catch (error: any) {
        error.value = error.message;
        console.error("获取分类书籍失败:", error);
        throw error;
      } finally {
        loading.value = false;
      }
    };

    const getLatestBooks = async (_: number, pageSize: number = 6) => {
      loading.value = true;
      error.value = null;
      try {
        const result = await bookApi.getLatestBooks(pageSize);

        latestBooks.value = result;
        return {
          items: result,
          total: result.length,
        };
      } catch (error: any) {
        error.value = error.message;
        console.error("获取最新书籍失败:", error);
        latestBooks.value = [];
        throw error;
      } finally {
        loading.value = false;
      }
    };

    const getPopularBooks = async (_: number, pageSize: number = 6) => {
      loading.value = true;
      error.value = null;
      try {
        const result = await bookApi.getPopularBooks(pageSize);

        popularBooks.value = result;
        return {
          items: result,
          total: result.length,
        };
      } catch (error: any) {
        error.value = error.message;
        console.error("获取热门书籍失败:", error);
        popularBooks.value = [];
        throw error;
      } finally {
        loading.value = false;
      }
    };

    // 为了保持兼容性
    const fetchLatestBooks = () => getLatestBooks(1, 6);
    const fetchPopularBooks = () => getPopularBooks(1, 6);

    const clearSearchSuggestions = () => {
      searchSuggestions.value = [];
    };

    return {
      // state
      latestBooks,
      popularBooks,
      categories,
      allCategories,
      loading,
      error,
      searchSuggestions,
      categoriesLastUpdated,
      // getters
      hotCategories,
      shouldUpdateCategories,
      // actions
      fetchCategories,
      searchBooks,
      getBookDetail,
      fetchSearchSuggestions,
      getBooksByCategory,
      getLatestBooks,
      getPopularBooks,
      fetchLatestBooks,
      fetchPopularBooks,
      clearSearchSuggestions,
    };
  },
  {
    persist: {
      key: "book-store",
      storage: localStorage,
      serializer: {
        deserialize: JSON.parse,
        serialize: JSON.stringify,
      },
    },
  }
);

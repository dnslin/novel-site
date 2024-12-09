import instance from "./instance";
import type {
  Book,
  BookDetail,
  BookQuery,
  PaginatedResponse,
  ApiResponse,
} from "@/types";

export const bookApi = {
  // 获取书籍列表
  getBooks(params: BookQuery) {
    return instance.post<never, PaginatedResponse<Book>>("/books/list", params);
  },

  // 获取书籍详情
  getBookDetail(id: number) {
    return instance.get<never, BookDetail>(`/books/${id}`);
  },

  // 搜索书籍
  searchBooks(keyword: string) {
    return instance.post<never, PaginatedResponse<Book>>("/books/list", {
      title: keyword,
      page: 1,
      page_size: 10,
    });
  },

  // 添加获取分类接口
  getBookSorts() {
    return instance.get<never, string[]>("/books/categories");
  },

  // 添加搜索建议接口
  searchSuggestions(keyword: string) {
    return instance.post<never, PaginatedResponse<Book>>("/books/search", {
      keyword,
    });
  },

  // 获取最新书籍
  getLatestBooks(limit: number = 10) {
    return instance.get<never, Book[]>(`/books/latest?limit=${limit}`);
  },

  // 获取热门书籍
  getPopularBooks(limit: number = 10) {
    return instance.get<never, Book[]>(`/books/hot?limit=${limit}`);
  },
};

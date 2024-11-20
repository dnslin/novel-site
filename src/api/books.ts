import instance from "./instance";
import type { Book, BookDetail, BookQuery, PaginatedResponse } from "@/types";

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
};

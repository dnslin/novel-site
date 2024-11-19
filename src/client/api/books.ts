import instance from "./instance";
import type { Book, BookDetail, BookQuery, PaginatedData } from "@client/types";

export const bookApi = {
  // 获取书籍列表
  getBooks(params: BookQuery) {
    return instance.get<never, PaginatedData<Book>>("/books", { params });
  },

  // 获取书籍详情
  getBookDetail(id: number) {
    return instance.get<never, BookDetail>(`/books/${id}`);
  },

  // 搜索书籍
  searchBooks(keyword: string) {
    return instance.get<never, PaginatedData<Book>>("/books", {
      params: { keyword },
    });
  },
};

import instance from "./instance";
import type { Chapter } from "@/types/chapter";

export const chapterApi = {
  // 获取书籍的章节列表
  getBookChapters(bookId: number) {
    return instance.get<never, Chapter[]>(`/chapters/books/${bookId}`);
  },
};

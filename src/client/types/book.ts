import type { PaginationQuery } from "./api";

// 书籍相关类型
export interface BookQuery extends PaginationQuery {
  sort?: "created_at" | "rating";
  category?: string;
  keyword?: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  cover?: string;
  intro?: string;
  file_size: number;
  created_at: string;
  sort?: string;
  tag?: string;
}

export interface BookUserRating {
  id: number;
  rating: number;
  comment?: string;
  user_id: number;
  created_at: string;
}

export interface BookDetail extends Book {
  file_url: string;
  ratings: BookUserRating[];
}

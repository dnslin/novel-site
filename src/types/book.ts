import type { PaginationQuery } from "./api";

// 书籍查询参数
export interface BookQuery extends PaginationQuery {
  title?: string;
  author?: string;
  tag?: string;
  sort?: string;
  type?: string;
}

// 书籍列表项
export interface Book {
  id: number;
  title: string;
  author: string;
  cover?: string;
  description?: string;
  sort?: string;
  tag?: string;
}

// 书籍详情
export interface BookDetail extends Book {
  file_name: string;
  file_size: number;
  md5: string;
  new_file_name: string;
  parts: string;
  file_url: string;
  created_at: string;
  hot_value: number;
  intro: string;
  downloads: number;
}

// 添加 BookUserRating 接口
export interface BookUserRating {
  id: number;
  book_id: number;
  user_id: number;
  rating_type_id: number;
  comment?: string;
  created_at: string;
}

import type { PaginationQuery } from "./api";

// 书籍查询参数
export interface BookQuery extends PaginationQuery {
  title?: string;
  author?: string;
  tag?: string;
}

// 书籍列表项
export interface Book {
  id: number;
  title: string;
  author: string;
  cover?: string;
  intro?: string;
  sort?: string;
  type?: string;
  tag?: string;
  hot_value: number;
  created_at: string;
  downloads: number;
}

// 书籍详情
export interface BookDetail extends Book {
  file_name: string;
  file_size: number;
  md5: string;
  new_file_name: string;
  parts: string;
  file_url: string;
  downloads: number;
}

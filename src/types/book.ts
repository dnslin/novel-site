import type { PaginationQuery } from "./api";

// 书籍查询参数
export interface BookQuery extends PaginationQuery {
  title?: string;
  author?: string;
  tag?: string;
  sort?: string;
  type?: string;
}

// 基础的书籍信息接口
export interface Book {
  id: number;
  bookName: string;
  author: string;
  description?: string;
  coverUrl?: string;
  tags?: BookTag[];
  hotValue?: number;
  category?: BookCategory;
  subCategory?: BookCategory;
  bookCount?: number;
  rankCount?: number;
  rankType?: string;
  wordCount?: string;
  readCount?: number;
  bookStatus?: string;
  Source?: string;
  listenCount?: number;
  subInfo?: string;
  lastPublishTime?: string;
  hasDownload?: boolean;
}

// 书籍下载相关信息接口
export interface BookDownloadInfo {
  file_name: string;
  file_size: number;
  md5: string;
  new_file_name: string;
  parts: string;
  file_url: string;
}

// 书籍详情接口，继承基础信息并包含下载信息
export interface BookDetail extends Book, BookDownloadInfo {
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

// BookTag 接口
export interface BookTag {
  id: number;
  name: string;
  useCount: number;
}

// BookCategory 接口
export interface BookCategory {
  id: number;
  name: string;
  parentId?: number;
}

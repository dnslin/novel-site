// 通用响应类型
export interface ApiResponse<T = any> {
  code: number;
  message?: string;
  data: T;
}

// 分页请求参数
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

// 分页响应数据
export interface PaginatedData<T> {
  list: T[];
  total: number;
  page: number;
  limit: number;
}

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

export interface BookDetail extends Book {
  file_url: string;
  ratings: BookRating[];
}

// 评分相关类型
export interface RatingType {
  id: number;
  name: string;
  description: string;
  level: number;
}

export interface BookRating {
  id: number;
  book_id: number;
  rating_type_id: number;
  rating_name: string;
  level: number;
  comment?: string;
  created_at: string;
}

export interface CreateRatingParams {
  book_id: number;
  rating_type_id: number;
  comment?: string;
}

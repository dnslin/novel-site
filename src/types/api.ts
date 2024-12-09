// API 相关类型定义
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  result: T;
}

// 分页相关类型
export interface PaginationQuery {
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  total: number;
  items: T[];
}

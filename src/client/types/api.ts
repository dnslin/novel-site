// API 相关类型定义
export interface ApiResponse<T = any> {
  code: number;
  message?: string;
  data: T;
}

// 分页相关类型
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginatedData<T> {
  list: T[];
  total: number;
  page: number;
  limit: number;
}

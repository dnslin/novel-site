// 评分类型
export interface RatingType {
  id: number;
  name: string;
  description: string;
  level: number;
  created_at: string;
  updated_at: string;
}

// 评分统计
export interface RatingTypeStats extends RatingType {
  count: number;
  percentage: number;
}

export interface BookRatingStats {
  book_id: number;
  total_ratings: number;
  rating_types: RatingTypeStats[];
}

// 创建评分参数
export interface CreateRatingParams {
  book_id: number;
  rating_type_id: number;
  comment?: string;
}

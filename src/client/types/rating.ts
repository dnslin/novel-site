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

export interface BookQuery {
  page?: number;
  limit?: number;
  sort?: string;
  category?: string;
  keyword?: string;
}

export interface Book {
  id: number;
  file_name: string;
  title: string;
  author: string;
  file_size: number;
  md5: string;
  new_file_name: string;
  cover?: string;
  intro?: string;
  parts?: string;
  created_at: string;
  file_url?: string;
  sort?: string;
  type?: string;
  tag?: string;
}

export interface Rating {
  id: number;
  book_id: number;
  rating_type_id: number;
  comment?: string;
  ip?: string;
  created_at: string;
}

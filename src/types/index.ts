export * from "./api";
export * from "./rating";
export type {
  Book,
  BookDetail,
  BookQuery,
  BookUserRating,
  SearchBookResponse,
} from "./book";

export interface CacheItem {
  url: string;
  data: string; // base64 格式的图片数据
  timestamp: number;
}

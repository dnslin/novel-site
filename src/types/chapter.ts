// 章节相关类型定义
export interface Chapter {
  uuid: number;
  title: string;
  volumeName: string;
  wordCount: number;
  chapterUrl: string;
  isVip: boolean;
}

// 按卷分组后的章节
export interface Volume {
  volumeName: string;
  chapters: Chapter[];
}

// 获取章节列表的响应
export interface ChapterListResponse {
  chapters: Chapter[];
  totalCount: number;
}

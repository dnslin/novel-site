import { defineStore } from "pinia";
import { chapterApi } from "@/api";
import type { Chapter, Volume } from "@/types/chapter";

interface ChapterState {
  chapters: Chapter[];
  loading: boolean;
  error: string | null;
  syncing: boolean;
}

export const useChapterStore = defineStore("chapters", {
  state: (): ChapterState => ({
    chapters: [],
    loading: false,
    error: null,
    syncing: false,
  }),

  getters: {
    // 将章节按卷分组
    volumeChapters: (state): Volume[] => {
      const volumeMap = new Map<string, Chapter[]>();

      state.chapters.forEach((chapter) => {
        if (!volumeMap.has(chapter.volumeName)) {
          volumeMap.set(chapter.volumeName, []);
        }
        volumeMap.get(chapter.volumeName)?.push(chapter);
      });

      return Array.from(volumeMap.entries()).map(([volumeName, chapters]) => ({
        volumeName,
        chapters: chapters.sort((a, b) => a.uuid - b.uuid),
      }));
    },

    // 总字数统计
    totalWordCount: (state): number => {
      return state.chapters.reduce(
        (sum, chapter) => sum + chapter.wordCount,
        0
      );
    },

    // 总章节数
    totalChapters: (state): number => state.chapters.length,
  },

  actions: {
    async fetchBookChapters(bookId: number) {
      this.loading = true;
      this.error = null;
      try {
        const chapters = await chapterApi.getBookChapters(bookId);
        this.chapters = chapters;
      } catch (error: any) {
        this.error = error.message;
        console.error("获取章节列表失败:", error);
      } finally {
        this.loading = false;
      }
    },

    async syncChapters(bookId: number) {
      this.syncing = true;
      this.error = null;
      try {
        await chapterApi.syncBookChapters(bookId);
        await this.fetchBookChapters(bookId);
        return { success: true, message: "章节同步成功" };
      } catch (error: any) {
        const errorMessage = error.message || "同步失败";
        this.error = errorMessage;
        return { success: false, message: errorMessage };
      } finally {
        this.syncing = false;
      }
    },
  },
});

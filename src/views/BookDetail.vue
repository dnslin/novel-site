<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBookStore } from '@/stores/books'
import { useRatingStore } from '@/stores/ratings'
import { storeToRefs } from 'pinia'
import type { BookDetail } from '@/types'
import {
  BookOpenIcon,
  CalendarIcon,
  CloudArrowDownIcon,
  HeartIcon,
  UserIcon,
  DocumentTextIcon,
  StarIcon,
  FireIcon,
  SpeakerWaveIcon,
  BookmarkIcon,
  GlobeAltIcon,
  ClockIcon,
  BookmarkSquareIcon,
  ChatBubbleLeftIcon,
  HandThumbUpIcon,
  RectangleStackIcon,
  TagIcon,
  FolderIcon,
  ArrowPathIcon,
} from '@heroicons/vue/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/vue/24/solid'
import { useToast } from 'vue-toastification'
import DownloadProgress from '@/components/book/DownloadProgress.vue'
import ShareBook from '@/components/book/ShareBook.vue'
import { useFileDownload } from '@/utils/download'
import HeicImage from '@/components/common/HeicImage.vue'
import ChapterList from '@/components/book/ChapterList.vue'
import { useChapterStore } from '@/stores/chapters'

const route = useRoute()
const bookStore = useBookStore()
const ratingStore = useRatingStore()
const toast = useToast()
const chapterStore = useChapterStore()
const { syncing } = storeToRefs(chapterStore)

const bookId = Number(route.params.id)
const book = ref<BookDetail | null>(null)
const { loading: ratingLoading } = storeToRefs(ratingStore)
const commentText = ref('')

const { downloading, progress: downloadProgress, download } = useFileDownload()

// 添加收藏状态
const isCollected = ref(false)
const toggleCollect = () => {
  isCollected.value = !isCollected.value
  // TODO: 调用收藏 API
}

// 添加评分动画状态
const showRatingSuccess = ref(false)
const handleRateWithAnimation = async (ratingTypeId: number) => {
  try {
    await handleRate(ratingTypeId)
    showRatingSuccess.value = true
    setTimeout(() => {
      showRatingSuccess.value = false
    }, 2000)
  } catch (error) {
    console.error('评分失败:', error)
  }
}

// 获取数据
onMounted(async () => {
  // 滚动到顶
  window.scrollTo({ top: 0, behavior: 'smooth' })

  try {
    // 获取书籍详情
    const response = await bookStore.getBookDetail(bookId)
    book.value = response

    // 获取评分类型和统计
    await Promise.all([
      ratingStore.fetchRatingTypes(),
      ratingStore.fetchBookRatingStats(bookId)
    ])
  } catch (error) {
    console.error('获取数据失败:', error)
  }
})

// 提交评分
const handleRate = async (ratingTypeId: number) => {
  try {
    await ratingStore.createRating(bookId, ratingTypeId, commentText.value)
    commentText.value = '' // 清空评论
    toast.success("评分成功！")
  } catch (error) {
    toast.error("评分失败，请稍后重")
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

// 格式化日期
const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
// 文件下载函数
const downloadBook = async () => {
  if (!book.value?.fileUrl) return

  await download({
    url: book.value.fileUrl,
    fileName: book.value.fileName || 'download.txt',
    fileSize: book.value.fileSize,
    onProgress: (progress) => {
      console.log(`Download progress: ${progress}%`)
    }
  })
}

// 获取当前页面URL用于分享
const pageUrl = computed(() => {
  if (typeof window !== 'undefined') {
    return window.location.href
  }
  return ''
})

// 添加新的响应式变量
const isImageLoaded = ref(false)
const statCardHovered = ref<number | null>(null)

// 添加图片加载完成的处理函数 
const handleImageLoad = () => {
  isImageLoaded.value = true
}



// 添加同步方法
const handleSync = async () => {
  if (syncing.value || !book.value) return;

  try {
    const result = await chapterStore.syncChapters(book.value.id);
    toast[result.success ? 'success' : 'error'](result.message);
  } catch (error: any) {
    toast.error("同步失败");
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- 添加骨架屏 -->
    <div v-if="!book" class="animate-pulse">
      <!-- 移动端骨架屏 -->
      <div class="md:hidden">
        <div class="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
      </div>

      <!-- 桌面端骨架屏 -->
      <div class="hidden md:flex gap-8">
        <div class="w-64 h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div class="flex-1">
          <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
          <div class="space-y-4">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 书籍详情内容 -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <!-- 移动端布局 -->
      <div class="md:hidden">
        <!-- 封面图 -->
        <div class="relative w-full" style="padding-bottom: 56.25%;">
          <div class="absolute inset-0">
            <HeicImage :src="book.coverUrl || '/placeholder.jpg'" :alt="book.bookName" @load="handleImageLoad"
              class="transition-all duration-500 group-hover:scale-110" />
          </div>
        </div>

        <div class="p-4">
          <!-- 标题和作者 -->
          <h1 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {{ book.bookName }}
            <StarIcon v-if="book.hot_value > 1000" class="inline-block w-5 h-5 text-yellow-400 animate-pulse ml-2" />
          </h1>
          <div class="flex items-center gap-2 mb-4 text-gray-600 dark:text-gray-400">
            <UserIcon class="w-4 h-4" />
            <span>{{ book.author }}</span>
          </div>

          <!-- 分类和标签 -->
          <div class="space-y-3 mb-4">
            <!-- 分类 -->
            <div v-if="book.category || book.subCategory" class="flex flex-wrap gap-2">
              <span v-if="book.category" class="px-2 py-1 rounded-full text-sm 
                         bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light">
                {{ book.category.name }}
              </span>
              <span v-if="book.subCategory" class="px-2 py-1 rounded-full text-sm 
                         bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light">
                {{ book.subCategory.name }}
              </span>
            </div>

            <!-- 标签 -->
            <div v-if="book.tags?.length" class="flex flex-wrap gap-2">
              <span v-for="tag in book.tags" :key="tag.id" class="px-2 py-1 rounded-full text-sm 
                       bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                {{ tag.name }}
              </span>
            </div>
          </div>

          <!-- 基础信息 -->
          <div class="grid grid-cols-2 gap-3 mb-4">
            <!-- 热度 -->
            <div v-if="book.hot_value" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <FireIcon class="w-4 h-4 text-orange-500" />
              <span>热度: {{ book.hot_value }}</span>
            </div>

            <!-- 字数 -->
            <div v-if="book.wordCount" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <DocumentTextIcon class="w-4 h-4 text-green-500" />
              <span>字数: {{ book.wordCount }}</span>
            </div>

            <!-- 阅读次数 -->
            <div v-if="book.readCount" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <BookOpenIcon class="w-4 h-4 text-blue-500" />
              <span>阅读: {{ book.readCount }}</span>
            </div>

            <!-- 听书次数 -->
            <div v-if="book.listenCount" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <SpeakerWaveIcon class="w-4 h-4 text-purple-500" />
              <span>听书: {{ book.listenCount }}</span>
            </div>

            <!-- 来源 -->
            <div v-if="book.Source" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <GlobeAltIcon class="w-4 h-4 text-indigo-500" />
              <span>来源: {{ book.Source }}</span>
            </div>

            <!-- 状态 -->
            <div v-if="book.bookStatus" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <BookmarkIcon class="w-4 h-4 text-rose-500" />
              <span>状态: {{ book.bookStatus }}</span>
            </div>
          </div>

          <!-- 简介 -->
          <div v-if="book.description || book.intro" class="mb-4">
            <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
              {{ book.description || book.intro }}
            </p>
          </div>

          <!-- 章节列表 -->
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BookmarkSquareIcon class="w-6 h-6 text-primary" />
              <span>章节列表</span>
            </h2>
            <button @click="handleSync" :disabled="syncing" class="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg
                     text-gray-700 dark:text-gray-300
                     border border-gray-300 dark:border-gray-600
                     hover:bg-gray-100 dark:hover:bg-gray-700
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-300">
              <ArrowPathIcon class="w-4 h-4" :class="{ 'animate-spin': syncing }" />
              {{ syncing ? '同步中...' : '同步章节' }}
            </button>
          </div>

          <!-- 章节列表组件 -->
          <ChapterList :book-id="bookId" />

          <!-- 评分统计 -->
          <div v-if="ratingStore.currentBookStats" class="mb-4 bg-white dark:bg-gray-800 rounded-lg p-4">
            <h2 class="text-lg font-bold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
              <HandThumbUpIcon class="w-5 h-5 text-primary" />
              <span>评分统计</span>
            </h2>
            <div class="space-y-3">
              <div v-for="type in ratingStore.currentBookStats.rating_types" :key="type.id"
                class="flex items-center gap-2">
                <span class="w-16 text-sm text-gray-700 dark:text-gray-300">{{ type.name }}</span>
                <div class="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div class="bg-primary dark:bg-primary-light h-full rounded-full transition-all duration-300"
                    :style="{ width: `${type.percentage}%` }"></div>
                </div>
                <span class="text-xs text-gray-600 dark:text-gray-400">
                  {{ type.count }}人
                </span>
              </div>
            </div>
          </div>

          <!-- 评分表单 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h2 class="text-lg font-bold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
              <ChatBubbleLeftIcon class="w-5 h-5 text-primary" />
              <span>评价本书</span>
            </h2>
            <div class="space-y-3">
              <textarea v-model="commentText" rows="3" class="w-full border dark:border-gray-600 rounded-lg p-2 
                        bg-white dark:bg-gray-700 
                        text-gray-700 dark:text-gray-200
                        text-sm
                        placeholder:text-gray-400 dark:placeholder:text-gray-500
                        focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-light/50
                        focus:border-transparent" placeholder="写下你的评价...">
              </textarea>
              <div class="flex flex-wrap gap-2">
                <button v-for="type in ratingStore.ratingTypes" :key="type.id" @click="handleRateWithAnimation(type.id)"
                  :disabled="ratingLoading" class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                        text-gray-700 dark:text-gray-300 
                        hover:bg-primary hover:text-white hover:border-primary 
                        dark:hover:bg-primary-light dark:hover:border-primary-light 
                        disabled:opacity-50 disabled:cursor-not-allowed">
                  <span class="flex items-center">
                    <StarIcon class="w-4 h-4 mr-1" />
                    {{ type.name }}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex flex-col gap-3">
            <!-- 下载进度条 -->
            <div v-if="book.hasDownload && downloading" class="w-full">
              <DownloadProgress :progress="downloadProgress" :downloading="downloading" @retry="downloadBook" />
            </div>

            <!-- 按钮组 -->
            <div class="grid grid-cols-3 gap-3">
              <!-- 下载按钮 -->
              <button v-if="book.hasDownload" @click="downloadBook" :disabled="downloading" class="flex items-center justify-center px-2 py-2 
                       bg-primary hover:bg-primary-dark dark:bg-primary-light 
                       dark:hover:bg-primary text-white rounded-lg 
                       transition-colors duration-300 text-sm whitespace-nowrap">
                <CloudArrowDownIcon class="w-4 h-4" />
                <span class="ml-1">{{ downloading ? '下载中' : '下载' }}</span>
              </button>

              <button v-else disabled class="flex items-center justify-center px-2 py-2 
                       bg-gray-300 dark:bg-gray-600 text-gray-500 
                       dark:text-gray-400 rounded-lg cursor-not-allowed 
                       text-sm whitespace-nowrap">
                <CloudArrowDownIcon class="w-4 h-4" />
                <span class="ml-1">暂无下载</span>
              </button>

              <!-- 收藏按钮 -->
              <button @click="toggleCollect" class="flex items-center justify-center px-2 py-2 
                       border border-gray-300 dark:border-gray-600 
                       text-gray-700 dark:text-gray-300 rounded-lg 
                       hover:bg-gray-50 dark:hover:bg-gray-700/50 
                       transition-colors duration-300 text-sm whitespace-nowrap">
                <component :is="isCollected ? HeartSolidIcon : HeartIcon" class="w-4 h-4"
                  :class="{ 'text-red-500': isCollected }" />
                <span class="ml-1">{{ isCollected ? '已收藏' : '收藏' }}</span>
              </button>

              <!-- 分享按钮 -->
              <ShareBook :title="book.bookName" :author="book.author"
                :description="book.description || book.intro || ''" :url="pageUrl" class="text-sm" />
            </div>
          </div>
        </div>
      </div>

      <!-- 桌面端布局 -->
      <div class="hidden md:flex flex-col p-6">
        <div class="flex gap-8">
          <!-- 左侧封面和基础信息 -->
          <div class="w-64 flex-shrink-0 space-y-6">
            <!-- 封面 -->
            <div class="group relative overflow-hidden rounded-lg shadow-lg" style="padding-bottom: 150%">
              <div class="absolute inset-0">
                <HeicImage :src="book.coverUrl || '/placeholder.jpg'" :alt="book.bookName" @load="handleImageLoad"
                  class="transition-all duration-500 group-hover:scale-110" />
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="absolute bottom-4 left-4 right-4 text-white transform translate-y-4 
                     group-hover:translate-y-0 transition-transform duration-300">
                  <h3 class="text-lg font-bold">{{ book.bookName }}</h3>
                  <p class="text-sm opacity-90">{{ book.author }}</p>
                </div>
              </div>
            </div>

            <!-- 基础信息卡片 -->
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-3 shadow-md">
              <!-- 书籍状态 -->
              <div v-if="book.bookStatus" class="flex items-center gap-2">
                <BookmarkIcon class="w-5 h-5 text-primary" />
                <span class="text-gray-700 dark:text-gray-300">{{ book.bookStatus }}</span>
              </div>

              <!-- 来源 -->
              <div v-if="book.Source" class="flex items-center gap-2">
                <GlobeAltIcon class="w-5 h-5 text-primary" />
                <span class="text-gray-700 dark:text-gray-300">{{ book.Source }}</span>
              </div>

              <!-- 字数 -->
              <div v-if="book.wordCount" class="flex items-center gap-2">
                <DocumentTextIcon class="w-5 h-5 text-primary" />
                <span class="text-gray-700 dark:text-gray-300">{{ book.wordCount }}字</span>
              </div>
            </div>

            <!-- 操作按钮组 -->
            <div class="space-y-3">
              <!-- 下载按钮根据 hasDownload 显示不同状态 -->
              <button v-if="book.hasDownload" @click="downloadBook" :disabled="downloading" class="w-full flex items-center justify-center px-4 py-2.5 
                       bg-primary hover:bg-primary-dark dark:bg-primary-light 
                       dark:hover:bg-primary text-white rounded-lg 
                       transition-colors duration-300">
                <CloudArrowDownIcon class="w-5 h-5 mr-2" />
                <span>{{ downloading ? '下载中...' : '下载' }}</span>
              </button>

              <button v-else disabled class="w-full flex items-center justify-center px-4 py-2.5 
                       bg-gray-300 dark:bg-gray-600 text-gray-500 
                       dark:text-gray-400 rounded-lg cursor-not-allowed">
                <CloudArrowDownIcon class="w-5 h-5 mr-2" />
                <span>暂无下载</span>
              </button>

              <button @click="toggleCollect" class="w-full flex items-center justify-center px-4 py-2.5 
                       border border-gray-300 dark:border-gray-600 
                       text-gray-700 dark:text-gray-300 rounded-lg 
                       hover:bg-gray-50 dark:hover:bg-gray-700/50 
                       transition-colors duration-300">
                <component :is="isCollected ? HeartSolidIcon : HeartIcon" class="w-5 h-5 mr-2"
                  :class="{ 'text-red-500': isCollected }" />
                {{ isCollected ? '已收藏' : '收藏' }}
              </button>

              <ShareBook :title="book.bookName" :author="book.author" :description="book.description || ''"
                :url="pageUrl" class="w-full" />
            </div>
          </div>

          <!-- 右侧主要内容 -->
          <div class="flex-1 space-y-6">
            <!-- 标题和作者 -->
            <div>
              <div class="flex items-center gap-4 mb-3">
                <h1 class="text-3xl font-bold book-title">{{ book.bookName }}</h1>
                <StarIcon class="w-6 h-6 text-yellow-400 animate-[spin_4s_linear_infinite]"
                  v-if="book.hot_value > 1000" />
              </div>
              <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <UserIcon class="w-5 h-5" />
                <span>{{ book.author }}</span>
              </div>
            </div>

            <!-- 分类标签 -->
            <div class="space-y-3">
              <!-- 分类 -->
              <div v-if="book.category || book.subCategory" class="flex flex-wrap items-center gap-2">
                <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <FolderIcon class="w-4 h-4" />
                  <span>分类：</span>
                </div>
                <span v-if="book.category" class="px-3 py-1 rounded-full text-sm 
                           bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light">
                  {{ book.category.name }}
                </span>
                <span v-if="book.subCategory" class="px-3 py-1 rounded-full text-sm 
                           bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light">
                  {{ book.subCategory.name }}
                </span>
              </div>

              <!-- 标签 -->
              <div v-if="book.tags?.length" class="flex flex-wrap items-center gap-2">
                <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <TagIcon class="w-4 h-4" />
                  <span>标签：</span>
                </div>
                <span v-for="tag in book.tags" :key="tag.id" class="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 
                         text-gray-700 dark:text-gray-300 hover:scale-105 transition-transform">
                  {{ tag.name }}
                  <span class="text-xs text-gray-500 dark:text-gray-400 ml-1">({{ tag.useCount }})</span>
                </span>
              </div>
            </div>

            <!-- 统计数据网格 -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <!-- 热度 -->
              <div class="stat-card">
                <FireIcon class="w-5 h-5 text-orange-500" />
                <span class="stat-label">热度</span>
                <span class="stat-value">{{ book.hot_value || book.hotValue || 0 }}</span>
              </div>

              <!-- 其他统计卡片 -->
              <template v-if="book.downloads">
                <div class="stat-card">
                  <CloudArrowDownIcon class="w-5 h-5 text-blue-500" />
                  <span class="stat-label">下载</span>
                  <span class="stat-value">{{ book.downloads }}</span>
                </div>
              </template>

              <!-- 阅读次数 -->
              <template v-if="book.readCount">
                <div class="stat-card">
                  <BookOpenIcon class="w-5 h-5 text-green-500" />
                  <span class="stat-label">阅读</span>
                  <span class="stat-value">{{ book.readCount }}</span>
                </div>
              </template>

              <!-- 听书数 -->
              <template v-if="book.listenCount">
                <div class="stat-card">
                  <SpeakerWaveIcon class="w-5 h-5 text-purple-500" />
                  <span class="stat-label">听书</span>
                  <span class="stat-value">{{ book.listenCount }}</span>
                </div>
              </template>

              <!-- 榜单 -->
              <template v-if="book.rankType">
                <div class="stat-card">
                  <RectangleStackIcon class="w-5 h-5 text-indigo-500" />
                  <span class="stat-label">榜单</span>
                  <span class="stat-value">{{ book.rankType }}</span>
                </div>
              </template>
              <!-- 月票 -->
              <template v-if="book.rankCount">
                <div class="stat-card">
                  <RectangleStackIcon class="w-5 h-5 text-indigo-500" />
                  <span class="stat-label">月票</span>
                  <span class="stat-value">{{ book.rankCount }}</span>
                </div>
              </template>
              <!-- 文件大小 -->
              <template v-if="book.fileSize">
                <div class="stat-card">
                  <RectangleStackIcon class="w-5 h-5 text-indigo-500" />
                  <span class="stat-label">文件大小</span>
                  <span class="stat-value">{{ formatFileSize(book.fileSize) }}</span>
                </div>
              </template>
              <!-- 追读人数 -->
              <template v-if="book.subInfo">
                <div class="stat-card">
                  <RectangleStackIcon class="w-5 h-5 text-indigo-500" />
                  <span class="stat-label">追读人数</span>
                  <span class="stat-value">{{ book.subInfo }}</span>
                </div>
              </template>
            </div>

            <!-- 简介 -->
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BookmarkSquareIcon class="w-6 h-6 text-primary" />
                <span>简介</span>
              </h2>
              <div class="relative">
                <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line 
                          line-clamp-4 hover:line-clamp-none transition-all duration-300">
                  {{ book.description || book.intro }}
                </p>
                <div class="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t 
                            from-white dark:from-gray-800 to-transparent 
                            pointer-events-none"></div>
              </div>
            </div>

            <!-- 更新信息 -->
            <div class="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span v-if="book.lastPublishTime" class="flex items-center gap-1">
                <CalendarIcon class="w-4 h-4" />
                最后更新：{{ formatDate(book.lastPublishTime) }}
              </span>
              <span v-if="book.created_at" class="flex items-center gap-1">
                <ClockIcon class="w-4 h-4" />
                创建时间：{{ formatDate(book.created_at) }}
              </span>
            </div>

            <!-- 章节列表 -->
            <div class="mt-8">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <BookmarkSquareIcon class="w-6 h-6 text-primary" />
                  <span>章节列表</span>
                </h2>
                <button @click="handleSync" :disabled="syncing" class="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg
                         text-gray-700 dark:text-gray-300
                         border border-gray-300 dark:border-gray-600
                         hover:bg-gray-100 dark:hover:bg-gray-700
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-300">
                  <ArrowPathIcon class="w-4 h-4" :class="{ 'animate-spin': syncing }" />
                  {{ syncing ? '同步中...' : '同步章节' }}
                </button>
              </div>
              <ChapterList :book-id="bookId" />
            </div>
          </div>
        </div>

        <!-- 评分和评论区域 -->
        <div class="mt-8 grid grid-cols-1 gap-8">
          <!-- 评分统计 -->
          <div v-if="ratingStore.currentBookStats" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <HandThumbUpIcon class="w-6 h-6 text-primary" />
              <span>评分统计</span>
            </h2>
            <div class="space-y-4">
              <div v-for="type in ratingStore.currentBookStats.rating_types" :key="type.id"
                class="flex items-center gap-4">
                <span class="w-20 text-gray-700 dark:text-gray-300">{{ type.name }}</span>
                <div class="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div class="bg-primary dark:bg-primary-light h-full rounded-full transition-all duration-300"
                    :style="{ width: `${type.percentage}%` }"></div>
                </div>
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ type.count }}人 ({{ type.percentage }}%)
                </span>
              </div>
            </div>
          </div>

          <!-- 评分表单 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <ChatBubbleLeftIcon class="w-6 h-6 text-primary" />
              <span>评价本书</span>
            </h2>
            <div class="space-y-4">
              <textarea v-model="commentText" rows="3" class="w-full border dark:border-gray-600 rounded-lg p-2 
                       bg-white dark:bg-gray-700 
                       text-gray-700 dark:text-gray-200
                       placeholder:text-gray-400 dark:placeholder:text-gray-500
                       focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-light/50
                       focus:border-transparent" placeholder="写下你的评价..."></textarea>
              <div class="flex flex-wrap gap-2">
                <button v-for="type in ratingStore.ratingTypes" :key="type.id" @click="handleRateWithAnimation(type.id)"
                  :disabled="ratingLoading" class="rating-btn px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                  text-gray-700 dark:text-gray-300 transition-all duration-300
                  hover:bg-primary hover:text-white hover:border-primary 
                  dark:hover:bg-primary-light dark:hover:border-primary-light 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transform hover:-translate-y-1 active:translate-y-0" :class="{
                    'animate-[success-pulse_0.5s_ease-in-out]': showRatingSuccess
                  }">
                  <span class="flex items-center">
                    <StarIcon class="w-5 h-5 mr-1" />
                    {{ type.name }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 添加新的动画效果 */
@keyframes success-pulse {

  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

.stat-card {
  @apply flex flex-col items-center p-4 rounded-lg bg-white dark:bg-gray-800 transition-all duration-300;
}

.stat-card:hover {
  animation: float 3s ease-in-out infinite;
}

/* 其他现有样式保持不变 */

/* 渐变背景动画 */
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

/* 闪光效果动画 */
@keyframes shine {
  0% {
    mask-position: -50%;
  }

  100% {
    mask-position: 150%;
  }
}

/* 添加章节悬停特效 */
.chapter-item {
  @apply relative overflow-hidden;
}

.chapter-item::after {
  content: '';
  @apply absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent;
  mask: linear-gradient(#000 0 0);
  mask-composite: exclude;
  mask-position: -50%;
  animation: shine 2s infinite;
  opacity: 0;
  transition: opacity 0.3s;
}

.chapter-item:hover::after {
  opacity: 1;
}

/* 标题特效 */
.book-title {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-dark to-primary;
  background-size: 200% 100%;
  animation: gradient 8s ease infinite;
}

/* 统计卡片阴影效果 */
.stat-card {
  @apply relative;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

/* 评分按钮特效 */
.rating-btn {
  @apply relative overflow-hidden;
}

.rating-btn::before {
  content: '';
  @apply absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20;
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.rating-btn:hover::before {
  transform: translateX(100%);
}

/* 添加同步按钮动画 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
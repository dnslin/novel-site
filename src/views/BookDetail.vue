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
  TagIcon,
  DocumentTextIcon,
  StarIcon,
  FireIcon,
} from '@heroicons/vue/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/vue/24/solid'
import { useToast } from 'vue-toastification'
import DownloadProgress from '@/components/book/DownloadProgress.vue'
import ShareBook from '@/components/book/ShareBook.vue'
import { useFileDownload } from '@/utils/download'

const route = useRoute()
const bookStore = useBookStore()
const ratingStore = useRatingStore()
const toast = useToast()

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
  // 滚动到顶部
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
    toast.error("评分失败，请稍后重试")
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
  if (!book.value?.file_url) return

  await download({
    url: book.value.file_url,
    fileName: book.value.file_name || 'download.txt',
    fileSize: book.value.file_size,
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
      <!-- 移动端封面和标题 -->
      <div class="md:hidden">
        <div class="relative w-full pb-[56.25%]">
          <img :src="book.coverUrl || '/placeholder.jpg'" :alt="book.bookName"
            class="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div class="p-4">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {{ book.bookName }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mb-4">{{ book.author }}</p>

          <!-- 添加移动端标签 -->
          <div class="flex flex-wrap gap-2 mb-4">
            <span class="px-2 py-1 rounded-full text-sm bg-primary/10 dark:bg-primary/20 
                         text-primary dark:text-primary-light">
              {{ book.category }}
            </span>
            <span class="px-2 py-1 rounded-full text-sm bg-primary/10 dark:bg-primary/20 
                         text-primary dark:text-primary-light">
              {{ book.tag }}
            </span>
          </div>

          <!-- 添加移动端统计数据 -->
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <FireIcon class="w-4 h-4 text-orange-500" />
              <span>热度: {{ book.hot_value }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CloudArrowDownIcon class="w-4 h-4 text-blue-500" />
              <span>下载: {{ book.downloads }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <DocumentTextIcon class="w-4 h-4 text-green-500" />
              <span>大小: {{ formatFileSize(book.file_size) }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CalendarIcon class="w-4 h-4 text-purple-500" />
              <span>{{ formatDate(book.created_at) }}</span>
            </div>
          </div>

          <!-- 添加移动端简介 -->
          <p class="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
            {{ book.intro }}
          </p>

          <!-- 添加移动端操作按钮 -->
          <div class="flex flex-col gap-3">
            <!-- 下载进度条 -->
            <div v-if="downloading" class="w-full">
              <DownloadProgress :progress="downloadProgress" :downloading="downloading" @retry="downloadBook" />
            </div>

            <!-- 操作按钮 -->
            <div class="grid grid-cols-3 gap-3">
              <button @click="downloadBook" :disabled="downloading" class="flex items-center justify-center px-4 py-2 
                       bg-primary hover:bg-primary-dark dark:bg-primary-light 
                       dark:hover:bg-primary text-white rounded-lg 
                       transition-colors duration-300 text-sm">
                <CloudArrowDownIcon class="w-4 h-4" />
                <span class="ml-1">{{ downloading ? '下载中' : '下载' }}</span>
              </button>

              <button @click="toggleCollect" class="flex items-center justify-center px-4 py-2 
                       border border-gray-300 dark:border-gray-600 
                       text-gray-700 dark:text-gray-300 rounded-lg 
                       hover:bg-gray-50 dark:hover:bg-gray-700/50 
                       transition-colors duration-300 text-sm">
                <HeartIcon v-if="!isCollected" class="w-4 h-4" />
                <HeartSolidIcon v-else class="w-4 h-4 text-red-500" />
                <span class="ml-1">{{ isCollected ? '已收藏' : '收藏' }}</span>
              </button>

              <ShareBook :title="book.bookName" :author="book.author" :description="book.intro || ''" :url="pageUrl"
                class="text-sm" />
            </div>
          </div>
        </div>
      </div>

      <!-- 桌面端布局 -->
      <div class="hidden md:flex gap-8 p-6">
        <!-- 封面 - 添加悬停效果 -->
        <div class="w-64 flex-shrink-0 group">
          <div class="relative overflow-hidden rounded-lg">
            <img :src="book.coverUrl || '/placeholder.jpg'" :alt="book.bookName"
              class="w-full transition-transform duration-500 group-hover:scale-110" />
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 
                      transition-opacity duration-300 flex items-center justify-center">
              <BookOpenIcon class="w-12 h-12 text-white transform -translate-y-4 
                                 group-hover:translate-y-0 transition-all duration-300" />
            </div>
          </div>
        </div>

        <!-- 主要信息 -->
        <div class="flex-grow">
          <div class="flex items-center gap-4 mb-3">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ book.bookName }}</h1>
            <StarIcon class="w-6 h-6 text-yellow-400 animate-pulse" v-if="book.hot_value > 1000" />
          </div>

          <div class="flex items-center gap-2 mb-4 text-gray-600 dark:text-gray-400">
            <UserIcon class="w-5 h-5" />
            <span>{{ book.author }}</span>
          </div>

          <!-- 标签组 - 添加图标和动画 -->
          <div class="flex flex-wrap items-center gap-3 mb-6">
            <span
              class="flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-all duration-300 hover:scale-105 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light">
              <TagIcon class="w-4 h-4" />
              {{ book.category }}
            </span>
            <span
              class="flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-all duration-300 hover:scale-105 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light">
              <DocumentTextIcon class="w-4 h-4" />
              {{ book.tag }}
            </span>
          </div>

          <!-- 统计数据 - 添加动画和图标 -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div
              class="flex flex-col items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition-all duration-300 hover:scale-105">
              <FireIcon class="w-5 h-5 text-orange-500 mb-1" />
              <span class="text-sm text-gray-500 dark:text-gray-400">热度</span>
              <span class="text-lg font-semibold text-gray-900 dark:text-white">{{ book.hot_value }}</span>
            </div>
            <div
              class="flex flex-col items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition-all duration-300 hover:scale-105">
              <CloudArrowDownIcon class="w-5 h-5 text-blue-500 mb-1" />
              <span class="text-sm text-gray-500 dark:text-gray-400">下载次数</span>
              <span class="text-lg font-semibold text-gray-900 dark:text-white">{{ book.downloads }}</span>
            </div>
            <div
              class="flex flex-col items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition-all duration-300 hover:scale-105">
              <DocumentTextIcon class="w-5 h-5 text-green-500 mb-1" />
              <span class="text-sm text-gray-500 dark:text-gray-400">文件大小</span>
              <span class="text-lg font-semibold text-gray-900 dark:text-white">{{ formatFileSize(book.file_size)
                }}</span>
            </div>
            <div
              class="flex flex-col items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition-all duration-300 hover:scale-105">
              <CalendarIcon class="w-5 h-5 text-purple-500 mb-1" />
              <span class="text-sm text-gray-500 dark:text-gray-400">上传时间</span>
              <span class="text-lg font-semibold text-gray-900 dark:text-white">{{ formatDate(book.created_at) }}</span>
            </div>
          </div>

          <!-- 简介 - 添加渐变遮罩 -->
          <div class="text-gray-700 dark:text-gray-300 mb-6 relative">
            <span class="line-clamp-3 hover:line-clamp-none transition-all duration-500">
              {{ book.intro }}
            </span>
            <div class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t 
                        from-white dark:from-gray-800 to-transparent 
                        pointer-events-none"></div>
          </div>

          <!-- 修改操作按钮部分 -->
          <div class="flex flex-wrap gap-4">
            <div class="w-full" v-if="downloading">
              <DownloadProgress :progress="downloadProgress" :downloading="downloading" @retry="downloadBook" />
            </div>

            <button @click="downloadBook" :disabled="downloading" class="flex-1 md:flex-none flex items-center justify-center px-6 py-2.5 
                     bg-primary hover:bg-primary-dark dark:bg-primary-light 
                     dark:hover:bg-primary text-white rounded-lg transition-colors 
                     duration-300 shadow-sm hover:shadow-md disabled:opacity-80 
                     disabled:cursor-wait">
              <CloudArrowDownIcon class="w-5 h-5 mr-2" />
              <span>{{ downloading ? '下载中...' : '下载' }}</span>
            </button>

            <button @click="toggleCollect" class="flex-1 md:flex-none flex items-center justify-center px-6 py-2.5 
                     border border-gray-300 dark:border-gray-600 
                     text-gray-700 dark:text-gray-300 rounded-lg 
                     hover:bg-gray-50 dark:hover:bg-gray-700/50 
                     transition-colors duration-300">
              <HeartIcon v-if="!isCollected" class="w-5 h-5 mr-2" />
              <HeartSolidIcon v-else class="w-5 h-5 mr-2 text-red-500" />
              {{ isCollected ? '已收藏' : '收藏' }}
            </button>

            <ShareBook :title="book.bookName" :author="book.author" :description="book.intro || ''" :url="pageUrl" />
          </div>
        </div>
      </div>
    </div>

    <!-- 评分统计部分保持不变，但添加深色模式支持 -->
    <div v-if="ratingStore.currentBookStats" class="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">评分统计</h2>
      <div class="space-y-4">
        <div v-for="type in ratingStore.currentBookStats.rating_types" :key="type.id" class="flex items-center gap-4">
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

    <!-- 评分表单部分也添加深色模式支持 -->
    <div class="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">评价本书</h2>
      <div class="space-y-4">
        <textarea v-model="commentText" rows="3" class="w-full border dark:border-gray-600 rounded-lg p-2 
                 bg-white dark:bg-gray-700 
                 text-gray-700 dark:text-gray-200
                 placeholder:text-gray-400 dark:placeholder:text-gray-500
                 focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-light/50
                 focus:border-transparent" placeholder="写下你的评价..."></textarea>
        <div class="flex flex-wrap gap-2">
          <button v-for="type in ratingStore.ratingTypes" :key="type.id" @click="handleRateWithAnimation(type.id)"
            :disabled="ratingLoading"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white hover:border-primary dark:hover:bg-primary-light dark:hover:border-primary-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="{
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
</template>

<style scoped>
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

/* 添加移动端响应式样式 */
@media (max-width: 640px) {
  .hero-section {
    min-height: 300px;
  }

  .book-cover {
    width: 100%;
    max-width: 240px;
    margin: 0 auto;
  }
}
</style>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBookStore } from '@/stores/books'
import { useRatingStore } from '@/stores/ratings'
import { storeToRefs } from 'pinia'
import type { BookDetail } from '@/types'

const route = useRoute()
const bookStore = useBookStore()
const ratingStore = useRatingStore()

const bookId = Number(route.params.id)
const book = ref<BookDetail | null>(null)
const { loading: ratingLoading } = storeToRefs(ratingStore)
const commentText = ref('')

// 添加下载相关的状态
const downloading = ref(false)
const downloadProgress = ref(0)

// 获取数据
onMounted(async () => {
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
  } catch (error) {
    console.error('评分失败:', error)
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

  downloading.value = true
  downloadProgress.value = 0

  try {
    const response = await fetch(book.value.file_url)
    if (!response.ok) throw new Error('Download failed')

    // 获取文件大小
    const contentLength = Number(response.headers.get('content-length'))
    let receivedLength = 0

    // 创建可读流
    const reader = response.body?.getReader()
    if (!reader) throw new Error('Failed to create reader')

    // 创建新的 Blob
    const chunks: Uint8Array[] = []

    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      chunks.push(value)
      receivedLength += value.length

      // 更新进度
      downloadProgress.value = Math.round((receivedLength / contentLength) * 100)
    }

    // 合并所有chunks并创建Blob
    const blob = new Blob(chunks)

    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = book.value.file_name || 'download.txt' // 使用服务器返回的文件名
    document.body.appendChild(a)
    a.click()

    // 清理
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

  } catch (error) {
    console.error('下载失败:', error)
    // 这里可以添加错误提示
  } finally {
    downloading.value = false
    downloadProgress.value = 0
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- 书籍详情卡片 -->
    <div v-if="book"
      class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-colors duration-300">
      <!-- 移动端封面和标题 -->
      <div class="md:hidden">
        <div class="relative w-full pb-[56.25%]">
          <img :src="book.cover || '/placeholder.jpg'" :alt="book.title"
            class="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div class="p-4">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ book.title }}</h1>
          <p class="text-gray-600 dark:text-gray-400">{{ book.author }}</p>
        </div>
      </div>

      <!-- 桌面端布局 -->
      <div class="hidden md:flex gap-8 p-6">
        <!-- 封面 -->
        <div class="w-64 flex-shrink-0">
          <img :src="book.cover || '/placeholder.jpg'" :alt="book.title"
            class="w-full rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300" />
        </div>

        <!-- 主要信息 -->
        <div class="flex-grow">
          <h1 class="text-3xl font-bold mb-3 text-gray-900 dark:text-white">{{ book.title }}</h1>
          <p class="text-lg text-gray-600 dark:text-gray-400 mb-4">作者：{{ book.author }}</p>

          <!-- 标签组 -->
          <div class="flex flex-wrap items-center gap-3 mb-6">
            <span
              class="px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light rounded-full text-sm">
              {{ book.sort }}
            </span>
            <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm">
              {{ book.tag }}
            </span>
          </div>

          <!-- 统计数据 -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div class="stat-item">
              <span class="stat-label">热度</span>
              <span class="stat-value">{{ book.hot_value }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">下载次数</span>
              <span class="stat-value">{{ book.downloads }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">文件大小</span>
              <span class="stat-value">{{ formatFileSize(book.file_size) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">上传时间</span>
              <span class="stat-value">{{ formatDate(book.created_at) }}</span>
            </div>
          </div>

          <!-- 简介 -->
          <p
            class="text-gray-700 dark:text-gray-300 mb-6 line-clamp-3 hover:line-clamp-none transition-all duration-300">
            {{ book.intro }}
          </p>

          <!-- 操作按钮 -->
          <div class="flex flex-wrap gap-4">
            <button @click="downloadBook" :disabled="downloading" class="btn-primary relative overflow-hidden">
              <!-- 下载图标 -->
              <svg class="w-5 h-5 mr-2" :class="{ 'animate-spin': downloading }" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path v-if="!downloading" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>

              <!-- 按钮文字 -->
              <span>{{ downloading ? `下载中 ${downloadProgress}%` : '下载' }}</span>

              <!-- 进度条 -->
              <div v-if="downloading" class="absolute bottom-0 left-0 h-1 bg-white/30"
                :style="{ width: `${downloadProgress}%` }"></div>
            </button>

            <button class="btn-secondary">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              收藏
            </button>
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
          <button v-for="type in ratingStore.ratingTypes" :key="type.id" @click="handleRate(type.id)"
            :disabled="ratingLoading" class="btn-rating" :class="{ 'opacity-50 cursor-not-allowed': ratingLoading }">
            {{ type.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-item {
  @apply flex flex-col p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50;
}

.stat-label {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

.stat-value {
  @apply text-lg font-semibold text-gray-900 dark:text-white;
}

.btn-primary {
  @apply flex items-center px-6 py-2.5 bg-primary hover:bg-primary-dark dark:bg-primary-light dark:hover:bg-primary text-white rounded-lg transition-colors duration-300 shadow-sm hover:shadow-md;
}

.btn-secondary {
  @apply flex items-center px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-300;
}

.btn-rating {
  @apply px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white hover:border-primary dark:hover:bg-primary-light dark:hover:border-primary-light transition-all duration-300;
}

/* 添加下载按钮的特殊样式 */
.btn-primary:disabled {
  @apply opacity-80 cursor-wait;
}

/* 进度条动画 */
.btn-primary div {
  @apply transition-all duration-300 ease-out;
}
</style>
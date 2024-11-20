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
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- 书籍详情 -->
    <div v-if="book" class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex gap-6">
        <!-- 封面 -->
        <div class="w-48 flex-shrink-0">
          <img :src="book.cover || '/placeholder.jpg'" 
               :alt="book.title"
               class="w-full rounded-lg shadow-sm" />
        </div>
        
        <!-- 信息 -->
        <div class="flex-grow">
          <h1 class="text-2xl font-bold mb-2">{{ book.title }}</h1>
          <p class="text-gray-600 mb-4">作者：{{ book.author }}</p>
          <div class="flex items-center gap-2 mb-4">
            <span class="px-2 py-1 bg-primary/10 text-primary rounded">{{ book.sort }}</span>
            <span class="px-2 py-1 bg-gray-100 text-gray-600 rounded">{{ book.tag }}</span>
          </div>
          <p class="text-gray-700 mb-4">{{ book.intro }}</p>
          <a :href="book.file_url" 
             target="_blank"
             class="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">
            下载
          </a>
        </div>
      </div>
    </div>

    <!-- 评分统计 -->
    <div v-if="ratingStore.currentBookStats" class="mt-8 bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-bold mb-4">评分统计</h2>
      <div class="space-y-4">
        <div v-for="type in ratingStore.currentBookStats.rating_types" 
             :key="type.id"
             class="flex items-center gap-4">
          <span class="w-20">{{ type.name }}</span>
          <div class="flex-grow bg-gray-200 rounded-full h-2">
            <div class="bg-primary h-full rounded-full"
                 :style="{ width: `${type.percentage}%` }"></div>
          </div>
          <span class="text-sm text-gray-600">{{ type.count }}人 ({{ type.percentage }}%)</span>
        </div>
      </div>
    </div>

    <!-- 评分表单 -->
    <div class="mt-8 bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-bold mb-4">评价本书</h2>
      <div class="space-y-4">
        <textarea
          v-model="commentText"
          rows="3"
          class="w-full border rounded-lg p-2"
          placeholder="写下你的评价..."
        ></textarea>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="type in ratingStore.ratingTypes"
            :key="type.id"
            @click="handleRate(type.id)"
            :disabled="ratingLoading"
            class="px-4 py-2 border rounded hover:bg-primary hover:text-white hover:border-primary"
          >
            {{ type.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ChevronRightIcon, BookOpenIcon, FireIcon } from '@heroicons/vue/24/outline'
import { useBookStore } from '../stores/books'
import { storeToRefs } from 'pinia'
import type { Book } from '../types/book'

const bookStore = useBookStore()
const { latestBooks, popularBooks, categories, loading } = storeToRefs(bookStore)

// 搜索相关
const searchKeyword = ref('')
const searchResults = ref<Book[]>([])
const isSearching = ref(false)

// 处理搜索
const handleSearch = async () => {
    if (!searchKeyword.value.trim()) return
    isSearching.value = true
    searchResults.value = await bookStore.searchBooks(searchKeyword.value)
    isSearching.value = false
}

// 获取数据
onMounted(async () => {
    await Promise.all([
        bookStore.fetchLatestBooks(),
        bookStore.fetchPopularBooks()
    ])
})
</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <!-- 顶部搜索栏 -->
        <header class="sticky top-0 z-50 bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div class="flex items-center justify-between">
                    <h1 class="text-2xl font-bold text-primary">Novel Site</h1>
                    <div class="relative flex-1 max-w-lg mx-4">
                        <input type="text" v-model="searchKeyword" @keyup.enter="handleSearch"
                            class="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="搜索书籍、作者..." />
                        <button @click="handleSearch" class="absolute right-3 top-2.5 text-gray-400 hover:text-primary">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- 主要内容区 -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- 分类导航 -->
            <section class="mb-8 animate-fade-in">
                <div class="grid grid-cols-3 sm:grid-cols-6 gap-4">
                    <button v-for="category in categories" :key="category.name"
                        class="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                        <span class="text-2xl mb-2">{{ category.icon }}</span>
                        <span class="text-sm text-gray-700">{{ category.name }}</span>
                    </button>
                </div>
            </section>

            <!-- 最新上传 -->
            <section class="mb-8 animate-slide-in">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-semibold flex items-center">
                        <BookOpenIcon class="w-6 h-6 mr-2 text-primary" />
                        最新上传
                    </h2>
                    <button class="text-primary flex items-center hover:text-primary-dark">
                        查看更多
                        <ChevronRightIcon class="w-4 h-4 ml-1" />
                    </button>
                </div>
                <!-- 书籍列表 -->
                <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                    <template v-if="!loading && latestBooks.length">
                        <div v-for="book in latestBooks" :key="book.id"
                            class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                            <div class="aspect-w-2 aspect-h-3">
                                <img :src="book.cover || '/placeholder.jpg'" :alt="book.title"
                                    class="object-cover w-full h-full" />
                            </div>
                            <div class="p-3">
                                <h3 class="font-medium text-sm mb-1 truncate">{{ book.title }}</h3>
                                <p class="text-xs text-gray-500 truncate">{{ book.author }}</p>
                            </div>
                        </div>
                    </template>
                    <!-- 加载占位符 -->
                    <div v-else v-for="i in 6" :key="i" class="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div class="aspect-w-2 aspect-h-3 bg-gray-200 animate-pulse"></div>
                        <div class="p-3">
                            <div class="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div class="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 热门推荐 -->
            <section class="animate-slide-in" style="animation-delay: 200ms;">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-semibold flex items-center">
                        <FireIcon class="w-6 h-6 mr-2 text-primary" />
                        热门推荐
                    </h2>
                    <button class="text-primary flex items-center hover:text-primary-dark">
                        查看更多
                        <ChevronRightIcon class="w-4 h-4 ml-1" />
                    </button>
                </div>
                <!-- 书籍列表 -->
                <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                    <template v-if="!loading && popularBooks.length">
                        <div v-for="book in popularBooks" :key="book.id"
                            class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                            <div class="aspect-w-2 aspect-h-3">
                                <img :src="book.cover || '/placeholder.jpg'" :alt="book.title"
                                    class="object-cover w-full h-full" />
                            </div>
                            <div class="p-3">
                                <h3 class="font-medium text-sm mb-1 truncate">{{ book.title }}</h3>
                                <p class="text-xs text-gray-500 truncate">{{ book.author }}</p>
                            </div>
                        </div>
                    </template>
                    <!-- 加载占位符 -->
                    <div v-else v-for="i in 6" :key="i" class="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div class="aspect-w-2 aspect-h-3 bg-gray-200 animate-pulse"></div>
                        <div class="p-3">
                            <div class="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div class="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<style scoped>
.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: .5;
    }
}
</style>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBookStore } from '@/stores/books'
import BookList from '@/components/home/BookList.vue'
import Pagination from '@/components/common/Pagination.vue'
import type { Book } from '@/types'
import { useToast } from 'vue-toastification'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'

interface Props {
    title: string
    icon: 'book' | 'fire'
    type: 'latest' | 'hotest'
}

const toast = useToast()
const props = defineProps<Props>()
const bookStore = useBookStore()
const books = ref<Book[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 10

// 加载数据
const loadBooks = async (page: number) => {
    loading.value = true
    error.value = null
    try {
        const data = props.type === 'latest'
            ? await bookStore.getLatestBooks(page, pageSize)
            : await bookStore.getPopularBooks(page, pageSize)
        books.value = data.items
        totalPages.value = Math.ceil(data.total / pageSize)
    } catch (err) {
        error.value = '加载数据失败，请重试'
        toast.error(error.value)
    } finally {
        loading.value = false
    }
}

// 重试加载
const handleRetry = () => {
    loadBooks(currentPage.value)
}

// 切换页面
const handlePageChange = (page: number) => {
    currentPage.value = page
    loadBooks(page)
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
    loadBooks(currentPage.value)
})
</script>

<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{{ title }}</h1>

        <!-- 错误状态 -->
        <div v-if="error"
            class="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
            <button @click="handleRetry"
                class="flex items-center px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors duration-300">
                <ArrowPathIcon class="w-5 h-5 mr-2" :class="{ 'animate-spin': loading }" />
                重试
            </button>
        </div>

        <!-- 内容区域 -->
        <div v-else>
            <div class="grid gap-6">
                <BookList :books="books" :loading="loading" :show-category="true" :title="title" :icon="icon"
                    more-link="" />
            </div>

            <!-- 分页控件 -->
            <div class="mt-8" v-if="totalPages > 1">
                <Pagination :current-page="currentPage" :total-pages="totalPages" @change="handlePageChange" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useBookStore } from '@/stores/books'
import BookList from '@/components/home/BookList.vue'
import type { Book } from '@/types'
import { useToast } from 'vue-toastification'

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
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 10

// 添加分页相关的计算属性和方法
const pageRange = 5 // 显示的页码数量

// 计算要显示的页码范围
const displayedPages = computed(() => {
    const start = Math.max(1, currentPage.value - Math.floor(pageRange / 2))
    const end = Math.min(totalPages.value, start + pageRange - 1)

    // 生成页码数组
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// 跳转到首页
const goToFirstPage = () => {
    if (currentPage.value !== 1) {
        handlePageChange(1)
    }
}

// 跳转到末页
const goToLastPage = () => {
    if (currentPage.value !== totalPages.value) {
        handlePageChange(totalPages.value)
    }
}

// 上一页
const goToPrevPage = () => {
    if (currentPage.value > 1) {
        handlePageChange(currentPage.value - 1)
    }
}

// 下一页
const goToNextPage = () => {
    if (currentPage.value < totalPages.value) {
        handlePageChange(currentPage.value + 1)
    }
}

// 加载数据
const loadBooks = async (page: number) => {
    loading.value = true
    try {
        const data = props.type === 'latest'
            ? await bookStore.getLatestBooks(page, pageSize)
            : await bookStore.getPopularBooks(page, pageSize)
        books.value = data.items
        totalPages.value = Math.ceil(data.total / pageSize)
    } catch (error) {
        toast.error(`获取${props.title}书籍失败，请稍后重试`)
    } finally {
        loading.value = false
    }
}

// 切换页面
const handlePageChange = async (page: number) => {
    try {
        loading.value = true
        const data = await (props.type === 'latest'
            ? bookStore.getLatestBooks(page, pageSize)
            : bookStore.getPopularBooks(page, pageSize))

        books.value = data.items
        totalPages.value = Math.ceil(data.total / pageSize)
        currentPage.value = page

        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
        toast.error(`加载${props.title}书籍失败，请稍后重试`)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    loadBooks(currentPage.value)
})
</script>

<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{{ title }}</h1>

        <div class="grid gap-6">
            <BookList :books="books" :loading="loading" :show-category="true" :title="title" :icon="icon"
                more-link="" />
        </div>

        <!-- 优化后的分页控件 -->
        <div class="flex justify-center mt-8" v-if="totalPages > 1">
            <nav class="flex items-center gap-1">
                <!-- 首页 -->
                <button @click="goToFirstPage" :disabled="currentPage === 1" :class="[
                    'px-3 py-2 rounded-lg transition-colors duration-300',
                    currentPage === 1
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                ]">
                    首页
                </button>

                <!-- 上一页 -->
                <button @click="goToPrevPage" :disabled="currentPage === 1" :class="[
                    'px-3 py-2 rounded-lg transition-colors duration-300',
                    currentPage === 1
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                ]">
                    上一页
                </button>

                <!-- 页码 -->
                <button v-for="page in displayedPages" :key="page" @click="handlePageChange(page)" :class="[
                    'px-4 py-2 rounded-lg transition-colors duration-300',
                    currentPage === page
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                ]">
                    {{ page }}
                </button>

                <!-- 下一页 -->
                <button @click="goToNextPage" :disabled="currentPage === totalPages" :class="[
                    'px-3 py-2 rounded-lg transition-colors duration-300',
                    currentPage === totalPages
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                ]">
                    下一页
                </button>

                <!-- 末页 -->
                <button @click="goToLastPage" :disabled="currentPage === totalPages" :class="[
                    'px-3 py-2 rounded-lg transition-colors duration-300',
                    currentPage === totalPages
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                ]">
                    末页
                </button>
            </nav>
        </div>
    </div>
</template>
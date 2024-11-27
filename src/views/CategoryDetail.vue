<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBookStore } from '@/stores/books'
import BookList from '@/components/home/BookList.vue'
import Pagination from '@/components/common/Pagination.vue'
import type { Book } from '@/types'
import { useToast } from 'vue-toastification'

const route = useRoute()
const bookStore = useBookStore()
const toast = useToast()

const categoryName = route.params.name as string
const books = ref<Book[]>([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 12

// 加载数据
const loadBooks = async (page: number) => {
    loading.value = true
    try {
        console.log('Loading books for page:', page)
        const data = await bookStore.getBooksByCategory(categoryName, page, pageSize)
        books.value = data.items
        totalPages.value = Math.ceil(data.total / pageSize)
        console.log('Loaded books:', {
            page,
            totalPages: totalPages.value,
            itemsCount: books.value.length
        })
    } catch (error) {
        toast.error('获取分类书籍失败，请稍后重试')
    } finally {
        loading.value = false
    }
}

// 处理页码变化
const handlePageChange = async (page: number) => {
    console.log('Page changed to:', page)
    currentPage.value = page
    await loadBooks(page)
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
    loadBooks(currentPage.value)
})
</script>

<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center gap-4 mb-8">
            <router-link to="/categories" class="text-gray-500 hover:text-primary dark:text-gray-400 
                       dark:hover:text-primary-light transition-colors">
                全部分类
            </router-link>
            <span class="text-gray-400">/</span>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ categoryName }}
            </h1>
        </div>

        <div class="grid gap-6">
            <BookList :books="books" :loading="loading" :show-category="false" :title="`${categoryName}分类`"
                :more-link="null" icon="book" :show-more="false" />
        </div>

        <!-- 分页控件 -->
        <div class="mt-8" v-if="totalPages > 1">
            <Pagination :current-page="currentPage" :total-pages="totalPages" @change="handlePageChange" />
        </div>
    </div>
</template>
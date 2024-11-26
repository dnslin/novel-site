<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBookStore } from '@/stores/books'
import BookList from '@/components/home/BookList.vue'
import type { Book } from '@/types'
import { useToast } from 'vue-toastification'

const route = useRoute()
const bookStore = useBookStore()
const categoryName = route.params.name as string
const books = ref<Book[]>([])
const loading = ref(true)
const toast = useToast()

onMounted(async () => {
    loading.value = true
    try {
        console.log("categoryName", categoryName);
        const data = await bookStore.getBooksByCategory(categoryName)
        books.value = data.items
    } catch (error) {
        toast.error('获取分类书籍失败，请稍后重试')
    } finally {
        loading.value = false
    }
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
            <BookList :books="books" :loading="loading" :show-category="false" title="分类书籍" icon="book" more-link="" />
        </div>
    </div>
</template>
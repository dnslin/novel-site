<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBookStore } from '@/stores/books'
import { storeToRefs } from 'pinia'
import type { Book } from '@/types'
import { useDebounceFn } from '@vueuse/core'
import { useToast } from 'vue-toastification'

const toast = useToast()
const router = useRouter()
const bookStore = useBookStore()
const { searchSuggestions } = storeToRefs(bookStore)

const searchKeyword = ref('')
const showSuggestions = ref(false)

// 使用防抖函数
const debouncedSearch = useDebounceFn(async (keyword: string) => {
    if (keyword.trim()) {
        try {
            await bookStore.fetchSearchSuggestions(keyword)
        } catch (error) {
            toast.error('搜索失败，请稍后重试')
        }
    }
}, 300)

// 处理建议项点击
const handleSuggestionClick = (book: Book) => {
    router.push(`/books/${book.id}`)
    showSuggestions.value = false
    searchKeyword.value = ''
}

// 处理搜索框失焦
const handleSearchBlur = () => {
    // 使用 requestAnimationFrame 确保在下一帧处理
    requestAnimationFrame(() => {
        setTimeout(() => {
            showSuggestions.value = false
        }, 200)
    })
}

// 监听搜索关键词变化
watch(searchKeyword, (newValue) => {
    if (newValue.trim()) {
        debouncedSearch(newValue)
        showSuggestions.value = true
    } else {
        showSuggestions.value = false
    }
})
</script>
<template>
    <div class="max-w-2xl mx-auto relative">
        <div class="relative">
            <input type="text" v-model="searchKeyword" @focus="showSuggestions = true" @blur="handleSearchBlur" class="w-full pl-6 pr-12 py-4 rounded-full 
                 transition-colors duration-300
                 border focus:outline-none focus:ring-2
                 dark:placeholder:text-gray-400
                 dark:text-white text-gray-700
                 bg-white/20 dark:bg-gray-900/20
                 backdrop-blur-sm
                 border-gray-300 dark:border-gray-600/30
                 focus:ring-primary/50 dark:focus:ring-primary-light/50" placeholder="搜索你感兴趣的书籍、作者..." />

            <!-- 搜索建议下拉框 -->
            <div v-show="showSuggestions && searchSuggestions.length > 0" class="absolute left-0 right-0 mt-2 py-2 
                    bg-white dark:bg-gray-800 
                    rounded-lg shadow-lg border border-gray-200 
                    dark:border-gray-700 z-[70] min-w-full">
                <!-- 搜索建议列表 -->
                <div v-for="book in searchSuggestions" :key="book.id" @mousedown="handleSuggestionClick(book)" class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 
                      cursor-pointer flex items-center space-x-3
                      transition-colors duration-200">
                    <img v-if="book.cover" :src="book.cover" :alt="book.title" class="w-10 h-14 object-cover rounded" />
                    <div class="flex-1">
                        <div class="text-gray-900 dark:text-white font-medium">
                            {{ book.title }}
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                            {{ book.author }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- 搜索按钮 -->
            <button @click="handleSearchBlur" class="absolute right-4 top-1/2 -translate-y-1/2 
                       text-white/60 hover:text-white 
                       transition-colors duration-300">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
        </div>
    </div>
</template>
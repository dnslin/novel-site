<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBookStore } from '@/stores/books'
import { storeToRefs } from 'pinia'
import type { Book } from '@/types'
import { useDebounceFn } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import { XMarkIcon, MagnifyingGlassIcon, ClockIcon } from '@heroicons/vue/24/outline'

const toast = useToast()
const router = useRouter()
const bookStore = useBookStore()
const { searchSuggestions } = storeToRefs(bookStore)

const searchKeyword = ref('')
const showSuggestions = ref(false)
const loading = ref(false)
const selectedIndex = ref(-1)
const searchHistory = ref<string[]>([])

// 从 localStorage 加载搜索历史
onMounted(() => {
    const history = localStorage.getItem('searchHistory')
    if (history) {
        searchHistory.value = JSON.parse(history)
    }
})

// 保存搜索历史
const saveSearchHistory = (keyword: string) => {
    if (!keyword.trim()) return
    const history = new Set([keyword, ...searchHistory.value])
    searchHistory.value = Array.from(history).slice(0, 10) // 只保留最近10条
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
}

// 清除搜索历史
const clearHistory = () => {
    searchHistory.value = []
    localStorage.removeItem('searchHistory')
    bookStore.clearSearchSuggestions()
}

// 删除单条历史记录
const removeHistoryItem = (index: number) => {
    searchHistory.value.splice(index, 1)
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
}

// 使用防抖函数
const debouncedSearch = useDebounceFn(async (keyword: string) => {
    if (keyword.trim()) {
        loading.value = true
        try {
            await bookStore.fetchSearchSuggestions(keyword)
        } catch (error) {
            toast.error('搜索失败，请稍后重试')
        } finally {
            loading.value = false
        }
    }
}, 300)

// 处理建议项点击
const handleSuggestionClick = (book: Book) => {
    saveSearchHistory(searchKeyword.value)
    router.push(`/books/${book.id}`)
    showSuggestions.value = false
    searchKeyword.value = ''
    selectedIndex.value = -1
}

// 清空搜索框
const clearSearch = () => {
    searchKeyword.value = ''
    showSuggestions.value = false
    selectedIndex.value = -1
    bookStore.clearSearchSuggestions()
}

// 处理搜索框失焦
const handleSearchBlur = () => {
    requestAnimationFrame(() => {
        setTimeout(() => {
            showSuggestions.value = false
            selectedIndex.value = -1
        }, 200)
    })
}

// 处理键盘导航
const handleKeydown = (e: KeyboardEvent) => {
    const suggestions = searchSuggestions.value
    const historyLength = searchHistory.value.length
    const totalItems = suggestions.length + historyLength

    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault()
            selectedIndex.value = (selectedIndex.value + 1) % totalItems
            break
        case 'ArrowUp':
            e.preventDefault()
            selectedIndex.value = selectedIndex.value <= 0 ? totalItems - 1 : selectedIndex.value - 1
            break
        case 'Enter':
            e.preventDefault()
            if (selectedIndex.value >= 0) {
                if (selectedIndex.value < historyLength) {
                    // 选中历史记录
                    searchKeyword.value = searchHistory.value[selectedIndex.value]
                } else {
                    // 选中建议项
                    const suggestion = suggestions[selectedIndex.value - historyLength]
                    handleSuggestionClick(suggestion)
                }
            }
            break
        case 'Escape':
            e.preventDefault()
            showSuggestions.value = false
            selectedIndex.value = -1
            break
    }
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

// 添加和移除键盘事件监听
onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
    <div class="max-w-2xl mx-auto relative">
        <div class="relative">
            <!-- 搜索输入框 -->
            <input type="text" v-model="searchKeyword" @focus="showSuggestions = true" @blur="handleSearchBlur" class="w-full pl-12 pr-12 py-4 rounded-full 
               transition-colors duration-300
               border focus:outline-none focus:ring-2
               dark:placeholder:text-gray-400
               dark:text-white text-gray-700
               bg-white/20 dark:bg-gray-900/20
               backdrop-blur-sm
               border-gray-300 dark:border-gray-600/30
               focus:ring-primary/50 dark:focus:ring-primary-light/50" placeholder="搜索你感兴趣的书籍、作者..." />

            <!-- 搜索图标 -->
            <MagnifyingGlassIcon class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 
               text-gray-400 dark:text-gray-500" />

            <!-- 加载动画 -->
            <div v-if="loading" class="absolute right-14 top-1/2 -translate-y-1/2">
                <div class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>

            <!-- 清空按钮 -->
            <button v-if="searchKeyword" @click="clearSearch" class="absolute right-4 top-1/2 -translate-y-1/2 
               text-gray-400 hover:text-gray-600 
               dark:text-gray-500 dark:hover:text-gray-300
               transition-colors duration-300">
                <XMarkIcon class="w-5 h-5" />
            </button>
        </div>

        <!-- 搜索建议和历史记录下拉框 -->
        <div v-show="showSuggestions && (searchSuggestions.length > 0 || searchHistory.length > 0)" class="absolute left-0 right-0 mt-2 
             bg-white dark:bg-gray-800 
             rounded-lg shadow-lg border border-gray-200 
             dark:border-gray-700 z-[70] max-h-96 overflow-y-auto">

            <!-- 搜索历史 -->
            <div v-if="searchHistory.length > 0 && !searchKeyword">
                <div class="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <span class="text-sm text-gray-500 dark:text-gray-400">搜索历史</span>
                    <button @click="clearHistory"
                        class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        清空历史
                    </button>
                </div>
                <div v-for="(item, index) in searchHistory" :key="'history-' + index" @mousedown="searchKeyword = item"
                    class="group px-4 py-2 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    :class="{ 'bg-gray-100 dark:bg-gray-700': selectedIndex === index }">
                    <div class="flex items-center space-x-2">
                        <ClockIcon class="w-4 h-4 text-gray-400" />
                        <span class="text-gray-700 dark:text-gray-300">{{ item }}</span>
                    </div>
                    <button @mousedown.stop="removeHistoryItem(index)"
                        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100">
                        <XMarkIcon class="w-4 h-4" />
                    </button>
                </div>
            </div>

            <!-- 搜索建议 -->
            <div v-if="searchSuggestions.length > 0">
                <div v-for="(book, index) in searchSuggestions" :key="book.id" @mousedown="handleSuggestionClick(book)"
                    class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    :class="{ 'bg-gray-100 dark:bg-gray-700': selectedIndex === index + searchHistory.length }">
                    <div class="flex items-center space-x-3">
                        <img v-if="book.cover" :src="book.cover" :alt="book.title"
                            class="w-10 h-14 object-cover rounded" />
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
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 自定义滚动条样式 */
.overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 3px;
}
</style>
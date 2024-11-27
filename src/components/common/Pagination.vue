<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    currentPage: number
    totalPages: number
    pageRange?: number
}

interface Emits {
    (e: 'change', page: number): void
}

const props = withDefaults(defineProps<Props>(), {
    pageRange: 5
})

const emit = defineEmits<Emits>()

// 计算要显示的页码范围
const displayedPages = computed(() => {
    const start = Math.max(1, props.currentPage - Math.floor(props.pageRange / 2))
    const end = Math.min(props.totalPages, start + props.pageRange - 1)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// 页面跳转方法
const handlePageChange = (page: number) => {
    if (page !== props.currentPage) {
        emit('change', page)
    }
}

const goToFirstPage = () => {
    if (props.currentPage !== 1) {
        emit('change', 1)
    }
}

const goToLastPage = () => {
    if (props.currentPage !== props.totalPages) {
        emit('change', props.totalPages)
    }
}

const goToPrevPage = () => {
    if (props.currentPage > 1) {
        emit('change', props.currentPage - 1)
    }
}

const goToNextPage = () => {
    if (props.currentPage < props.totalPages) {
        emit('change', props.currentPage + 1)
    }
}
</script>

<template>
    <nav class="flex items-center justify-center gap-1" aria-label="Pagination">
        <!-- 首页按钮 -->
        <button @click="goToFirstPage" :disabled="currentPage === 1"
            class="relative px-3 py-2 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
            :class="[
                currentPage === 1
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]">
            <span class="sr-only">首页</span>
            <span class="text-sm">首页</span>
        </button>

        <!-- 上一页按钮 -->
        <button @click="goToPrevPage" :disabled="currentPage === 1"
            class="relative px-3 py-2 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
            :class="[
                currentPage === 1
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]">
            <span class="sr-only">上一页</span>
            <span class="text-sm">上一页</span>
        </button>

        <!-- 页码按钮 -->
        <button v-for="page in displayedPages" :key="page" @click="handlePageChange(page)"
            class="relative px-4 py-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
            :class="[
                currentPage === page
                    ? 'bg-primary text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]">
            <span>{{ page }}</span>
        </button>

        <!-- 下一页按钮 -->
        <button @click="goToNextPage" :disabled="currentPage === totalPages"
            class="relative px-3 py-2 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
            :class="[
                currentPage === totalPages
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]">
            <span class="sr-only">下一页</span>
            <span class="text-sm">下一页</span>
        </button>

        <!-- 末页按钮 -->
        <button @click="goToLastPage" :disabled="currentPage === totalPages"
            class="relative px-3 py-2 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
            :class="[
                currentPage === totalPages
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]">
            <span class="sr-only">末页</span>
            <span class="text-sm">末页</span>
        </button>
    </nav>
</template>
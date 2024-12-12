<script setup lang="ts">
import { BookOpenIcon, FireIcon, ChevronRightIcon, EyeIcon, ClockIcon } from '@heroicons/vue/24/outline'
import type { Book } from '@/types'
import HeicImage from '@/components/common/HeicImage.vue'
import { getRandomTagColor } from '@/utils/colors'

// 截断文本函数
const truncateText = (text: string) => {
    if (!text) return ''
    // 获取当前视窗宽度
    const width = window.innerWidth
    // 移动端 (<640px) 显示40个字符，其他情况显示60个字符
    const maxLength = width < 640 ? 15 : 60
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

// 格式化日期
const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    // 如果是今天，显示具体时间
    if (diff < 24 * 60 * 60 * 1000) {
        return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
    // 如果是最近7天，显示几天前
    if (diff < 7 * 24 * 60 * 60 * 1000) {
        const days = Math.floor(diff / (24 * 60 * 60 * 1000))
        return `${days}天前`
    }
    // 否则显示具体日期
    return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
}


defineProps<{
    books: Book[]
    loading?: boolean
    showCategory?: boolean
    title: string
    icon: 'book' | 'fire'
    moreLink?: string | null  // 修改类型，允许为 null
    showMore?: boolean  // 添加新属性控制更多按钮的显示
}>()
</script>

<template>
    <section
        class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-all duration-300">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <BookOpenIcon v-if="icon === 'book'" class="w-7 h-7 mr-2" />
                <FireIcon v-else class="w-7 h-7 mr-2" />
                {{ title }}
            </h2>
            <router-link v-if="showMore && moreLink" :to="moreLink"
                class="text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary-light/80 transition-colors flex items-center">
                更多
                <ChevronRightIcon class="w-4 h-4 ml-1" />
            </router-link>
        </div>

        <div class="space-y-4">
            <template v-if="!loading && books.length">
                <router-link v-for="book in books" :key="book.id" :to="`/books/${book.id}`" class="flex bg-gray-50 dark:bg-gray-700/50 rounded overflow-hidden hover:shadow-lg 
                            transition-all duration-300 group">
                    <!-- 封面图片容器 -->
                    <div class="relative w-20 sm:w-24 h-28 sm:h-32 flex-shrink-0 overflow-hidden 
                              bg-gray-200 dark:bg-gray-600">
                        <!-- 骨架屏 -->
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                                   animate-shimmer" style="background-size: 200% 100%;"></div>

                        <!-- 默认占位图标 -->
                        <div v-if="!book.coverUrl"
                            class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                            <BookOpenIcon class="w-8 h-8 sm:w-12 sm:h-12" />
                        </div>

                        <!-- 图片 -->
                        <HeicImage v-if="book.coverUrl" :src="book.coverUrl" :alt="book.bookName"
                            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            placeholder="/placeholder.jpg" />
                    </div>

                    <!-- 书籍信息 -->
                    <div class="flex-1 p-2.5 sm:p-3 flex flex-col min-h-[7rem] sm:min-h-[8rem]">
                        <h3 class="font-medium mb-1.5 sm:mb-2 group-hover:text-primary dark:text-white 
                                  transition-colors line-clamp-1 text-base sm:text-lg">
                            {{ book.bookName }}
                        </h3>

                        <!-- 作者和基本信息 -->
                        <div class="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs sm:text-sm 
                                  text-gray-500 dark:text-gray-400 mb-1 sm:mb-1.5">
                            <span>{{ book.author }}</span>
                            <template v-if="book.wordCount">
                                <span class="text-gray-300 dark:text-gray-600">|</span>
                                <span>{{ book.wordCount }}</span>
                            </template>
                            <template v-if="book.Source">
                                <span class="text-gray-300 dark:text-gray-600">|</span>
                                <span>{{ book.Source }}</span>
                            </template>
                            <template v-if="book.rankCount">
                                <span class="text-gray-300 dark:text-gray-600">|</span>
                                <span>{{ book.rankCount }}</span>
                            </template>
                            <template v-if="book.rankType">
                                <span class="text-gray-300 dark:text-gray-600">|</span>
                                <span>{{ book.rankType }}</span>
                            </template>
                        </div>

                        <!-- 分类信息 -->
                        <div class="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs sm:text-sm 
                                  text-gray-500 dark:text-gray-400 mb-1 sm:mb-1.5">
                            <span v-if="book.category">{{ book.category.name }}</span>
                            <span v-if="book.category && book.subCategory"
                                class="text-gray-300 dark:text-gray-600">/</span>
                            <span v-if="book.subCategory">{{ book.subCategory.name }}</span>
                            <template v-if="book.bookStatus">
                                <span class="text-gray-300 dark:text-gray-600">|</span>
                                <span>{{ book.bookStatus }}</span>
                            </template>
                        </div>

                        <!-- 描述信息 -->
                        <p v-if="book.description"
                            class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-1.5 leading-normal">
                            {{ truncateText(book.description) }}
                        </p>

                        <!-- 标签和统计信息 -->
                        <div class="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 mt-auto">
                            <!-- 标签 -->
                            <div class="flex items-center gap-1.5 text-[10px] sm:text-xs flex-wrap">
                                <template v-if="book.tags && book.tags.length">
                                    <span v-for="tag in book.tags.slice(0, 3)" :key="tag.id" :class="[
                                        'px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full transition-colors duration-300',
                                        getRandomTagColor(tag.name)
                                    ]">
                                        {{ tag.name }}
                                    </span>
                                </template>
                            </div>

                            <!-- 统计信息 -->
                            <div class="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs 
                                      text-gray-500 dark:text-gray-400">
                                <div class="flex items-center gap-1" v-if="book.hotValue">
                                    <FireIcon class="w-3 h-3 text-orange-500" />
                                    <span>{{ book.hotValue }}</span>
                                </div>
                                <div class="flex items-center gap-1" v-if="book.readCount">
                                    <EyeIcon class="w-3 h-3 text-blue-500" />
                                    <span>{{ book.readCount }}</span>
                                </div>
                                <div class="flex items-center gap-1" v-if="book.lastPublishTime">
                                    <ClockIcon class="w-3 h-3 text-green-500" />
                                    <span>{{ formatDate(book.lastPublishTime) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </router-link>
            </template>

            <!-- 加载占位符 -->
            <template v-else>
                <div v-for="i in 3" :key="i"
                    class="flex bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden animate-pulse">
                    <!-- 封面占位符 -->
                    <div class="w-24 h-32 bg-gray-200 dark:bg-gray-600"></div>
                    <!-- 内容占位符 -->
                    <div class="flex-1 p-4">
                        <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                        <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
                        <div class="flex gap-2">
                            <div class="h-5 w-16 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                            <div class="h-5 w-16 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </section>
</template>

<style scoped>
@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }

    100% {
        background-position: 200% 0;
    }
}

.animate-shimmer {
    animation: shimmer 1s infinite linear;
}

.animate-fade-in {
    animation: fadeIn 0.2s ease-in-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 2;
    }
}

/* 文本截断 */
.line-clamp-1 {
    display: -webkit-box;
    display: flex;
    -webkit-line-clamp: 1;
    -moz-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    -moz-box-orient: vertical;
    box-orient: vertical;
    overflow: hidden;
}

/* 添加两行文本截断 */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
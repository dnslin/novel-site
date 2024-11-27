<script setup lang="ts">
import { BookOpenIcon, FireIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import type { Book } from '@/types'
import LazyImage from '@/components/common/LazyImage.vue'

// 确保 BookList 组件不会覆盖父组件的分页逻辑
const props = defineProps<{
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
                <router-link v-for="book in books" :key="book.id" :to="`/books/${book.id}`" class="flex bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden hover:shadow-lg 
                            transition-all duration-300 group">
                    <!-- 封面图片容器 -->
                    <div class="relative w-24 h-32 flex-shrink-0 overflow-hidden bg-gray-200 dark:bg-gray-600">
                        <!-- 骨架屏 -->
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                                   animate-shimmer" style="background-size: 200% 100%;"></div>

                        <!-- 默认占位图标 -->
                        <div v-if="!book.cover"
                            class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                            <BookOpenIcon class="w-12 h-12" />
                        </div>

                        <!-- 图片 -->
                        <img :src="book.cover || '/placeholder.jpg'" :alt="book.title" loading="lazy"
                            class="w-24 h-32 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105" />
                    </div>

                    <!-- 书籍信息 -->
                    <div class="flex-1 p-4">
                        <h3 class="font-medium mb-2 group-hover:text-primary dark:text-white 
                                  transition-colors line-clamp-1">
                            {{ book.title }}
                        </h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ book.author }}</p>
                        <div class="mt-2 flex items-center gap-2 text-xs">
                            <span class="px-2 py-1 rounded-full bg-primary/10 text-primary 
                                       dark:bg-primary/20 dark:text-primary-light">
                                {{ book.sort }}
                            </span>
                            <span class="px-2 py-1 rounded-full bg-gray-100 text-gray-600 
                                       dark:bg-gray-600 dark:text-gray-300">
                                {{ book.tag }}
                            </span>
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
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
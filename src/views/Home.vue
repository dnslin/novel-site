<script setup lang="ts">
import { ref, onMounted, computed, type Ref } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { ChevronRightIcon, BookOpenIcon, FireIcon, MoonIcon, SunIcon } from '@heroicons/vue/24/outline'
import { useBookStore } from '@/stores/books'
import { storeToRefs } from 'pinia'
import type { Book } from '@/types'
const { theme, toggleTheme } = useTheme()
const bookStore = useBookStore()
const { latestBooks, popularBooks, categories, loading } = storeToRefs(bookStore)


// 搜索相关
const searchKeyword = ref('')
const searchResults = ref<Book[]>([])
const isSearching = ref(false)

const isDark = computed(() => theme.value === 'dark')

// 处理搜索
const handleSearch = async () => {
    if (!searchKeyword.value.trim()) return
    isSearching.value = true
    searchResults.value = await bookStore.searchBooks(searchKeyword.value)
    isSearching.value = false
}

// 修改打字机效果相关的变量
const mainTitle = "探索无尽的阅读世界"
const subTitle = "发现、分享、畅读你喜爱的小说"
const displayedMainTitle = ref('')
const displayedSubTitle = ref('')
const showSubTitle = ref(false) // 控制副标题的显示

// 打字机效果函数
const typeWriter = (text: string, displayRef: Ref<string>, speed: number = 100): Promise<void> => {
    return new Promise((resolve) => {
        let i = 0
        const timer = setInterval(() => {
            if (i < text.length) {
                displayRef.value += text.charAt(i)
                i++
            } else {
                clearInterval(timer)
                resolve()
            }
        }, speed)
    })
}

// 修改 onMounted 中的打字机效果顺序
onMounted(async () => {
    await Promise.all([
        bookStore.fetchLatestBooks(),
        bookStore.fetchPopularBooks(),
        bookStore.fetchCategories(),
    ])

    // 先显示主标题
    await typeWriter(mainTitle, displayedMainTitle, 150)

    // 主标题完成后，显示副标题容器并开始打字
    showSubTitle.value = true
    await typeWriter(subTitle, displayedSubTitle, 100)
})
</script>

<template>
    <div
        class="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <!-- 主题切换按钮 -->
        <button @click="toggleTheme"
            class="fixed top-4 right-4 z-50 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
            <MoonIcon v-if="!isDark" class="w-6 h-6 text-gray-800" />
            <SunIcon v-else class="w-6 h-6 text-yellow-400" />
        </button>


        <!-- 顶部横幅区域 -->
        <header class="relative">
            <div class="hero-section py-24">
                <!-- 背景图层 - 使用计算属性动态切换背景图 -->
                <div class="absolute inset-0 w-full h-full transition-opacity duration-500">
                    <!-- 白天模式背景图 -->
                    <img src="@/assets/blob-scene-light.svg" alt="background"
                        class="w-full h-full object-cover transition-opacity duration-500"
                        :class="{ 'opacity-0': isDark, 'opacity-100': !isDark }" />
                    <!-- 黑夜模式背景图 -->
                    <img src="@/assets/blob-scene-black.svg" alt="background"
                        class="w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-500"
                        :class="{ 'opacity-100': isDark, 'opacity-0': !isDark }" />
                </div>

                <!-- 内容区域 -->
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <!-- 主标题 -->
                    <h1 class="text-5xl font-bold mb-6 text-white dark:text-white typewriter-container">
                        {{ displayedMainTitle }}
                    </h1>

                    <!-- 副标题 -->
                    <p v-show="showSubTitle" class="text-xl mb-8 text-white/90 dark:text-gray-200 typewriter-container"
                        :class="{ 'fade-in': showSubTitle }">
                        {{ displayedSubTitle }}
                    </p>

                    <!-- 搜索框 -->
                    <div class="max-w-2xl mx-auto relative animate-search">
                        <input type="text" v-model="searchKeyword" @keyup.enter="handleSearch" class="w-full pl-6 pr-12 py-4 rounded-full 
                                   transition-colors duration-300
                                   border
                                   focus:outline-none focus:ring-2
                                   placeholder:transition-colors
                                   dark:placeholder:text-gray-400
                                   dark:text-white text-gray-700
                                   bg-white/20 dark:bg-gray-900/20
                                   backdrop-blur-sm
                                   border-white/30 dark:border-gray-600/30
                                   focus:ring-primary/50 dark:focus:ring-primary-light/50
                                   placeholder:text-gray-600" placeholder="搜索你感兴趣的书籍、作者..." />
                        <button @click="handleSearch" class="absolute right-4 top-1/2 -translate-y-1/2 
                                   transition-colors duration-300
                                   text-gray-600 dark:text-gray-400 
                                   hover:text-primary dark:hover:text-primary-light">
                            <svg class="w-6 h-6 transition-transform duration-300 hover:scale-110" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- 主要内容区 -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
            <!-- 分类导航 -->
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12 px-2">
                <router-link v-for="category in bookStore.hotCategories" :key="category.name"
                    :to="`/category/${category.name}`" class="group relative overflow-hidden rounded-2xl 
                           bg-gradient-to-br from-white to-gray-50 
                           dark:from-gray-800/80 dark:to-gray-800/40 
                           shadow-sm hover:shadow-xl 
                           border border-gray-200/80 dark:border-gray-700/30
                           transition-all duration-500 ease-out">
                    <div class="absolute inset-0 bg-gradient-to-br 
                                from-primary/5 via-primary/2 to-primary/10 
                                dark:from-primary/10 dark:to-primary/20 
                                opacity-0 group-hover:opacity-100 
                                transition-opacity duration-500">
                    </div>

                    <div class="relative h-full flex flex-col items-center justify-center p-6 
                                group-hover:transform group-hover:scale-105 
                                transition-transform duration-500">
                        <!-- 图标容器 -->
                        <div class="relative mb-3 transform-gpu transition-all duration-500 ease-out 
                                    group-hover:scale-110">
                            <div class="absolute inset-0 bg-primary/20 
                                        dark:bg-primary/30 rounded-full 
                                        blur-lg scale-75 opacity-0 
                                        group-hover:opacity-70 
                                        transition-all duration-500">
                            </div>
                            <img :src="category.icon" :alt="category.name"
                                class="w-10 h-10 relative z-10 transition-transform duration-500 group-hover:rotate-6" />
                        </div>

                        <!-- 分类名称 -->
                        <span class="text-sm font-medium 
                                     text-gray-700 dark:text-gray-200
                                     group-hover:text-primary dark:group-hover:text-primary-light 
                                     transition-colors duration-500">
                            {{ category.name }}
                        </span>
                    </div>
                </router-link>

                <!-- "更多分类"按钮 -->
                <router-link to="/categories" class="group relative overflow-hidden rounded-2xl 
                           bg-gradient-to-br from-primary/5 to-transparent 
                           dark:from-primary/20 dark:to-primary/5
                           shadow-sm hover:shadow-xl 
                           border border-primary/30 dark:border-primary/40
                           transition-all duration-500 ease-out">
                    <div class="absolute inset-0 bg-gradient-to-br 
                                from-primary/10 via-primary/5 to-primary/15 
                                dark:from-primary/20 dark:to-primary/30 
                                opacity-0 group-hover:opacity-100 
                                transition-opacity duration-500">
                    </div>

                    <div class="relative h-full flex flex-col items-center justify-center p-6 
                                group-hover:transform group-hover:scale-105 
                                transition-transform duration-500">
                        <!-- 图标容器 -->
                        <div class="relative mb-3 transform-gpu transition-all duration-500 ease-out 
                                    group-hover:scale-110">
                            <div class="absolute inset-0 bg-primary/30 
                                        dark:bg-primary/40 rounded-full 
                                        blur-lg scale-75 opacity-0 
                                        group-hover:opacity-70 
                                        transition-all duration-500">
                            </div>
                            <img src="@/assets/svg/更多.svg" alt="更多分类"
                                class="w-10 h-10 relative z-10 transition-transform duration-500 group-hover:rotate-12" />
                        </div>

                        <!-- "更多分类"文字 -->
                        <span class="text-sm font-medium text-primary-dark 
                                     dark:text-primary-light
                                     group-hover:text-primary-darker 
                                     dark:group-hover:text-primary-lighter 
                                     transition-colors duration-500">
                            更多分类
                        </span>
                    </div>
                </router-link>
            </div>

            <!-- 内容区域 -->
            <div class="grid lg:grid-cols-2 gap-8">
                <!-- 最新上传 -->
                <section
                    class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-all duration-300">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                            <BookOpenIcon class="w-7 h-7 mr-2" />
                            最新上传
                        </h2>
                        <router-link to="/latest"
                            class="text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary-light/80 transition-colors flex items-center">
                            更多
                            <ChevronRightIcon class="w-4 h-4 ml-1" />
                        </router-link>
                    </div>

                    <div class="space-y-4">
                        <template v-if="!loading && latestBooks.length">
                            <router-link v-for="book in latestBooks" :key="book.id" :to="`/books/${book.id}`"
                                class="flex bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
                                <div class="w-24 h-32 flex-shrink-0 overflow-hidden">
                                    <img :src="book.cover || '/placeholder.jpg'" :alt="book.title"
                                        class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" />
                                </div>
                                <div class="flex-1 p-4">
                                    <h3
                                        class="font-medium mb-2 group-hover:text-primary dark:text-white transition-colors line-clamp-1">
                                        {{ book.title }}
                                    </h3>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ book.author }}</p>
                                    <div class="mt-2 flex items-center gap-2 text-xs">
                                        <span
                                            class="px-2 py-1 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light">
                                            {{ book.sort }}
                                        </span>
                                        <span
                                            class="px-2 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300">
                                            {{ book.tag }}
                                        </span>
                                    </div>
                                </div>
                            </router-link>
                        </template>
                    </div>
                </section>

                <!-- 热门推荐 -->
                <section
                    class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-all duration-300">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                            <FireIcon class="w-7 h-7 mr-2" />
                            热门推荐
                        </h2>
                        <router-link to="/popular"
                            class="text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary-light/80 transition-colors flex items-center">
                            更多
                            <ChevronRightIcon class="w-4 h-4 ml-1" />
                        </router-link>
                    </div>

                    <div class="space-y-4">
                        <!-- 热门书籍列表，结构类似最新上传 -->
                    </div>
                </section>
            </div>
        </main>
    </div>
</template>

<style scoped>
.hero-section {
    position: relative;
    overflow: hidden;
    /* 移除原来的渐变背景 */
}

.hero-section::before {
    content: none;
}

/* 修改打字机容器样式 */
.typewriter-container {
    display: block;
    /* 改为 block 以确保换行 */
    position: relative;
    opacity: 0;
    animation: fadeIn 0.5s forwards;
}

/* 为副标题添加淡入效果 */
.fade-in {
    animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 确保文字容器有足够空间并正确换行 */
h1.typewriter-container {
    min-height: 4rem;
    white-space: pre-line;
    /* 保持换行 */
    line-height: 1.2;
    /* 调整行高 */
}

p.typewriter-container {
    min-height: 2rem;
    white-space: pre-line;
    /* 保持换行 */
    line-height: 1.5;
    /* 调整行高 */
}

/* 可选：添加背景图片动画 */
@keyframes subtle-move {
    0% {
        transform: scale(1) translate(0, 0);
    }

    50% {
        transform: scale(1.05) translate(-1%, -1%);
    }

    100% {
        transform: scale(1) translate(0, 0);
    }
}

.hero-section img {
    animation: subtle-move 20s ease-in-out infinite;
    transition: opacity 0.5s ease;
}

/* 确保文字在深色背景上清晰可见 */
.typewriter-container {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
</style>
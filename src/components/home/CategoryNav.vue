<script setup lang="ts">
import { useBookStore } from '@/stores/books'
const bookStore = useBookStore()
</script>

<template>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12 px-2">
        <!-- 分类卡片 -->
        <router-link v-for="category in bookStore.hotCategories" :key="category.name" :to="`/category/${category.name}`"
            class="group relative overflow-hidden rounded-2xl 
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
</template>

<style scoped>
/* 添加渐变背景动画 */
@keyframes gradient-shift {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

.group:hover {
    background-size: 200% 200%;
    animation: gradient-shift 3s ease infinite;
}

/* 确保图标在深色模式下清晰可见 */
.dark .group img {
    filter: brightness(0.9) contrast(1.1);
}
</style>
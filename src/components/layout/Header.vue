<script setup lang="ts">
import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline'
import { useTheme } from '@/composables/useTheme'
import { computed } from 'vue'

const { theme, toggleTheme } = useTheme()
const isDark = computed(() => theme.value === 'dark')
</script>

<template>
    <header class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <!-- Logo - 添加动画效果 -->
                <router-link to="/" class="flex items-center space-x-2 group">
                    <img src="@/assets/logo.svg" alt="Logo"
                        class="w-8 h-8 transition-transform duration-300 group-hover:rotate-12" />
                    <span class="text-xl font-bold text-gray-900 dark:text-white 
                               group-hover:text-primary dark:group-hover:text-primary-light
                               transition-colors duration-300">
                        Novel Share
                    </span>
                </router-link>

                <!-- 导航菜单 - 添加指示器和动画 -->
                <nav class="hidden md:flex items-center space-x-6">
                    <router-link v-for="item in [
                        { name: '首页', path: '/' },
                        { name: '分类', path: '/categories' },
                        { name: '排行', path: '/ranking' },
                    ]" :key="item.path" :to="item.path" class="relative py-1 text-gray-600 dark:text-gray-300 
                               hover:text-primary dark:hover:text-primary-light
                               transition-colors duration-300 group">
                        {{ item.name }}
                        <!-- 添加悬停指示器 -->
                        <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary dark:bg-primary-light
                                   group-hover:w-full transition-all duration-300"></span>
                    </router-link>
                </nav>

                <!-- 右侧工具栏 - 美化主题切换按钮 -->
                <div class="flex items-center space-x-4">
                    <button @click="toggleTheme" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 
                               transition-all duration-300 hover:scale-110" aria-label="Toggle theme">
                        <MoonIcon v-if="!isDark" class="w-5 h-5 text-gray-600" />
                        <SunIcon v-else class="w-5 h-5 text-yellow-400 animate-spin-slow" />
                    </button>
                </div>
            </div>
        </div>
    </header>
</template>

<style scoped>
@keyframes spin-slow {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.animate-spin-slow {
    animation: spin-slow 3s linear infinite;
}
</style>
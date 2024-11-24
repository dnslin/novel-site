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
                <!-- Logo -->
                <router-link to="/" class="flex items-center space-x-2">
                    <img src="@/assets/logo.svg" alt="Logo" class="w-8 h-8" />
                    <span class="text-xl font-bold text-gray-900 dark:text-white">Novel Share</span>
                </router-link>

                <!-- 导航菜单 -->
                <nav class="hidden md:flex items-center space-x-6">
                    <router-link v-for="item in [
                        { name: '首页', path: '/' },
                        { name: '分类', path: '/categories' },
                        { name: '排行', path: '/ranking' },
                    ]" :key="item.path" :to="item.path" class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light
                   transition-colors duration-300">
                        {{ item.name }}
                    </router-link>
                </nav>

                <!-- 右侧工具栏 -->
                <div class="flex items-center space-x-4">
                    <!-- 主题切换按钮 -->
                    <button @click="toggleTheme" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 
                   transition-colors duration-300" aria-label="Toggle theme">
                        <MoonIcon v-if="!isDark" class="w-5 h-5 text-gray-600" />
                        <SunIcon v-else class="w-5 h-5 text-yellow-400" />
                    </button>

                    <!-- 可以添加其他功能按钮，如搜索、用户菜单等 -->
                </div>
            </div>
        </div>
    </header>
</template>
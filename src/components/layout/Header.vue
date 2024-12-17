<script setup lang="ts">
import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline'
import { useTheme } from '@/composables/useTheme'
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import LoginModal from '@/components/auth/LoginModal.vue'
import RegisterModal from '@/components/auth/RegisterModal.vue'
import UserAvatar from '@/components/user/UserAvatar.vue'

const { theme, toggleTheme } = useTheme()
const isDark = computed(() => theme.value === 'dark')

// 使用 userStore
const userStore = useUserStore()
const { currentUser, loading } = storeToRefs(userStore)
const isLoggedIn = computed(() => !!currentUser.value)

// 添加登录状态控制
const showLoginModal = ref(false)
const showRegisterModal = ref(false)

// 处理登录/注册模态框
const openLoginModal = () => {
    showLoginModal.value = true
}

const openRegisterModal = () => {
    showRegisterModal.value = true
}
</script>

<template>
    <header class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <!-- Logo - 添加动画效果 -->
                <router-link to="/" class="flex items-center space-x-2 group">
                    <img src="@/assets/logo.png" alt="Logo"
                        class="w-8 h-8 transition-transform duration-300 group-hover:rotate-12" />
                    <span class="text-xl font-bold text-gray-900 dark:text-white 
                               group-hover:text-primary dark:group-hover:text-primary-light
                               transition-colors duration-300">
                        Reader Go
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

                <!-- 右侧工具栏 - 重新设计按钮样式 -->
                <div class="flex items-center space-x-4">
                    <!-- 加载状态 -->
                    <div v-if="loading" class="w-20 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md"></div>

                    <!-- 未登录状态显示登录/注册按钮 -->
                    <template v-if="!loading && !isLoggedIn">
                        <button @click="openLoginModal" class="px-4 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 
                                   hover:text-[#8ffcfc] dark:hover:text-[#8ffcfc]
                                   border border-gray-300 dark:border-gray-600 rounded-md
                                   hover:border-[#8ffcfc] dark:hover:border-[#8ffcfc]
                                   transition-all duration-300">
                            登录
                        </button>
                        <button @click="openRegisterModal" class="px-4 py-1.5 text-sm font-medium text-gray-800
                                   bg-[#8FF0FC]/80 hover:bg-[#8FF0FC]
                                   dark:text-gray-800
                                   rounded-md shadow-sm hover:shadow-md
                                   transform hover:-translate-y-0.5
                                   transition-all duration-300">
                            注册
                        </button>
                    </template>

                    <!-- 已登录状态显示用户头像和下拉菜单 -->
                    <UserAvatar v-if="!loading && isLoggedIn" />

                    <!-- 主题切换按钮 -->
                    <button @click="toggleTheme" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 
                               transition-all duration-300" aria-label="Toggle theme">
                        <MoonIcon v-if="!isDark" class="w-5 h-5 text-gray-600" />
                        <SunIcon v-else class="w-5 h-5 text-yellow-400 animate-spin-slow" />
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- 登录模态框 -->
    <LoginModal v-if="showLoginModal" @close="showLoginModal = false" />

    <!-- 注册模态框 -->
    <RegisterModal v-if="showRegisterModal" @close="showRegisterModal = false" />
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
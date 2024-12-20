<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { ref, onMounted, onUnmounted } from 'vue'
import {
    UserCircleIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    ChevronDownIcon
} from '@heroicons/vue/24/outline'

const userStore = useUserStore()
const { currentUser } = storeToRefs(userStore)
const showUserMenu = ref(false)

// 用户菜单控制
const toggleUserMenu = () => {
    showUserMenu.value = !showUserMenu.value
}

// 处理登出
const handleLogout = async () => {
    await userStore.logout()
    showUserMenu.value = false
}

// 点击外部关闭菜单
const handleClickOutside = (event: MouseEvent) => {
    const menu = document.getElementById('user-menu')
    const avatar = document.getElementById('user-avatar')
    if (menu && avatar && !menu.contains(event.target as Node) && !avatar.contains(event.target as Node)) {
        showUserMenu.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
    <div class="relative">
        <!-- 头像按钮 -->
        <button id="user-avatar" @click="toggleUserMenu" class="flex items-center space-x-2 p-1.5 rounded-full
                   hover:bg-gray-100 dark:hover:bg-gray-800
                   transition-all duration-300 group">
            <div class="relative">
                <img :src="currentUser?.avatar || '/default-avatar.png'" :alt="currentUser?.nickname" class="w-8 h-8 rounded-full border-2 border-transparent
                        group-hover:border-primary dark:group-hover:border-primary-light
                        transition-all duration-300
                        shadow-sm group-hover:shadow-md">
                <div class="absolute inset-0 rounded-full bg-primary/10 dark:bg-primary-light/10 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <!-- 在移动端隐藏用户名和箭头 -->
            <div class="hidden sm:flex items-center space-x-1">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-200
                          group-hover:text-primary dark:group-hover:text-primary-light">
                    {{ currentUser?.nickname || currentUser?.username }}
                </span>
                <ChevronDownIcon class="w-4 h-4 text-gray-400 group-hover:text-primary dark:group-hover:text-primary-light
                                transition-transform duration-300" :class="{ 'rotate-180': showUserMenu }" />
            </div>
        </button>

        <!-- 用户菜单 -->
        <div v-if="showUserMenu" id="user-menu" class="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 
                   rounded-lg shadow-lg ring-1 ring-black/5
                   divide-y divide-gray-100 dark:divide-gray-700
                   transform transition-all duration-200 ease-out
                   animate-menu-enter">
            <!-- 移动端显示用户信息 -->
            <div class="px-4 py-3 sm:hidden">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {{ currentUser?.nickname || currentUser?.username }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ currentUser?.email }}
                </p>
            </div>

            <!-- 菜单项 -->
            <div class="py-1">
                <router-link to="/profile" class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 
                                  hover:bg-gray-50 dark:hover:bg-gray-700/50
                                  hover:text-primary dark:hover:text-primary-light
                                  transition-colors duration-200 group">
                    <UserCircleIcon class="w-5 h-5 mr-3 text-gray-400 group-hover:text-primary 
                                        dark:group-hover:text-primary-light transition-colors" />
                    <span class="flex-1">个人中心</span>
                </router-link>
                <router-link to="/settings" class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 
                                  hover:bg-gray-50 dark:hover:bg-gray-700/50
                                  hover:text-primary dark:hover:text-primary-light
                                  transition-colors duration-200 group">
                    <Cog6ToothIcon class="w-5 h-5 mr-3 text-gray-400 group-hover:text-primary 
                                       dark:group-hover:text-primary-light transition-colors" />
                    <span class="flex-1">设置</span>
                </router-link>
            </div>

            <!-- 登出按钮 -->
            <div class="py-1">
                <button @click="handleLogout" class="flex w-full items-center justify-start px-4 py-2 text-sm text-red-600 dark:text-red-400 
                           hover:bg-red-50 dark:hover:bg-red-900/10
                           transition-colors duration-200 group">
                    <ArrowRightOnRectangleIcon class="w-5 h-5 mr-2 text-red-400 group-hover:text-red-500 
                                                  dark:group-hover:text-red-300 transition-colors" />
                    <span>退出登录</span>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes menuEnter {
    from {
        opacity: 0;
        transform: scale(0.95) translateY(-10px);
    }

    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.animate-menu-enter {
    animation: menuEnter 0.2s ease-out forwards;
}

/* 添加菜单动画 */
.v-enter-active,
.v-leave-active {
    transition: all 0.2s ease-out;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
}
</style>
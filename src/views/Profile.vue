<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { ref, onMounted, nextTick } from 'vue'
import { useToast } from 'vue-toastification'
import {
    UserCircleIcon,
    EnvelopeIcon,
    PencilSquareIcon,
    BookOpenIcon,
    ClockIcon,
    HeartIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/vue/24/outline'

const userStore = useUserStore()
const { currentUser } = storeToRefs(userStore)
const toast = useToast()

// 编辑状态控制
const isEditing = ref(false)
const editForm = ref({
    nickname: currentUser.value?.nickname || '',
    avatar: currentUser.value?.avatar || '',
    introduction: currentUser.value?.introduction || '',
    email: currentUser.value?.email || '',
    preference: currentUser.value?.preference || ''
})

// 处理个人信息更新
const handleUpdateProfile = async () => {
    try {
        // TODO: 实现更新个人信息的逻辑
        await userStore.updateProfile(editForm.value)
        isEditing.value = false
        toast.success('个人信息更新成功')
    } catch (error: any) {
        toast.error(error.message || '更新失败，请重试')
    }
}

// 添加动画控制
const showStats = ref(false)
const showContent = ref(false)

// 在组件挂载后触发动画
onMounted(() => {
    nextTick(() => {
        showContent.value = true
        setTimeout(() => {
            showStats.value = true
        }, 500)
    })
})
</script>

<template>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- 个人信息卡片 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-500"
            :class="{ 'translate-y-0 opacity-100': showContent, 'translate-y-4 opacity-0': !showContent }">
            <!-- 封面区域 -->
            <div class="h-32 bg-gradient-to-r from-primary to-primary-light relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary-light/50 
                            animate-gradient"></div>
            </div>

            <!-- 个人信息区域 -->
            <div class="relative px-4 sm:px-6 pb-6">
                <!-- 头像 -->
                <div class="absolute -top-16 left-4 sm:left-6">
                    <div class="relative group">
                        <div class="absolute inset-0 bg-primary/20 rounded-full blur-lg transform scale-110 
                                  opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                        <img :src="currentUser?.avatar || '/default-avatar.png'" :alt="currentUser?.nickname" class="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg 
                                   transform transition-all duration-300 group-hover:scale-105">
                        <button v-if="isEditing" class="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-white shadow-lg
                                   hover:bg-primary-dark transition-all duration-300 
                                   hover:scale-110 hover:rotate-12">
                            <PencilSquareIcon class="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <!-- 用户信息 -->
                <div class="pt-20">
                    <div class="flex items-center justify-between">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <span>{{ currentUser?.nickname || currentUser?.username }}</span>
                                <UserCircleIcon class="w-6 h-6 text-primary animate-pulse" />
                            </h1>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                                <EnvelopeIcon class="w-4 h-4" />
                                {{ currentUser?.email }}
                            </p>
                        </div>
                        <button v-if="!isEditing" @click="isEditing = true" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark
                                   transition-all duration-300 hover:scale-105 hover:shadow-lg
                                   flex items-center gap-2">
                            <PencilSquareIcon class="w-5 h-5" />
                            编辑资料
                        </button>
                        <div v-else class="space-x-2">
                            <button @click="handleUpdateProfile" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark
                                       transition-all duration-300 hover:scale-105 hover:shadow-lg
                                       flex items-center gap-2">
                                <CheckIcon class="w-5 h-5" />
                                保存
                            </button>
                            <button @click="isEditing = false" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300
                                       dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600
                                       transition-all duration-300 hover:scale-105
                                       flex items-center gap-2">
                                <XMarkIcon class="w-5 h-5" />
                                取消
                            </button>
                        </div>
                    </div>

                    <!-- 个人简介 -->
                    <div class="mt-6 transform transition-all duration-500"
                        :class="{ 'translate-y-0 opacity-100': showContent, 'translate-y-4 opacity-0': !showContent }">
                        <textarea v-if="isEditing" v-model="editForm.introduction" class="w-full px-3 py-2 border border-gray-300 rounded-lg
                                   dark:border-gray-600 dark:bg-gray-700
                                   focus:ring-2 focus:ring-primary focus:border-transparent
                                   transition-all duration-300" rows="3" placeholder="写点什么来介绍自己吧..."></textarea>
                        <p v-else class="text-gray-600 dark:text-gray-300">
                            {{ currentUser?.introduction || '这个人很懒，什么都没写~' }}
                        </p>
                    </div>
                </div>

                <!-- 统计信息 -->
                <div class="mt-6 grid grid-cols-3 gap-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div class="text-center transform transition-all duration-500 hover:scale-105"
                        :class="{ 'translate-y-0 opacity-100': showStats, 'translate-y-4 opacity-0': !showStats }">
                        <div class="text-2xl font-bold text-primary flex items-center justify-center gap-2">
                            <ClockIcon class="w-6 h-6" />
                            <span>0</span>
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">阅读时长</div>
                    </div>
                    <div class="text-center transform transition-all duration-500 hover:scale-105"
                        :class="{ 'translate-y-0 opacity-100': showStats, 'translate-y-4 opacity-0': !showStats }">
                        <div class="text-2xl font-bold text-primary flex items-center justify-center gap-2">
                            <HeartIcon class="w-6 h-6" />
                            <span>0</span>
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">收藏书籍</div>
                    </div>
                    <div class="text-center transform transition-all duration-500 hover:scale-105"
                        :class="{ 'translate-y-0 opacity-100': showStats, 'translate-y-4 opacity-0': !showStats }">
                        <div class="text-2xl font-bold text-primary flex items-center justify-center gap-2">
                            <BookOpenIcon class="w-6 h-6" />
                            <span>0</span>
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">阅读书籍</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes gradient {
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

.animate-gradient {
    background-size: 200% 200%;
    animation: gradient 8s ease infinite;
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: .5;
    }
}
</style>
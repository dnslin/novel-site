<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import {
    BellIcon,
    ShieldCheckIcon,
    SwatchIcon,
    LanguageIcon,
    DevicePhoneMobileIcon
} from '@heroicons/vue/24/outline'

const toast = useToast()

// 设置选项
const settings = ref({
    notifications: {
        email: true,
        push: true,
        updates: true
    },
    privacy: {
        showReadingHistory: true,
        showCollections: true,
        allowRecommendations: true
    },
    appearance: {
        theme: 'system',
        fontSize: 'medium',
        reducedMotion: false
    },
    language: 'zh-CN',
    deviceSync: true
})

// 保存设置
const saveSettings = async () => {
    try {
        // TODO: 实现保存设置的逻辑
        toast.success('设置保存成功')
    } catch (error: any) {
        toast.error(error.message || '保存失败，请重试')
    }
}
</script>

<template>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div class="px-4 sm:px-6 py-6">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">设置</h1>

                <!-- 设置选项 -->
                <div class="space-y-8">
                    <!-- 通知设置 -->
                    <section>
                        <h2 class="flex items-center text-lg font-medium text-gray-900 dark:text-white mb-4">
                            <BellIcon class="w-6 h-6 mr-2 text-primary" />
                            通知设置
                        </h2>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <label class="text-sm text-gray-700 dark:text-gray-300">邮件通知</label>
                                <input type="checkbox" v-model="settings.notifications.email"
                                    class="toggle toggle-primary">
                            </div>
                            <div class="flex items-center justify-between">
                                <label class="text-sm text-gray-700 dark:text-gray-300">推送通知</label>
                                <input type="checkbox" v-model="settings.notifications.push"
                                    class="toggle toggle-primary">
                            </div>
                            <div class="flex items-center justify-between">
                                <label class="text-sm text-gray-700 dark:text-gray-300">更新提醒</label>
                                <input type="checkbox" v-model="settings.notifications.updates"
                                    class="toggle toggle-primary">
                            </div>
                        </div>
                    </section>

                    <!-- 隐私设置 -->
                    <section>
                        <h2 class="flex items-center text-lg font-medium text-gray-900 dark:text-white mb-4">
                            <ShieldCheckIcon class="w-6 h-6 mr-2 text-primary" />
                            隐私设置
                        </h2>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <label class="text-sm text-gray-700 dark:text-gray-300">显示阅读历史</label>
                                <input type="checkbox" v-model="settings.privacy.showReadingHistory"
                                    class="toggle toggle-primary">
                            </div>
                            <div class="flex items-center justify-between">
                                <label class="text-sm text-gray-700 dark:text-gray-300">显示收藏列表</label>
                                <input type="checkbox" v-model="settings.privacy.showCollections"
                                    class="toggle toggle-primary">
                            </div>
                            <div class="flex items-center justify-between">
                                <label class="text-sm text-gray-700 dark:text-gray-300">允许个性化推荐</label>
                                <input type="checkbox" v-model="settings.privacy.allowRecommendations"
                                    class="toggle toggle-primary">
                            </div>
                        </div>
                    </section>

                    <!-- 外观设置 -->
                    <section>
                        <h2 class="flex items-center text-lg font-medium text-gray-900 dark:text-white mb-4">
                            <SwatchIcon class="w-6 h-6 mr-2 text-primary" />
                            外观设置
                        </h2>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <label class="text-sm text-gray-700 dark:text-gray-300">主题</label>
                                <select v-model="settings.appearance.theme" class="select select-primary">
                                    <option value="light">浅色</option>
                                    <option value="dark">深色</option>
                                    <option value="system">跟随系统</option>
                                </select>
                            </div>
                            <div class="flex items-center justify-between">
                                <label class="text-sm text-gray-700 dark:text-gray-300">字体大小</label>
                                <select v-model="settings.appearance.fontSize" class="select select-primary">
                                    <option value="small">小</option>
                                    <option value="medium">中</option>
                                    <option value="large">大</option>
                                </select>
                            </div>
                            <div class="flex items-center justify-between">
                                <label class="text-sm text-gray-700 dark:text-gray-300">减少动画</label>
                                <input type="checkbox" v-model="settings.appearance.reducedMotion"
                                    class="toggle toggle-primary">
                            </div>
                        </div>
                    </section>
                </div>

                <!-- 保存按钮 -->
                <div class="mt-8 flex justify-end">
                    <button @click="saveSettings" class="px-6 py-2.5 bg-primary text-white rounded-lg
                                   hover:bg-primary-dark transition-colors">
                        保存设置
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.toggle {
    @apply appearance-none w-11 h-6 rounded-full bg-gray-200 dark:bg-gray-700 relative transition-colors duration-200 ease-in-out cursor-pointer;
}

.toggle:checked {
    @apply bg-primary;
}

.toggle::before {
    content: '';
    @apply absolute left-1 top-1 w-4 h-4 bg-white rounded-full transform transition-transform duration-200 ease-in-out;
}

.toggle:checked::before {
    @apply translate-x-5;
}

.select {
    @apply px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent;
}
</style>
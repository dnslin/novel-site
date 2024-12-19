<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from 'vue'
import { usePreferencesStore } from '@/stores/preferences'
import { useBookStore } from '@/stores/books'
import { useTagStore } from '@/stores/tags'
import { storeToRefs } from 'pinia'
import { XMarkIcon, ClockIcon, BookOpenIcon, ArrowPathIcon, TagIcon, Square3Stack3DIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'
import {
    ReadingTimeRange,
    PreferredLength,
    UpdateFrequency,
    type UserPreferences
} from '@/api/preferences'

const preferencesStore = usePreferencesStore()
const bookStore = useBookStore()
const tagStore = useTagStore()
const { showPreferencesModal } = storeToRefs(preferencesStore)
const toast = useToast()

// 初始化表单数据
const preferences = ref<UserPreferences>({
    readingTimeRange: ReadingTimeRange.MORNING,
    preferredLength: PreferredLength.MEDIUM,
    updateFrequency: UpdateFrequency.DAILY,
    seriesPreference: true,
    updateNotification: true,
    categoryPreferences: {},
    tagPreferences: {},
})

// 时间段选项
const timeRangeOptions = [
    { value: ReadingTimeRange.MORNING, label: '早晨 (6:00-12:00)' },
    { value: ReadingTimeRange.AFTERNOON, label: '下午 (12:00-18:00)' },
    { value: ReadingTimeRange.EVENING, label: '晚上 (18:00-24:00)' },
    { value: ReadingTimeRange.NIGHT, label: '深夜 (0:00-6:00)' },
]

// 字数范围选项
const lengthOptions = [
    { value: PreferredLength.SHORT, label: '短篇 (10万字以下)' },
    { value: PreferredLength.MEDIUM, label: '中篇 (10-50万字)' },
    { value: PreferredLength.LONG, label: '长篇 (50-100万字)' },
    { value: PreferredLength.EPIC, label: '超长篇 (100万字以上)' },
]

// 更新频率选项
const frequencyOptions = [
    { value: UpdateFrequency.DAILY, label: '每天更新' },
    { value: UpdateFrequency.WEEKLY, label: '每周更新' },
    { value: UpdateFrequency.MULTIPLE, label: '多次更新' },
    { value: UpdateFrequency.COMPLETED, label: '完结作品' },
]

const loading = ref(false)

const handleClose = () => {
    preferences.value = {
        readingTimeRange: ReadingTimeRange.MORNING,
        preferredLength: PreferredLength.MEDIUM,
        updateFrequency: UpdateFrequency.DAILY,
        seriesPreference: true,
        updateNotification: true,
        categoryPreferences: {},
        tagPreferences: {},
    }
    showPreferencesModal.value = false
}

const handleSubmit = async () => {
    loading.value = true
    try {
        await preferencesStore.savePreferences(preferences.value)
        showPreferencesModal.value = false
        toast.success('偏好设置保存成功')
    } catch (error: any) {
        toast.error(error.message || '保存失败，请重试')
    } finally {
        loading.value = false
    }
}

// 确保偏好对象存在
const ensurePreferenceExists = (id: number | string, type: 'category' | 'tag') => {
    if (type === 'category') {
        if (!preferences.value.categoryPreferences[id as number]) {
            preferences.value.categoryPreferences[id as number] = {
                categoryId: id as number,
                preferenceLevel: 50
            }
        }
    } else {
        if (!preferences.value.tagPreferences[id]) {
            preferences.value.tagPreferences[id] = {
                tagId: id as string,
                preferenceLevel: 50
            }
        }
    }
}

// 修改初始化数据方法
const initializeData = async () => {
    try {
        await Promise.all([
            bookStore.allCategories.length === 0 ? bookStore.fetchCategories() : Promise.resolve(),
            tagStore.tags.length === 0 ? tagStore.fetchTags() : Promise.resolve(),
        ])

        // 初始化所有分类偏好
        bookStore.allCategories.forEach(category => {
            ensurePreferenceExists(category.id, 'category')
        })

        // 初始化所有标签偏好
        tagStore.tags.forEach(tag => {
            ensurePreferenceExists(tag.name, 'tag')
        })
    } catch (error) {
        toast.error('加载数据失败，请刷新页面重试')
    }
}

// 添加动画控制
const isVisible = ref(false)
const mounted = ref(false)

// 添加控制页面滚动的方法
const disableBodyScroll = () => {
    document.body.style.overflow = 'hidden'
}

const enableBodyScroll = () => {
    document.body.style.overflow = ''
}

// 修改 watch
watch(() => showPreferencesModal.value, (newValue) => {
    if (newValue) {
        mounted.value = true
        disableBodyScroll() // 禁用页面滚动
        nextTick(() => {
            isVisible.value = true
            initializeData()
        })
    } else {
        isVisible.value = false
        enableBodyScroll() // 恢复页面滚动
        setTimeout(() => {
            mounted.value = false
        }, 300)
    }
})

// 组件卸载时确保恢复滚动
onUnmounted(() => {
    enableBodyScroll()
})

// 修改 v-model 绑定的处理方式
const getPreferenceLevel = (id: number | string, type: 'category' | 'tag'): number => {
    try {
        if (type === 'category') {
            return preferences.value.categoryPreferences[id as number]?.preferenceLevel ?? 50;
        } else {
            return preferences.value.tagPreferences[id as string]?.preferenceLevel ?? 50;
        }
    } catch (error) {
        console.error('获取偏好级别失败:', error);
        return 50;
    }
}

const setPreferenceLevel = (id: number | string, type: 'category' | 'tag', value: number) => {
    try {
        ensurePreferenceExists(id, type);
        if (type === 'category') {
            preferences.value.categoryPreferences[id as number].preferenceLevel = value;
        } else {
            preferences.value.tagPreferences[id].preferenceLevel = value;
        }
    } catch (error) {
        console.error('设置偏好级别失败:', error);
    }
}
</script>

<template>
    <Teleport to="body">
        <div v-if="mounted" class="fixed inset-0 z-[9999] md:flex md:items-center md:justify-center"
            :class="{ 'opacity-0': !isVisible, 'opacity-100': isVisible }" @click.self="handleClose">
            <!-- 背景遮罩 - 移除 overflow-y-auto -->
            <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-opacity-85"
                :class="{ 'opacity-0': !isVisible, 'opacity-100': isVisible }" aria-hidden="true" />

            <!-- 模态框内容 -->
            <div class="relative w-full h-[calc(100vh-2rem)] md:h-auto md:max-h-[90vh] md:w-[90vw] md:max-w-3xl mx-auto 
                      bg-white dark:bg-gray-800 
                      rounded-t-xl md:rounded-lg shadow-xl 
                      transform transition-all duration-300 ease-out
                      flex flex-col overflow-hidden" :class="{
                        'translate-y-full md:scale-95 opacity-0': !isVisible,
                        'translate-y-0 md:scale-100 opacity-100': isVisible
                    }">
                <!-- 顶部把手（仅在移动端显示） -->
                <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 w-12 h-1.5 
                          bg-gray-300 rounded-full md:hidden" />

                <!-- 标题区域 -->
                <div class="flex-none pt-6 pb-4 px-4">
                    <!-- 关闭按钮 -->
                    <button @click="handleClose" class="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 
                               hover:text-gray-500 hover:bg-gray-100
                               dark:hover:text-gray-300 dark:hover:bg-gray-700
                               focus:outline-none focus:ring-2 focus:ring-primary
                               transition-colors">
                        <XMarkIcon class="w-6 h-6" />
                    </button>

                    <!-- 标题和副标题 -->
                    <div class="text-center">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white">个性化阅读偏好</h3>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            设置您的阅读偏好，获得更好的阅读体验
                        </p>
                    </div>
                </div>

                <!-- 表单内容区域 - 限制最大高度并添加滚动 -->
                <div class="flex-grow overflow-y-auto min-h-0">
                    <form @submit.prevent="handleSubmit" class="space-y-6 px-4 sm:px-6 py-4">
                        <!-- 阅读时间段 -->
                        <div class="space-y-2">
                            <label class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                <ClockIcon class="w-5 h-5 mr-2" />
                                阅读时间段
                            </label>
                            <select v-model="preferences.readingTimeRange" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                                       dark:bg-gray-700 dark:border-gray-600 focus:ring-primary focus:border-primary">
                                <option v-for="option in timeRangeOptions" :key="option.value" :value="option.value">
                                    {{ option.label }}
                                </option>
                            </select>
                        </div>

                        <!-- 偏好字数范围 -->
                        <div class="space-y-2">
                            <label class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                <BookOpenIcon class="w-5 h-5 mr-2" />
                                偏好字数范围
                            </label>
                            <select v-model="preferences.preferredLength" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                                       dark:bg-gray-700 dark:border-gray-600 focus:ring-primary focus:border-primary">
                                <option v-for="option in lengthOptions" :key="option.value" :value="option.value">
                                    {{ option.label }}
                                </option>
                            </select>
                        </div>

                        <!-- 更新频率 -->
                        <div class="space-y-2">
                            <label class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                <ArrowPathIcon class="w-5 h-5 mr-2" />
                                更新频率偏好
                            </label>
                            <select v-model="preferences.updateFrequency" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                                       dark:bg-gray-700 dark:border-gray-600 focus:ring-primary focus:border-primary">
                                <option v-for="option in frequencyOptions" :key="option.value" :value="option.value">
                                    {{ option.label }}
                                </option>
                            </select>
                        </div>

                        <!-- 系列作品偏好 -->
                        <div class="flex items-center">
                            <input type="checkbox" v-model="preferences.seriesPreference"
                                class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
                            <label class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                偏好系列作品
                            </label>
                        </div>

                        <!-- 更新通知 -->
                        <div class="flex items-center">
                            <input type="checkbox" v-model="preferences.updateNotification"
                                class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
                            <label class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                接收更新通知
                            </label>
                        </div>

                        <!-- 分类偏好 -->
                        <div class="space-y-4">
                            <label
                                class="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                                <div class="flex items-center">
                                    <Square3Stack3DIcon class="w-5 h-5 mr-2" />
                                    分类偏好
                                </div>
                                <span class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                    <svg class="w-3 h-3 mr-1 scroll-hint" xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                    可滚动查看更多
                                </span>
                            </label>
                            <div class="space-y-3 max-h-40 overflow-y-auto scrollbar-hide">
                                <div v-for="category in bookStore.allCategories" :key="category.id" class="flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-700/50 
                                            p-2 rounded-lg transition-colors">
                                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ category.name }}</span>
                                    <div class="relative flex items-center w-32">
                                        <input type="range" min="0" max="100" step="10"
                                            :value="getPreferenceLevel(category.id, 'category')"
                                            @input="(e) => setPreferenceLevel(category.id, 'category', Number((e.target as HTMLInputElement).value))"
                                            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                                                   dark:bg-gray-700 accent-primary">
                                        <span
                                            class="absolute -top-6 left-1/2 transform -translate-x-1/2 
                                                     text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {{ getPreferenceLevel(category.id, 'category') }}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 标签偏好 -->
                        <div class="space-y-4">
                            <label
                                class="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                                <div class="flex items-center">
                                    <TagIcon class="w-5 h-5 mr-2" />
                                    标签偏好
                                </div>
                                <span class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                    <svg class="w-3 h-3 mr-1 scroll-hint" xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                    可滚动查看更多
                                </span>
                            </label>
                            <div class="space-y-3 max-h-40 overflow-y-auto scrollbar-hide">
                                <div v-for="tag in tagStore.tags" :key="tag.name" class="flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-700/50 
                                            p-2 rounded-lg transition-colors">
                                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ tag.name }}</span>
                                    <div class="relative flex items-center w-32">
                                        <input type="range" min="0" max="100" step="10"
                                            :value="getPreferenceLevel(tag.name, 'tag')"
                                            @input="(e) => setPreferenceLevel(tag.name, 'tag', Number((e.target as HTMLInputElement).value))"
                                            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                                                   dark:bg-gray-700 accent-primary">
                                        <span
                                            class="absolute -top-6 left-1/2 transform -translate-x-1/2 
                                                     text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {{ getPreferenceLevel(tag.name, 'tag') }}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- 底部按钮区域 -->
                <div class="flex-none p-4 sm:px-6 border-t border-gray-200 dark:border-gray-700">
                    <button type="submit" class="w-full flex items-center justify-center px-4 py-2.5 
                               border border-transparent rounded-lg shadow-sm 
                               text-base font-medium text-white bg-primary 
                               hover:bg-primary-dark focus:outline-none 
                               focus:ring-2 focus:ring-offset-2 focus:ring-primary 
                               transition-colors disabled:opacity-50 
                               disabled:cursor-not-allowed" :disabled="loading" @click="handleSubmit">
                        <span v-if="loading" class="mr-2">
                            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        </span>
                        {{ loading ? '保存中...' : '保存设置' }}
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
/* 隐藏滚动条但保留滚动功能 */
.scrollbar-hide {
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari and Opera */
}

/* 主内容区域也隐藏滚动条 */
.overflow-y-auto {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.overflow-y-auto::-webkit-scrollbar {
    display: none;
}

/* 滑块样式 */
input[type="range"] {
    @apply appearance-none bg-gray-200 dark:bg-gray-700 h-2 rounded-lg;
}

input[type="range"]::-webkit-slider-thumb {
    @apply appearance-none w-4 h-4 rounded-full bg-primary cursor-pointer;
    transition: transform 0.15s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.2);
}

/* 添加进入和离开动画 */
.modal-enter-active,
.modal-leave-active {
    transition: all 0.3s ease-out;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
    transform: translateY(100%);
}

@media (min-width: 768px) {

    .modal-enter-from,
    .modal-leave-to {
        transform: scale(0.95);
    }
}

/* 滚动提示动画 */
.scroll-hint {
    animation: scrollHint 2s ease-in-out infinite;
}

@keyframes scrollHint {

    0%,
    100% {
        transform: translateY(0);
        opacity: 0.5;
    }

    50% {
        transform: translateY(3px);
        opacity: 1;
    }
}
</style>
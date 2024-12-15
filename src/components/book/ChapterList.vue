<script setup lang="ts">
import { ref } from 'vue'
import { useChapterStore } from '@/stores/chapters'
import {
    ChevronDownIcon,
    ChevronUpIcon,
    BookOpenIcon,
    LockClosedIcon,
    ArrowPathIcon
} from '@heroicons/vue/24/outline'

const props = defineProps<{
    bookId: number
}>()

const chapterStore = useChapterStore()
const expandedVolumes = ref<Set<string>>(new Set())

// 加载章节数据
const loadChapters = async () => {
    await chapterStore.fetchBookChapters(props.bookId)
}

// 切换卷的展开/收起状态
const toggleVolume = (volumeName: string) => {
    if (expandedVolumes.value.has(volumeName)) {
        expandedVolumes.value.delete(volumeName)
    } else {
        expandedVolumes.value.add(volumeName)
    }
}

// 格式化字数
const formatWordCount = (count: number): string => {
    if (count >= 10000) {
        return `${(count / 10000).toFixed(1)}万字`
    }
    return `${count}字`
}

// 添加同步方法（暂时为空）
const handleSync = () => {
    // TODO: 实现同步逻辑
}

// 初始加载
loadChapters()
</script>

<template>
    <div class="chapter-list bg-white dark:bg-gray-800 rounded-lg shadow-md w-full">
        <!-- 加载状态 -->
        <div v-if="chapterStore.loading" class="p-4">
            <div class="animate-pulse space-y-4">
                <div v-for="i in 3" :key="i" class="space-y-3">
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
            </div>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="chapterStore.error" class="p-4 text-red-500 text-center">
            {{ chapterStore.error }}
        </div>

        <!-- 章节列表 -->
        <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <!-- 统计信息 -->
            <div class="p-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div class="flex items-center gap-4">
                    <span>共 {{ chapterStore.totalChapters }} 章</span>
                    <span>总计 {{ formatWordCount(chapterStore.totalWordCount) }}</span>
                </div>
                <button @click="handleSync" class="flex items-center gap-1 px-2 py-1 rounded-md
                               hover:bg-gray-100 dark:hover:bg-gray-700
                               text-primary dark:text-primary-light
                               transition-colors duration-300">
                    <ArrowPathIcon class="w-4 h-4" />
                    <span>同步</span>
                </button>
            </div>

            <!-- 卷列表 -->
            <div v-for="volume in chapterStore.volumeChapters" :key="volume.volumeName" class="volume-item">
                <!-- 卷标题 -->
                <button @click="toggleVolume(volume.volumeName)" class="w-full px-4 py-3 flex items-center justify-between
                       hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <span class="font-medium text-gray-900 dark:text-white">
                        {{ volume.volumeName }}
                    </span>
                    <component :is="expandedVolumes.has(volume.volumeName) ? ChevronUpIcon : ChevronDownIcon"
                        class="w-5 h-5 text-gray-400" />
                </button>

                <!-- 章节列表 -->
                <div v-show="expandedVolumes.has(volume.volumeName)" class="chapter-grid">
                    <a v-for="chapter in volume.chapters" :key="chapter.uuid" :href="chapter.chapterUrl" target="_blank"
                        class="chapter-item">
                        <div class="flex items-center gap-2">
                            <BookOpenIcon class="w-4 h-4 text-gray-400" />
                            <span class="text-gray-900 dark:text-white line-clamp-1">
                                {{ chapter.chapterName }}
                            </span>
                            <LockClosedIcon v-if="chapter.isVip" class="w-4 h-4 text-yellow-500" />
                        </div>
                        <span class="text-sm text-gray-500 dark:text-gray-400">
                            {{ formatWordCount(chapter.wordCount) }}
                        </span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.chapter-grid {
    @apply grid grid-cols-1 md:grid-cols-2 gap-2 p-4 bg-gray-50 dark:bg-gray-800/50;
}

.chapter-item {
    @apply flex items-center justify-between p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors duration-200 text-sm;
}

.volume-item {
    @apply border-t border-gray-200 dark:border-gray-700 first:border-t-0;
}

/* 移动端适配 */
@media (max-width: 768px) {
    .chapter-grid {
        @apply grid-cols-1;
    }

    .chapter-item {
        @apply px-4;
    }
}
</style>
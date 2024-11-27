<script setup lang="ts">
defineProps<{
    progress: number
    downloading: boolean
}>()

defineEmits<{
    (e: 'retry'): void
}>()
</script>

<template>
    <div class="relative overflow-hidden">
        <!-- 进度条 -->
        <div class="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div class="h-full bg-primary transition-all duration-300 ease-out" :style="{ width: `${progress}%` }">
                <div class="absolute right-0 top-0 h-full w-2 bg-white/50 animate-pulse"></div>
            </div>
        </div>

        <!-- 进度文字 -->
        <div class="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
            {{ progress }}% 已完成
        </div>
    </div>
</template>
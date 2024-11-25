<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { theme } = useTheme()
const isDark = computed(() => theme.value === 'dark')
const bgTransitioning = ref(false)

// 监听主题变化
watch(isDark, () => {
    bgTransitioning.value = true
    setTimeout(() => {
        bgTransitioning.value = false
    }, 500)
}, { immediate: true })

// 打字机效果相关
defineProps<{
    mainTitle: string
    subTitle: string
    displayedMainTitle: string
    displayedSubTitle: string
    showSubTitle: boolean
}>()
</script>

<template>
    <div class="hero-section py-24">
        <!-- 背景图层 -->
        <div class="absolute inset-0 w-full h-full">
            <img src="@/assets/blob-scene-light.svg" alt="background"
                class="w-full h-full object-cover absolute top-0 left-0 transition-all duration-500" :class="[
                    { 'opacity-0': isDark, 'opacity-100': !isDark },
                    { 'scale-105': bgTransitioning }
                ]" />
            <img src="@/assets/blob-scene-black.svg" alt="background"
                class="w-full h-full object-cover absolute top-0 left-0 transition-all duration-500" :class="[
                    { 'opacity-100': isDark, 'opacity-0': !isDark },
                    { 'scale-105': bgTransitioning }
                ]" />
        </div>

        <!-- 内容区域 -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <!-- 主标题 -->
            <h1 class="text-5xl font-bold mb-6 text-white dark:text-white typewriter-container">
                {{ displayedMainTitle }}
            </h1>

            <!-- 副标题 -->
            <p v-show="showSubTitle" class="text-xl mb-8 text-white/90 dark:text-gray-200 typewriter-container"
                :class="{ 'fade-in': showSubTitle }">
                {{ displayedSubTitle }}
            </p>

            <!-- 插槽用于搜索框 -->
            <slot name="search"></slot>
        </div>
    </div>
</template>

<style scoped>
.hero-section {
    position: relative;
    overflow: hidden;
}

/* 确保图片过渡效果平滑 */
.hero-section img {
    will-change: transform, opacity;
    backface-visibility: hidden;
    transform-style: preserve-3d;
    animation: subtle-move 20s ease-in-out infinite;
    transition: opacity 0.5s ease;
}

/* 打字机容器样式 */
.typewriter-container {
    display: block;
    position: relative;
    opacity: 0;
    animation: fadeIn 0.5s forwards;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* 为主标题设置样式 */
h1.typewriter-container {
    min-height: 4rem;
    white-space: pre-line;
    line-height: 1.2;
}

/* 为副标题设置样式 */
p.typewriter-container {
    min-height: 2rem;
    white-space: pre-line;
    line-height: 1.5;
}

/* 为副标题添加淡入效果 */
.fade-in {
    animation: fadeIn 0.5s ease-out forwards;
}

/* 背景图动画 */
@keyframes subtle-move {
    0% {
        transform: scale(1) translate(0, 0);
    }

    50% {
        transform: scale(1.05) translate(-1%, -1%);
    }

    100% {
        transform: scale(1) translate(0, 0);
    }
}

/* 淡入动画 */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 确保动画性能 */
.hero-section {
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
}

/* 深色模式适配 */
:deep(.dark) {
    .typewriter-container {
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }
}

/* 响应式调整 */
@media (max-width: 640px) {
    h1.typewriter-container {
        font-size: 2.5rem;
        min-height: 3rem;
    }

    p.typewriter-container {
        font-size: 1.125rem;
        min-height: 1.5rem;
    }
}
</style>
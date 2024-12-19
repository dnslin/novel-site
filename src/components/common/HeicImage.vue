<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useToast } from 'vue-toastification'
import { isHeic, convertHeicToJpeg, clearMemoryCache } from '@/utils/heicImage'

const props = defineProps<{
    src: string
    alt: string
    className?: string
    placeholder?: string
}>()

const toast = useToast()
const imgSrc = ref<string>(props.placeholder || '/placeholder.jpg')
const error = ref(false)
const loading = ref(true)

const handleLoad = () => {
    loading.value = false
    error.value = false
}

onMounted(async () => {
    if (!props.src) {
        error.value = true
        loading.value = false
        return
    }

    try {
        if (isHeic(props.src)) {
            const blobUrl = await convertHeicToJpeg(props.src)
            imgSrc.value = blobUrl
        } else {
            imgSrc.value = props.src
        }
    } catch (err) {
        console.error('图片加载失败:', err)
        error.value = true
        toast.error('图片加载失败')
    }
})

const handleError = () => {
    console.error('Image load error:', imgSrc.value)
    error.value = true
    loading.value = false
}

onUnmounted(() => {
    if (imgSrc.value && imgSrc.value.startsWith('blob:')) {
        URL.revokeObjectURL(imgSrc.value)
    }
    clearMemoryCache()
})
</script>

<template>
    <div class="relative w-full h-full">
        <!-- 图片 -->
        <img :src="imgSrc" :alt="props.alt" :class="[props.className, 'w-full h-full object-cover']" @load="handleLoad"
            @error="handleError" v-show="!loading && !error" />

        <!-- 加载中状态 -->
        <div v-if="loading" class="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg">
        </div>

        <!-- 闪光效果层 -->
        <div v-if="!error && !loading" class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent
                      animate-shimmer" style="background-size: 200% 100%;">
            </div>
        </div>

        <!-- 错误状态显示 -->
        <div v-if="error"
            class="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <span class="text-gray-400 dark:text-gray-600">图片加载失败</span>
        </div>
    </div>
</template>

<style scoped>
@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }

    100% {
        background-position: 200% 0;
    }
}

.animate-shimmer {
    animation: shimmer 3s infinite linear;
}
</style>

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
const loading = ref(true)
const error = ref(false)

onMounted(async () => {
    if (!props.src) {
        loading.value = false
        error.value = true
        return
    }

    try {
        if (isHeic(props.src)) {
            imgSrc.value = await convertHeicToJpeg(props.src)
        } else {
            imgSrc.value = props.src
        }
        loading.value = false
    } catch (err) {
        console.error('图片加载失败:', err)
        loading.value = false
        error.value = true
        toast.error('图片加载失败')
        imgSrc.value = props.src
    }
})

onUnmounted(() => {
    if (imgSrc.value && imgSrc.value.startsWith('blob:')) {
        URL.revokeObjectURL(imgSrc.value)
    }
    clearMemoryCache()
})
</script>

<template>
    <div class="relative">
        <div v-if="loading" class="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>
        <div v-if="error"
            class="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <span class="text-gray-400 dark:text-gray-600">图片加载失败</span>
        </div>
        <img :src="imgSrc" :alt="props.alt" :class="[
            props.className,
            'transition-opacity duration-300',
            loading || error ? 'opacity-0' : 'opacity-100'
        ]" @error="error = true" />
    </div>
</template>

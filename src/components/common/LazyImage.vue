<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
    src: string
    alt: string
    placeholder?: string
}>()

const isLoaded = ref(false)
const imgRef = ref<HTMLImageElement | null>(null)

onMounted(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 图片进入视口时才加载
                loadImage()
                // 取消观察
                observer.unobserve(entry.target)
            }
        })
    }, {
        // 配置项
        rootMargin: '50px', // 提前50px开始加载
        threshold: 0.1 // 只要出现10%就开始加载
    })

    if (imgRef.value) {
        observer.observe(imgRef.value)
    }

    return () => {
        if (imgRef.value) {
            observer.unobserve(imgRef.value)
        }
    }
})

const loadImage = () => {
    const img = new Image()
    img.src = props.src
    img.onload = () => {
        isLoaded.value = true
    }
}
</script>

<template>
    <div class="relative overflow-hidden">
        <!-- 占位图 -->
        <img v-if="!isLoaded" :src="placeholder || '/placeholder.jpg'" :alt="alt"
            class="w-full h-full object-cover transition-opacity duration-300" />

        <!-- 实际图片 -->
        <img ref="imgRef" v-show="isLoaded" :src="src" :alt="alt"
            class="w-full h-full object-cover transition-opacity duration-300" />
    </div>
</template>
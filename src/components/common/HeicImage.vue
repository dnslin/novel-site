<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import heic2any from 'heic2any'
import { useToast } from 'vue-toastification'

// 定义组件 props
const props = defineProps<{
    src: string
    alt: string
    className?: string
    placeholder?: string
}>()

// 使用 Vue Toastification
const toast = useToast()

// 响应式变量
const imgSrc = ref<string>(props.placeholder || '/placeholder.jpg')
const loading = ref(true)
const error = ref(false)

// 模块级缓存容器：原始 URL -> 转换后的 Object URL
const convertedCache = new Map<string, string>()

// 检查是否为 HEIC/HEIF 图片，仅基于文件扩展名
const isHeic = (url: string): boolean => {
    const heicExtensions = ['.heic', '.heif']
    const lowercaseUrl = url.toLowerCase()

    return heicExtensions.some(ext => {
        const extIndex = lowercaseUrl.indexOf(ext)
        if (extIndex === -1) return false
        const afterExt = lowercaseUrl.charAt(extIndex + ext.length)
        return !afterExt || afterExt === '?' || afterExt === '#'
    })
}

// 转换 HEIC 图片为 JPEG，并使用缓存
const convertHeicToJpeg = async (url: string): Promise<string> => {
    // 检查缓存
    if (convertedCache.has(url)) {
        console.log(`从缓存中获取转换后的图片: ${url}`)
        return convertedCache.get(url)!
    }

    try {
        console.log('开始转换 HEIC 图片:', url)
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`)
        }

        const blob = await response.blob()
        console.log('获取到图片 blob:', blob.type, blob.size)

        // 检查实际 MIME 类型
        if (blob.type === 'image/heic' || blob.type === 'image/heif') {
            // 进行 HEIC 到 JPEG 的转换
            const convertedBlob = await heic2any({
                blob,
                toType: 'image/jpeg',
                quality: 0.8
            }) as Blob

            console.log('转换完成，新的 blob:', convertedBlob.type, convertedBlob.size)

            if (!convertedBlob) {
                throw new Error('Conversion failed: no blob returned')
            }

            const objectUrl = URL.createObjectURL(convertedBlob)
            console.log('创建的 Object URL:', objectUrl)

            // 存入缓存
            convertedCache.set(url, objectUrl)
            return objectUrl
        } else if (blob.type === 'image/jpeg' || blob.type === 'image/png' || blob.type === 'image/gif') {
            // 已经是浏览器可读的格式，直接使用原始 URL
            console.log('图片已经是浏览器可读的格式，跳过转换:', blob.type)
            return url
        } else {
            throw new Error('Unsupported image type: ' + blob.type)
        }
    } catch (err: any) {
        console.error('HEIC 转换失败:', err)
        toast.error(`图片转换失败: ${err.message || err}`)
        return url
    }
}

// 组件挂载时的逻辑
onMounted(async () => {
    if (!props.src) {
        loading.value = false
        error.value = true
        return
    }

    try {
        if (isHeic(props.src)) {
            console.log('检测到 HEIC 图片:', props.src)
            imgSrc.value = await convertHeicToJpeg(props.src)
        } else {
            console.log('非 HEIC 图片，直接使用:', props.src)
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

// 组件卸载时的逻辑
onUnmounted(() => {
    if (imgSrc.value && imgSrc.value.startsWith('blob:')) {
        console.log('清理 Object URL:', imgSrc.value)
        URL.revokeObjectURL(imgSrc.value)
        // 从缓存中删除已清理的 Object URL
        for (const [key, value] of convertedCache.entries()) {
            if (value === imgSrc.value) {
                convertedCache.delete(key)
                break
            }
        }
    }
})
</script>

<template>
    <div class="relative">
        <!-- 加载状态 -->
        <div v-if="loading" class="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>

        <!-- 错误状态 -->
        <div v-if="error"
            class="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <span class="text-gray-400 dark:text-gray-600">
                图片加载失败
            </span>
        </div>

        <!-- 图片 -->
        <img :src="imgSrc" :alt="props.alt" :class="[
            props.className,
            'transition-opacity duration-300',
            loading || error ? 'opacity-0' : 'opacity-100'
        ]" @error="error = true" />
    </div>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification'

const toast = useToast()
const props = defineProps<{
    title: string
    author: string
    description: string
    url: string
}>()

const shareData = {
    title: props.title,
    text: `${props.title} - ${props.author}\n${props.description}`,
    url: props.url
}

const copyLink = async () => {
    try {
        await navigator.clipboard.writeText(props.url)
        toast.success('链接已复制')
    } catch (error) {
        toast.error('复制失败，请手动复制')
    }
}

const shareBook = async () => {
    try {
        if (navigator.share) {
            await navigator.share(shareData)
        } else {
            await copyLink()
        }
    } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
            toast.error('分享失败')
        }
    }
}
</script>

<template>
    <div>
        <button @click="shareBook" class="flex items-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
             hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            分享
        </button>
    </div>
</template>
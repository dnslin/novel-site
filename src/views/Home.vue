<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBookStore } from '@/stores/books'
import { storeToRefs } from 'pinia'
import { useTypeWriter } from '@/utils/typeWriter'
import { useToast } from 'vue-toastification'
import HeroBanner from '@/components/home/HeroBanner.vue'
import SearchBox from '@/components/home/SearchBox.vue'
import CategoryNav from '@/components/home/CategoryNav.vue'
import BookList from '@/components/home/BookList.vue'

const bookStore = useBookStore()
const { latestBooks, popularBooks, loading } = storeToRefs(bookStore)

const toast = useToast()

// 打字机效果相关
const mainTitle = "探索无尽的阅读世界"
const subTitle = "发现、分享、畅读你喜爱的小说"
const displayedMainTitle = ref('')
const displayedSubTitle = ref('')
const showSubTitle = ref(false)

onMounted(async () => {
    try {
        await Promise.all([
            bookStore.fetchLatestBooks(),
            bookStore.fetchPopularBooks(),
            bookStore.fetchCategories(),
        ])
    } catch (error) {
        toast.error('加载数据失败，请刷新页面重试')
    }

    await useTypeWriter(mainTitle, displayedMainTitle, 150)
    showSubTitle.value = true
    await useTypeWriter(subTitle, displayedSubTitle, 100)
})
</script>

<template>
    <div class="min-h-screen">
        <!-- 内容区域 -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-16 mb-24">
            <div class="relative z-40">
                <HeroBanner :main-title="mainTitle" :sub-title="subTitle" :displayed-main-title="displayedMainTitle"
                    :displayed-sub-title="displayedSubTitle" :show-sub-title="showSubTitle">
                    <template #search>
                        <SearchBox />
                    </template>
                </HeroBanner>
            </div>
            <CategoryNav />

            <div class="grid lg:grid-cols-2 gap-8">
                <BookList title="最新上传" icon="book" :books="latestBooks" :loading="loading" more-link="/latest" />
                <BookList title="热门推荐" icon="fire" :books="popularBooks" :loading="loading" more-link="/popular" />
            </div>
        </div>
    </div>
</template>
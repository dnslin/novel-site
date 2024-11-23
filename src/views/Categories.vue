<script setup lang="ts">
import { useBookStore } from '@/stores/books'
import { storeToRefs } from 'pinia'

const bookStore = useBookStore()
const { categories } = storeToRefs(bookStore)
</script>

<template>
    <div class="categories-page">
        <h1 class="text-2xl font-bold mb-6">全部分类</h1>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <!-- 分类列表 -->
        </div>
    </div>
</template>
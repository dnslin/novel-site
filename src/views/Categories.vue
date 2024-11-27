<script setup lang="ts">
import { useBookStore } from '@/stores/books'
import { storeToRefs } from 'pinia'
import { onMounted, ref, computed } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const bookStore = useBookStore()
const { categories, loading } = storeToRefs(bookStore)
const searchKeyword = ref('')

// 筛选分类
const filteredCategories = computed(() => {
    if (!searchKeyword.value) return categories.value
    return categories.value.filter(category =>
        category.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
})

// 分组显示 - 修改分组逻辑，去掉热度判断
const groupedCategories = computed(() => {
    const groups: Record<string, typeof categories.value> = {
        '男生': [],
        '女生': [],
        '出版': [],
        '其他': []
    }

    filteredCategories.value.forEach(category => {
        if (category.name.includes('言情') || category.name.includes('青春')) {
            groups['女生'].push(category)
        } else if (category.name.includes('玄幻') || category.name.includes('武侠') ||
            category.name.includes('都市') || category.name.includes('仙侠')) {
            groups['男生'].push(category)
        } else if (category.name.includes('文学') || category.name.includes('传记') ||
            category.name.includes('现实')) {
            groups['出版'].push(category)
        } else {
            groups['其他'].push(category)
        }
    })

    return groups
})

onMounted(async () => {
    if (categories.value.length === 0) {
        await bookStore.fetchCategories()
    }
})
</script>

<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- 标题和搜索框 - 优化移动端布局 -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">全部分类</h1>

            <!-- 搜索框 -->
            <div class="relative w-full sm:w-auto">
                <input v-model="searchKeyword" type="text" placeholder="搜索分类..." class="w-full sm:w-64 pl-10 pr-4 py-2 rounded-full 
                           border border-gray-300 dark:border-gray-600
                           bg-white/50 dark:bg-gray-800/50
                           focus:ring-2 focus:ring-primary/50
                           dark:text-white" />
                <MagnifyingGlassIcon class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 
                           text-gray-400 dark:text-gray-500" />
            </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="text-center py-12">
            <div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent 
                       rounded-full mx-auto mb-4">
            </div>
            <p class="text-gray-600 dark:text-gray-400">正在加载分类...</p>
        </div>

        <template v-else>
            <!-- 分组显示分类 - 优化移动端网格 -->
            <div v-for="(group, groupName) in groupedCategories" :key="groupName" class="mb-8"
                v-show="group.length > 0">
                <h2 class="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    {{ groupName }}
                </h2>

                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-6">
                    <router-link v-for="category in group" :key="category.name" :to="`/category/${category.name}`"
                        class="group relative overflow-hidden rounded-xl sm:rounded-2xl 
                               bg-gradient-to-br from-white to-gray-50 
                               dark:from-gray-800/80 dark:to-gray-800/40 
                               shadow-sm hover:shadow-xl 
                               border border-gray-200/80 dark:border-gray-700/30
                               transition-all duration-500 ease-out">
                        <!-- 背景效果 -->
                        <div class="absolute inset-0 bg-gradient-to-br 
                                  from-primary/5 via-primary/2 to-primary/10 
                                  dark:from-primary/10 dark:to-primary/20 
                                  opacity-0 group-hover:opacity-100 
                                  transition-opacity duration-500">
                        </div>

                        <!-- 内容区域 - 调整移动端padding和图标大小 -->
                        <div class="relative h-full flex flex-col items-center justify-center 
                                  p-3 sm:p-6
                                  group-hover:transform group-hover:scale-105 
                                  transition-transform duration-500">
                            <!-- 图标 -->
                            <div class="relative mb-2 sm:mb-3 transform-gpu transition-all duration-500 ease-out 
                                      group-hover:scale-110">
                                <div class="absolute inset-0 bg-primary/20 dark:bg-primary/30 
                                          rounded-full blur-lg scale-75 opacity-0 
                                          group-hover:opacity-70 transition-all duration-500">
                                </div>
                                <img :src="category.icon" :alt="category.name" loading="lazy" class="w-8 h-8 sm:w-12 sm:h-12 relative z-10 
                                            transition-transform duration-500 
                                            group-hover:rotate-6" />
                            </div>

                            <!-- 分类名称 - 调整移动端字体大小 -->
                            <span class="text-sm sm:text-base font-medium 
                                       text-gray-700 dark:text-gray-200
                                       group-hover:text-primary dark:group-hover:text-primary-light 
                                       transition-colors duration-500
                                       text-center">
                                {{ category.name }}
                            </span>
                        </div>
                    </router-link>
                </div>
            </div>

            <!-- 无搜索结果提示 -->
            <div v-if="Object.values(groupedCategories).every(group => group.length === 0)" class="text-center py-12">
                <p class="text-gray-600 dark:text-gray-400">
                    没有找到匹配的分类
                </p>
            </div>
        </template>
    </div>
</template>
<script setup lang="ts">
import {
    BookOpenIcon,
    UserGroupIcon,
    RocketLaunchIcon,
    EnvelopeIcon,
    MapPinIcon,
    GlobeAltIcon
} from '@heroicons/vue/24/outline'
</script>

<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- 标题区域 -->
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4 
                       animate-fade-in-up">
                关于我们
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto
                      animate-fade-in-up animation-delay-200">
                Reader Go 是一个致力于为读者提供优质阅读体验的开源小说分享平台
            </p>
        </div>

        <!-- 特色卡片 -->
        <div class="grid md:grid-cols-3 gap-8 mb-16 animate-fade-in-up animation-delay-400">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg 
                        hover:shadow-xl transition-all duration-300 
                        hover:scale-105 group">
                <div class="bg-primary/10 dark:bg-primary/20 rounded-full p-3 w-12 h-12 
                           mb-4 group-hover:scale-110 transition-transform">
                    <BookOpenIcon class="w-6 h-6 text-primary" />
                </div>
                <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    海量书籍
                </h3>
                <p class="text-gray-600 dark:text-gray-400">
                    提供丰富多样的小说资源，满足不同读者的阅读需求
                </p>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg 
                        hover:shadow-xl transition-all duration-300 
                        hover:scale-105 group">
                <div class="bg-primary/10 dark:bg-primary/20 rounded-full p-3 w-12 h-12 
                           mb-4 group-hover:scale-110 transition-transform">
                    <UserGroupIcon class="w-6 h-6 text-primary" />
                </div>
                <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    开放共享
                </h3>
                <p class="text-gray-600 dark:text-gray-400">
                    用户可以自由分享和下载喜爱的小说，共建阅读社区
                </p>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg 
                        hover:shadow-xl transition-all duration-300 
                        hover:scale-105 group">
                <div class="bg-primary/10 dark:bg-primary/20 rounded-full p-3 w-12 h-12 
                           mb-4 group-hover:scale-110 transition-transform">
                    <RocketLaunchIcon class="w-6 h-6 text-primary" />
                </div>
                <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    持续优化
                </h3>
                <p class="text-gray-600 dark:text-gray-400">
                    不断改进用户体验，提供更好的阅读服务
                </p>
            </div>
        </div>

        <!-- 联系信息 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg 
                    animate-fade-in-up animation-delay-600">
            <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                联系我们
            </h2>
            <div class="grid md:grid-cols-2 gap-6">
                <a href="mailto:i@447654.xyz" class="flex items-center space-x-3 p-4 rounded-lg
                          bg-gray-50 dark:bg-gray-700/50
                          hover:bg-gray-100 dark:hover:bg-gray-700
                          transition-colors duration-300">
                    <EnvelopeIcon class="w-6 h-6 text-primary" />
                    <span class="text-gray-600 dark:text-gray-300">i@447654.xyz</span>
                </a>

                <div class="flex items-center space-x-3 p-4 rounded-lg
                           bg-gray-50 dark:bg-gray-700/50">
                    <MapPinIcon class="w-6 h-6 text-primary" />
                    <span class="text-gray-600 dark:text-gray-300">香港,HuTu</span>
                </div>

                <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="flex items-center space-x-3 p-4 rounded-lg
                          bg-gray-50 dark:bg-gray-700/50
                          hover:bg-gray-100 dark:hover:bg-gray-700
                          transition-colors duration-300">
                    <GlobeAltIcon class="w-6 h-6 text-primary" />
                    <span class="text-gray-600 dark:text-gray-300">访问我们的 GitHub</span>
                </a>
            </div>
        </div>
    </div>
</template>

<style scoped>
.animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
    opacity: 0;
}

.animation-delay-200 {
    animation-delay: 0.2s;
}

.animation-delay-400 {
    animation-delay: 0.4s;
}

.animation-delay-600 {
    animation-delay: 0.6s;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
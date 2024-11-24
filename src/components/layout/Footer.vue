<template>
    <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div class="max-w-7xl mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8">
            <!-- 移动端布局优化 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                <!-- 网站信息 - 始终占满宽度 -->
                <div class="col-span-full md:col-span-1 space-y-4 group">
                    <div class="flex items-center justify-center sm:justify-start space-x-2">
                        <img src="@/assets/logo.png" alt="Logo"
                            class="w-8 h-8 transform transition-transform duration-300 group-hover:rotate-12" />
                        <span class="text-xl font-bold text-gray-900 dark:text-white 
                                   hover:text-primary dark:hover:text-primary-light 
                                   transition-colors duration-300">
                            Novel Share
                        </span>
                    </div>
                    <p class="text-center sm:text-left whitespace-normal sm:whitespace-nowrap">
                        分享你喜爱的小说，发现更多精彩故事
                    </p>
                </div>

                <!-- 移动端布局容器 -->
                <div class="col-span-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    <!-- 快速链接 -->
                    <div class="text-center sm:text-left">
                        <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4
                                 after:content-[''] after:block after:w-12 after:h-0.5 after:bg-primary/50 
                                 after:mx-auto sm:after:mx-0 after:mt-2">
                            快速链接
                        </h3>
                        <ul class="space-y-3">
                            <li>
                                <router-link to="/about" class="inline-flex items-center text-gray-600 dark:text-gray-400 
                                           hover:text-primary dark:hover:text-primary-light 
                                           transition-all duration-300 transform hover:translate-x-2
                                           hover:scale-105">
                                    <InformationCircleIcon class="w-5 h-5 mr-2" />
                                    关于我们
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/terms" class="inline-flex items-center text-gray-600 dark:text-gray-400 
                                           hover:text-primary dark:hover:text-primary-light 
                                           transition-all duration-300 transform hover:translate-x-2
                                           hover:scale-105">
                                    <DocumentTextIcon class="w-5 h-5 mr-2" />
                                    使用条款
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/privacy" class="inline-flex items-center text-gray-600 dark:text-gray-400 
                                           hover:text-primary dark:hover:text-primary-light 
                                           transition-all duration-300 transform hover:translate-x-2
                                           hover:scale-105">
                                    <ShieldCheckIcon class="w-5 h-5 mr-2" />
                                    隐私政策
                                </router-link>
                            </li>
                        </ul>
                    </div>

                    <!-- 联系方式 -->
                    <div class="text-center sm:text-left">
                        <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4
                                 after:content-[''] after:block after:w-12 after:h-0.5 after:bg-primary/50 
                                 after:mx-auto sm:after:mx-0 after:mt-2">
                            联系我们
                        </h3>
                        <ul class="space-y-3">
                            <li class="group flex items-center justify-center sm:justify-start space-x-2 
                                       text-gray-600 dark:text-gray-400 transition-all duration-300 
                                       hover:translate-x-2">
                                <EnvelopeIcon
                                    class="w-5 h-5 transform transition-transform duration-300 group-hover:scale-110" />
                                <span class="group-hover:text-primary dark:group-hover:text-primary-light">
                                    i@447654.xyz
                                </span>
                            </li>
                            <li class="group flex items-center justify-center sm:justify-start space-x-2 
                                       text-gray-600 dark:text-gray-400 transition-all duration-300 
                                       hover:translate-x-2">
                                <MapPinIcon
                                    class="w-5 h-5 transform transition-transform duration-300 group-hover:scale-110" />
                                <span class="group-hover:text-primary dark:group-hover:text-primary-light">
                                    香港,HuTu
                                </span>
                            </li>
                        </ul>
                    </div>

                    <!-- 社交媒体 - 移动端独占一行 -->
                    <div class="col-span-2 md:col-span-1 text-center sm:text-left">
                        <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4
                                 after:content-[''] after:block after:w-12 after:h-0.5 after:bg-primary/50 
                                 after:mx-auto sm:after:mx-0 after:mt-2">
                            关注我们
                        </h3>
                        <div class="flex justify-center sm:justify-start space-x-4">
                            <a href="#" class="group p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 
                                      transition-all duration-300 relative">
                                <!-- 添加悬停时的光晕效果 -->
                                <div class="absolute inset-0 bg-primary/20 dark:bg-primary-light/20 
                                            rounded-full blur opacity-0 group-hover:opacity-100 
                                            transition-opacity duration-300">
                                </div>
                                <!-- GitHub 图标 -->
                                <svg class="w-6 h-6 relative z-10 text-gray-600 dark:text-gray-400 
                                         group-hover:text-primary dark:group-hover:text-primary-light
                                         transform transition-all duration-300 group-hover:scale-110"
                                    fill="currentColor" viewBox="0 0 24 24">
                                    <path fill-rule="evenodd"
                                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                        clip-rule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 版权信息 - 添加移动端间距 -->
            <div class="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200 dark:border-gray-800">
                <p class="text-center text-sm md:text-base text-gray-500 dark:text-gray-400 
                          hover:text-primary dark:hover:text-primary-light
                          transition-colors duration-300 cursor-pointer">
                    © {{ new Date().getFullYear() }} Novel Share. All rights reserved.
                </p>
            </div>
        </div>
    </footer>
</template>

<script setup>
import {
    InformationCircleIcon,  // 关于我们
    DocumentTextIcon,       // 使用条款
    ShieldCheckIcon,       // 隐私政策
    EnvelopeIcon,
    MapPinIcon
} from '@heroicons/vue/24/outline'
</script>

<style scoped>
/* 添加移动端过渡动画 */
@media (max-width: 640px) {
    .grid {
        row-gap: 2rem;
    }

    /* 添加分隔线动画 */
    h3::after {
        transition: width 0.3s ease;
        width: 48px;
    }

    h3:hover::after {
        width: 64px;
    }
}

.link-ripple {
    position: relative;
    overflow: hidden;
}

.link-ripple::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(var(--primary-rgb), 0.3);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%);
    transform-origin: 50% 50%;
}

.link-ripple:hover::after {
    animation: ripple 1s ease-out;
}

@keyframes ripple {
    0% {
        transform: scale(0, 0);
        opacity: 0.5;
    }

    100% {
        transform: scale(20, 20);
        opacity: 0;
    }
}
</style>
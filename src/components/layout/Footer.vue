<template>
    <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <!-- 网站信息 -->
                <div class="space-y-4 group">
                    <div class="flex items-center space-x-2">
                        <img src="@/assets/logo.svg" alt="Logo"
                            class="w-8 h-8 transform transition-transform duration-300 group-hover:rotate-12" />
                        <span class="text-xl font-bold text-gray-900 dark:text-white 
                                   hover:text-primary dark:hover:text-primary-light 
                                   transition-colors duration-300">
                            Novel Share
                        </span>
                    </div>
                    <p class="text-gray-600 dark:text-gray-400 transform transition-all duration-300
                             hover:translate-x-2">
                        分享你喜爱的小说，发现更多精彩故事
                    </p>
                </div>

                <!-- 快速链接 -->
                <div>
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                        快速链接
                    </h3>
                    <ul class="space-y-3">
                        <li>
                            <router-link to="/about" class="inline-block text-gray-600 dark:text-gray-400 
                                       hover:text-primary dark:hover:text-primary-light 
                                       transition-all duration-300 transform hover:translate-x-2
                                       hover:scale-105">
                                关于我们
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/terms" class="inline-block text-gray-600 dark:text-gray-400 
                                       hover:text-primary dark:hover:text-primary-light 
                                       transition-all duration-300 transform hover:translate-x-2
                                       hover:scale-105">
                                使用条款
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/privacy" class="inline-block text-gray-600 dark:text-gray-400 
                                       hover:text-primary dark:hover:text-primary-light 
                                       transition-all duration-300 transform hover:translate-x-2
                                       hover:scale-105">
                                隐私政策
                            </router-link>
                        </li>
                    </ul>
                </div>

                <!-- 联系方式 -->
                <div>
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                        联系我们
                    </h3>
                    <ul class="space-y-3">
                        <li class="group flex items-center space-x-2 text-gray-600 dark:text-gray-400
                                   transition-all duration-300 hover:translate-x-2">
                            <svg class="w-5 h-5 transform transition-transform duration-300 group-hover:scale-110"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span class="group-hover:text-primary dark:group-hover:text-primary-light">
                                support@novelshare.com
                            </span>
                        </li>
                        <li class="group flex items-center space-x-2 text-gray-600 dark:text-gray-400
                                   transition-all duration-300 hover:translate-x-2">
                            <svg class="w-5 h-5 transform transition-transform duration-300 group-hover:scale-110"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span class="group-hover:text-primary dark:group-hover:text-primary-light">
                                中国，北京
                            </span>
                        </li>
                    </ul>
                </div>

                <!-- 社交媒体 -->
                <div>
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                        关注我们
                    </h3>
                    <div class="flex space-x-4">
                        <a href="#" class="group p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 
                                   transition-all duration-300">
                            <span class="sr-only">GitHub</span>
                            <svg class="w-6 h-6 text-gray-600 dark:text-gray-400 
                                      group-hover:text-primary dark:group-hover:text-primary-light
                                      transform transition-all duration-300 group-hover:scale-110" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path fill-rule="evenodd"
                                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                    clip-rule="evenodd" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <!-- 版权信息 -->
            <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                <p class="text-center text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light
                          transition-colors duration-300 cursor-pointer">
                    © {{ new Date().getFullYear() }} Novel Share. All rights reserved.
                </p>
            </div>
        </div>
    </footer>
</template>
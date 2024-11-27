<script setup lang="ts">
import {
    DocumentMagnifyingGlassIcon,
    CircleStackIcon,
    ShieldCheckIcon,
    FingerPrintIcon,
    CloudIcon,
    LockClosedIcon
} from '@heroicons/vue/24/outline'
</script>

<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- 标题区域 -->
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4 
                       animate-fade-in-up">
                隐私政策
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto
                      animate-fade-in-up animation-delay-200">
                我们重视您的隐私，并致力于保护您的个人信息
            </p>
        </div>

        <!-- 隐私政策内容 -->
        <div class="space-y-8 animate-fade-in-up animation-delay-400">
            <!-- 信息收集 -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg 
                        hover:shadow-xl transition-all duration-300 group">
                <div class="flex items-center space-x-4 mb-4">
                    <div class="bg-primary/10 dark:bg-primary/20 rounded-full p-3
                               group-hover:scale-110 transition-transform">
                        <DocumentMagnifyingGlassIcon class="w-6 h-6 text-primary" />
                    </div>
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                        1. 信息收集
                    </h2>
                </div>
                <div class="text-gray-600 dark:text-gray-400 ml-14 space-y-2">
                    <p>我们收集的信息包括：</p>
                    <ul class="list-disc ml-5 space-y-1">
                        <li>基本账户信息（用户名、邮箱等）</li>
                        <li>使用数据（访问记录、搜索历史等）</li>
                        <li>设备信息（浏览器类型、操作系统等）</li>
                        <li>Cookie 和类似技术收集的信息</li>
                    </ul>
                </div>
            </div>

            <!-- 信息使用 -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg 
                        hover:shadow-xl transition-all duration-300 group">
                <div class="flex items-center space-x-4 mb-4">
                    <div class="bg-primary/10 dark:bg-primary/20 rounded-full p-3
                               group-hover:scale-110 transition-transform">
                        <CircleStackIcon class="w-6 h-6 text-primary" />
                    </div>
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                        2. 信息使用
                    </h2>
                </div>
                <div class="text-gray-600 dark:text-gray-400 ml-14 space-y-2">
                    <p>我们使用收集的信息用于：</p>
                    <ul class="list-disc ml-5 space-y-1">
                        <li>提供和改进服务</li>
                        <li>个性化用户体验</li>
                        <li>发送服务通知</li>
                        <li>防止滥用和欺诈</li>
                    </ul>
                </div>
            </div>

            <!-- 信息保护 -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg 
                        hover:shadow-xl transition-all duration-300 group">
                <div class="flex items-center space-x-4 mb-4">
                    <div class="bg-primary/10 dark:bg-primary/20 rounded-full p-3
                               group-hover:scale-110 transition-transform">
                        <ShieldCheckIcon class="w-6 h-6 text-primary" />
                    </div>
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                        3. 信息保护
                    </h2>
                </div>
                <div class="text-gray-600 dark:text-gray-400 ml-14 space-y-2">
                    <p>我们采取以下措施保护您的信息：</p>
                    <ul class="list-disc ml-5 space-y-1">
                        <li>使用加密技术保护数据传输</li>
                        <li>定期安全审计</li>
                        <li>严格的访问控制</li>
                        <li>员工保密培训</li>
                    </ul>
                </div>
            </div>

            <!-- Cookie 使用 -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg 
                        hover:shadow-xl transition-all duration-300 group">
                <div class="flex items-center space-x-4 mb-4">
                    <div class="bg-primary/10 dark:bg-primary/20 rounded-full p-3
                               group-hover:scale-110 transition-transform">
                        <FingerPrintIcon class="w-6 h-6 text-primary" />
                    </div>
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                        4. Cookie 使用
                    </h2>
                </div>
                <p class="text-gray-600 dark:text-gray-400 ml-14">
                    我们使用 Cookie 和类似技术来提供更好的用户体验，包括记住您的偏好设置、
                    提供个性化内容等。您可以通过浏览器设置控制 Cookie。
                </p>
            </div>
        </div>

        <!-- 数据安全提示 -->
        <div class="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg
                    animate-fade-in-up animation-delay-600">
            <div class="flex items-center space-x-3 text-green-800 dark:text-green-200">
                <LockClosedIcon class="w-5 h-5 flex-shrink-0" />
                <p class="text-sm">
                    我们承诺采取一切合理措施保护您的个人信息安全。如有任何问题，请随时联系我们。
                </p>
            </div>
        </div>

        <!-- 更新提醒 -->
        <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg
                    animate-fade-in-up animation-delay-800">
            <div class="flex items-center space-x-3 text-blue-800 dark:text-blue-200">
                <CloudIcon class="w-5 h-5 flex-shrink-0" />
                <p class="text-sm">
                    本隐私政策可能会更新。更新时，我们会在网站上发布新版本并通知用户重要更改。
                </p>
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

.animation-delay-800 {
    animation-delay: 0.8s;
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
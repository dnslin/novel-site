<script setup lang="ts">
import {
    ClipboardDocumentCheckIcon,
    UserIcon,
    CogIcon,
    ExclamationTriangleIcon,
    DocumentTextIcon,
} from '@heroicons/vue/24/outline'
</script>

<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- 标题区域 -->
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4 
                       animate-fade-in-up">
                使用条款
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto
                      animate-fade-in-up animation-delay-200">
                请仔细阅读以下条款，使用我们的服务即表示您同意这些条款
            </p>
        </div>

        <!-- 条款内容 -->
        <div class="space-y-8 animate-fade-in-up animation-delay-400">
            <!-- 接受条款 -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg 
                        hover:shadow-xl transition-all duration-300 group">
                <div class="flex items-center space-x-4 mb-4">
                    <div class="bg-primary/10 dark:bg-primary/20 rounded-full p-3
                               group-hover:scale-110 transition-transform">
                        <ClipboardDocumentCheckIcon class="w-6 h-6 text-primary" />
                    </div>
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                        1. 接受条款
                    </h2>
                </div>
                <p class="text-gray-600 dark:text-gray-400 ml-14">
                    访问和使用 Reader Go 即表示您同意遵守这些条款。如果您不同意这些条款，
                    请勿使用我们的服务。我们保留随时更新这些条款的权利。
                </p>
            </div>

            <!-- 用户责任 -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg 
                        hover:shadow-xl transition-all duration-300 group">
                <div class="flex items-center space-x-4 mb-4">
                    <div class="bg-primary/10 dark:bg-primary/20 rounded-full p-3
                               group-hover:scale-110 transition-transform">
                        <UserIcon class="w-6 h-6 text-primary" />
                    </div>
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                        2. 用户责任
                    </h2>
                </div>
                <div class="text-gray-600 dark:text-gray-400 ml-14 space-y-2">
                    <p>用户在使用本平台时应：</p>
                    <ul class="list-disc ml-5 space-y-1">
                        <li>遵守相关法律法规</li>
                        <li>尊重他人的知识产权</li>
                        <li>维护良好的社区氛围</li>
                        <li>对自己的行为负责</li>
                    </ul>
                </div>
            </div>

            <!-- 内容规范 -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg 
                        hover:shadow-xl transition-all duration-300 group">
                <div class="flex items-center space-x-4 mb-4">
                    <div class="bg-primary/10 dark:bg-primary/20 rounded-full p-3
                               group-hover:scale-110 transition-transform">
                        <DocumentTextIcon class="w-6 h-6 text-primary" />
                    </div>
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                        3. 内容规范
                    </h2>
                </div>
                <div class="text-gray-600 dark:text-gray-400 ml-14 space-y-2">
                    <p>分享的内容必须：</p>
                    <ul class="list-disc ml-5 space-y-1">
                        <li>符合法律法规要求</li>
                        <li>不侵犯他人权益</li>
                        <li>内容真实可靠</li>
                        <li>遵守社区规范</li>
                    </ul>
                </div>
            </div>

            <!-- 服务变更 -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg 
                        hover:shadow-xl transition-all duration-300 group">
                <div class="flex items-center space-x-4 mb-4">
                    <div class="bg-primary/10 dark:bg-primary/20 rounded-full p-3
                               group-hover:scale-110 transition-transform">
                        <CogIcon class="w-6 h-6 text-primary" />
                    </div>
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                        4. 服务变更
                    </h2>
                </div>
                <p class="text-gray-600 dark:text-gray-400 ml-14">
                    我们保留随时修改或终止服务的权利，包括但不限于：添加新功能、移除现有功能、
                    调整服务内容等。重大变更将提前通知用户。
                </p>
            </div>
        </div>

        <!-- 免责声明 -->
        <div class="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg
                    animate-fade-in-up animation-delay-600">
            <div class="flex items-center space-x-3 text-yellow-800 dark:text-yellow-200">
                <ExclamationTriangleIcon class="w-5 h-5 flex-shrink-0" />
                <p class="text-sm">
                    本条款最终解释权归 Reader Go 所有。如有疑问，请联系我们的支持团队。
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
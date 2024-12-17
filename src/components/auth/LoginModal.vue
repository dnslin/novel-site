<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { XMarkIcon, EnvelopeIcon, LockClosedIcon, ArrowRightIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import { useAuth } from '@/composables/useAuth'

const emit = defineEmits(['close'])

const form = ref({
    username: '',
    password: ''
})

const { isLoading, usernameError, validateUsername, login } = useAuth()

// 添加表单验证
const errors = ref({
    username: '',
    password: ''
})

const validatePassword = () => {
    if (!form.value.password) {
        errors.value.password = '请输入密码'
    } else if (form.value.password.length < 6) {
        errors.value.password = '密码长度不能小于6位'
    } else {
        errors.value.password = ''
    }
}

const handleSubmit = async () => {
    validatePassword()
    if (await login(form.value)) {
        emit('close')
    }
}

const handleForgotPassword = () => {
    console.log('忘记密码')
}

// 添加键盘事件处理
const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
        emit('close')
    }
}

const showPassword = ref(false)

onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        @click.self="emit('close')">
        <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md relative
                    transform transition-all duration-300 scale-100 opacity-100
                    animate-modal-in">
            <!-- 关闭按钮 -->
            <button @click="emit('close')" class="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                       transition-all duration-300 hover:rotate-90">
                <XMarkIcon class="w-6 h-6" />
            </button>

            <div class="p-6 sm:p-8">
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">登录</h2>
                    <div class="h-1 w-20 bg-[#9affff] rounded mt-2 animate-pulse-custom"></div>
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div class="relative group">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">用户名</label>
                        <div class="relative">
                            <EnvelopeIcon
                                class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 
                                          text-gray-400 group-focus-within:text-[#70afaf] transition-colors duration-200" />
                            <input type="text" v-model="form.username" @blur="() => validateUsername(form.username)"
                                autocomplete="username" :class="{ 'border-red-500 focus:ring-red-500': usernameError }"
                                required class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                                       text-gray-900 dark:text-white
                                       bg-white dark:bg-gray-700
                                       focus:ring-2 focus:ring-[#70afaf] dark:focus:ring-[#70afaf]
                                       focus:border-transparent
                                       transition-all duration-200">
                        </div>
                        <p v-if="usernameError" class="mt-1 text-sm text-red-500 animate-shake">{{ usernameError }}</p>
                    </div>

                    <div class="relative group">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">密码</label>
                        <div class="relative">
                            <LockClosedIcon
                                class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 
                                           text-gray-400 group-focus-within:text-[#70afaf] transition-colors duration-200" />
                            <input :type="showPassword ? 'text' : 'password'" v-model="form.password" required class="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                                       text-gray-900 dark:text-white
                                       bg-white dark:bg-gray-700
                                       focus:ring-2 focus:ring-[#70afaf] dark:focus:ring-[#70afaf]
                                       focus:border-transparent
                                       transition-all duration-200">
                            <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 transform -translate-y-1/2
                                       text-gray-400 hover:text-gray-600 transition-colors duration-200">
                                <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                                <EyeSlashIcon v-else class="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <button type="button" @click="handleForgotPassword" class="text-sm text-[#70afaf] hover:text-[#8FF0FC] 
                                   transition-colors duration-200 group flex items-center space-x-1">
                            <span>忘记密码？</span>
                            <ArrowRightIcon
                                class="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                        </button>
                    </div>


                    <button type="submit" :disabled="isLoading" class="w-full py-2 px-4 bg-[#9affff] hover:bg-[#58e9e9]
                               text-gray-800 font-medium rounded-md
                               transform hover:-translate-y-0.5 active:translate-y-0
                               transition-all duration-200 relative
                               disabled:opacity-50 disabled:cursor-not-allowed
                               group overflow-hidden">
                        <span class="relative z-10 flex items-center justify-center space-x-2">
                            <span>登录</span>
                            <div v-if="isLoading"
                                class="animate-spin rounded-full h-4 w-4 border-2 border-gray-800 border-t-transparent">
                            </div>
                        </span>
                        <div
                            class="absolute inset-0 h-full w-0 bg-[#58e9e9] transition-all duration-300 group-hover:w-full">
                        </div>
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes modalIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes pulseCustom {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

.animate-modal-in {
    animation: modalIn 0.3s ease-out;
}

.animate-pulse-custom {
    animation: pulseCustom 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-4px);
    }

    75% {
        transform: translateX(4px);
    }
}

.animate-shake {
    animation: shake 0.3s ease-in-out;
}
</style>
<script setup lang="ts">
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
</script>

<template>
  <!-- 使用 Header 组件 -->
  <Header />

  <!-- 主要内容区域 -->
  <main class="min-h-screen pt-16">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>

  <!-- 使用 Footer 组件 -->
  <Footer />
</template>

<style>
/* 全局样式 */
body {
  @apply antialiased text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 滚动条样式 */
* {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

*::-webkit-scrollbar {
  display: none;
}
</style>

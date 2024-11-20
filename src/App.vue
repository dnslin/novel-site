<script setup lang="ts">
// 不需要引入 Home 组件
</script>

<template>
  <router-view v-slot="{ Component }">
    <!-- 添加过渡动画 -->
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style>
/* 全局样式 */
body {
  @apply antialiased text-gray-800;
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
</style>

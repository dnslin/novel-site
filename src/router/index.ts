import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "/books/:id",
      name: "book-detail",
      component: () => import("@/views/BookDetail.vue"),
    },
    {
      path: "/categories",
      name: "categories",
      component: () => import("@/views/Categories.vue"),
    },
    {
      path: "/category/:id(\\d+)",
      name: "category-detail",
      component: () => import("@/views/CategoryDetail.vue"),
    },
    {
      path: "/latest",
      name: "latest",
      component: () => import("@/views/Latest.vue"),
    },
    {
      path: "/popular",
      name: "popular",
      component: () => import("@/views/Popular.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("@/views/About.vue"),
    },
    {
      path: "/terms",
      name: "terms",
      component: () => import("@/views/Terms.vue"),
    },
    {
      path: "/privacy",
      name: "privacy",
      component: () => import("@/views/Privacy.vue"),
    },
    {
      path: "/ranking",
      name: "ranking",
      component: () => import("@/views/Ranking.vue"),
    },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  },
});

export default router;

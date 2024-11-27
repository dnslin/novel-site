import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import BookDetail from "../views/BookDetail.vue";
import Categories from "../views/Categories.vue";
import CategoryDetail from "../views/CategoryDetail.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/books/:id",
      name: "book-detail",
      component: BookDetail,
    },
    {
      path: "/categories",
      name: "categories",
      component: Categories,
    },
    {
      path: "/category/:name",
      name: "category-detail",
      component: CategoryDetail,
    },
    {
      path: "/latest",
      name: "latest",
      component: () => import("../views/Latest.vue"),
    },
    {
      path: "/popular",
      name: "popular",
      component: () => import("../views/Popular.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/About.vue"),
    },
    {
      path: "/terms",
      name: "terms",
      component: () => import("../views/Terms.vue"),
    },
    {
      path: "/privacy",
      name: "privacy",
      component: () => import("../views/Privacy.vue"),
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

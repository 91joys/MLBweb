import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CardIntro from "../views/CardIntro.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/main",
      name: "main",
      component: () => import("../views/MainView.vue"),
    },
    {
      path: "/card",
      name: "card",
      component: CardIntro,
    },
  ],
});

export default router;

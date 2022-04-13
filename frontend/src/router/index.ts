import { createRouter, createWebHistory } from "vue-router";
import LandingView from "../views/LandingView.vue";
import PlayView from "../views/PlayView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "landing",
      component: LandingView,
    },
    {
      path: "/play/:id",
      name: "play",
      component: PlayView,
      props: true,
    },
  ],
});

export default router;

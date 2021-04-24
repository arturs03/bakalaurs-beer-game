import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/Home.vue";
import Wholesaler from "@/views/Wholesaler.vue";
import NotFound from "@/views/NotFound.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/wholesaler",
    name: "wholesaler",
    props: true,
    component: Wholesaler,
  },
  {
    path: "/:catchAll(.*)",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
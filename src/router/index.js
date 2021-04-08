import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/Home.vue";
import Manufacturer from "@/views/Manufacturer.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/manufacturer",
    name: "Manufacturer",
    component: Manufacturer,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
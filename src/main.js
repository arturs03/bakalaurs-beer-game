import { createApp } from "vue";
import Home from "@/views/Home.vue";
import router from "@/router/index.js";
import "bootstrap/dist/css/bootstrap.css";

createApp(Home).use(router).mount("#home");

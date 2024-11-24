import { createApp } from "vue";
import { createPinia } from "pinia";
import "./index.css";
import App from "./App.vue";
import router from "./router";
import "animate.css";
import "./styles/global.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.mount("#app");

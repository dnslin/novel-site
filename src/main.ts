import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import Toast, { type PluginOptions, POSITION } from "vue-toastification";
// Import the CSS
import "vue-toastification/dist/index.css";
import "./index.css";
import App from "./App.vue";
import router from "./router";
import "animate.css";
import "./styles/global.css";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// Toast Configuration
const toastOptions: PluginOptions = {
  maxToasts: 3,
  newestOnTop: true,
  position: POSITION.TOP_RIGHT,
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: true,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
  transition: "Vue-Toastification__bounce",
};

app.use(Toast, toastOptions);
app.use(pinia);
app.use(router);
app.mount("#app");

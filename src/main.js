import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router";
import store from "./store/store";
import "@/assets/styles.scss";

const app = createApp(App);
app.config.globalProperties.$filters = {
  priceFormat(value) {
    return new Intl.NumberFormat().format(value);
  },
};

app.use(router).use(store).mount("#app");

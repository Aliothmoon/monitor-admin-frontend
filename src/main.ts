import { createApp } from "vue";
import ArcoVue from "@arco-design/web-vue";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
import "@arco-design/web-vue/dist/arco.css";
import globalComponents from "@/components";
import router from "./router";
import store from "./store";
import i18n from "./locale";
import directive from "./directive";
import App from "./App.vue";

import "@/assets/style/global.less";
import "@/api/interceptor";

import "@/tailwind.css";
import { setupLogInterceptors } from "@/utils/log-interceptor";

const app = createApp(App);

app.use(ArcoVue, {});
app.use(ArcoVueIcon);

app.use(router);
app.use(store);
app.use(i18n);
app.use(globalComponents);
app.use(directive);

// setupLogInterceptors();

app.mount("#app");

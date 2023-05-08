import { createApp } from "vue";
import App from "./App.vue";
import JdRow from "../src/index.js";

const app = createApp(App)

app.use(JdRow).mount("#app");

// 监听卸载操作
window.addEventListener('unmount', function () {
  app.unmount()
})

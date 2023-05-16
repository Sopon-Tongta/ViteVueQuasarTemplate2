import { createApp } from "vue";
import { createPinia } from "pinia";
import { Quasar, Loading, Notify } from "quasar";
import "quasar/src/css/index.sass";
import App from "./App.vue";
import router from "./router";
import "@/css/main.scss";
import DatefieldVue from "../src/components/utils/Datefield.vue";
import SelectfieldVue from "../src/components/utils/Selectfield.vue";
import SelectfieldMultiVue from "../src/components/utils/SelectfieldMulti.vue";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(Quasar, {
  plugins: { Loading, Notify }, // import Quasar plugins and add here
});
app
  .component("Datefield", DatefieldVue)
  .component("SelectField", SelectfieldVue)
  .component("SelectFieldMulti", SelectfieldMultiVue);
app.mount("#app");

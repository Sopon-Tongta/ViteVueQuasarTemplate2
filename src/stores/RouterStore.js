import { reactive } from "vue";
import { defineStore } from "pinia";

const useRouterStore = defineStore("Router", () => {
  const router_params = reactive({});

  const getRouterParams = () => {
    let sessionParams = sessionStorage.getItem("inventory_params");
    sessionParams = sessionParams == null ? "{}" : sessionParams;
    const objParams = JSON.parse(sessionParams);
    const paramList = Object.keys(objParams);
    paramList.forEach((paramName) => {
      router_params[paramName] = objParams[paramName];
    });
  };

  return { router_params, getRouterParams };
});

export { useRouterStore };

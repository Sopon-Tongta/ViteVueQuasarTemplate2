const routes = [
  {
    path: "/",
    component: () => import("@/layouts/MainLayout.vue"),
    children: [
      {
        path: "/",
        name: "index",
        component: () => import("@/pages/IndexPage.vue"),
      },
      {
        path: "/goodsReceipt",
        name: "goodsReceipt",
        component: () => import("@/pages/GoodsReceipt/GoodsReceipt.vue"),
      },
      {
        path: "/editReceiveOrder",
        name: "editReceiveOrder",
        component: () => import("@/pages/GoodsReceipt/EditReceiveOrder.vue"),
      },
      {
        path: "/:catchAll(.*)*",
        component: () => import("@/pages/ErrorNotFound.vue"),
      },
    ],
  },
];

export default routes;

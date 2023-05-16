import { ref } from "vue";

const useMenu = () => {
  const listMenu = ref([]);
  const getMenu = () => {
    listMenu.value = [
      {
        menuId: 1,
        parentId: 0,
        label: "หน้าหลัก",
        name: "index",
        path: "/",
        clickable: true,
        disable: false,
        childMenu: true,
        childItem: [
          {
            menuId: 2,
            parentId: 1,
            label: "Goods Recept",
            name: "goodsReceipt",
            path: "/goodsReceipt",
            clickable: true,
            disable: false,
            childMenu: false,
            childItem: [
              {
                menuId: 11,
                parentId: 2,
                label: "Create Receive Order",
                name: "createReceiveOrder",
                path: "/",
                clickable: true,
                disable: false,
                childMenu: false,
              },
              {
                menuId: 12,
                parentId: 2,
                label: "Edit Receive Order",
                name: "editReceiveOrder",
                path: "/",
                clickable: true,
                disable: false,
                childMenu: false,
              },
            ],
          },
          {
            menuId: 3,
            parentId: 1,
            label: "Transfer IN",
            name: "index",
            path: "/",
            clickable: true,
            disable: false,
            childMenu: false,
            childItem: [],
          },
          {
            menuId: 4,
            parentId: 1,
            label: "Transfer Out",
            name: "index",
            path: "/",
            clickable: true,
            disable: false,
            childMenu: false,
            childItem: [],
          },
          {
            menuId: 5,
            parentId: 1,
            label: "Master",
            name: "index",
            path: "/",
            clickable: true,
            disable: false,
            childMenu: true,
            childItem: [
              {
                menuId: 7,
                parentId: 5,
                label: "Location",
                name: "index",
                path: "/",
                clickable: true,
                disable: false,
                childMenu: false,
                childItem: [
                  {
                    menuId: 10,
                    parentId: 7,
                    label: "LocationEdit",
                    name: "index",
                    path: "/",
                    clickable: true,
                    disable: false,
                    childMenu: false,
                  },
                ],
              },
              {
                menuId: 8,
                parentId: 5,
                label: "Vehicle",
                name: "index",
                path: "/",
                clickable: true,
                disable: false,
                childMenu: false,
              },
              {
                menuId: 9,
                parentId: 5,
                label: "Customer",
                name: "index",
                path: "/",
                clickable: false,
                disable: true,
                childMenu: false,
              },
            ],
          },
          {
            menuId: 6,
            parentId: 1,
            label: "About",
            name: "index",
            path: "/",
            clickable: true,
            disable: false,
            childMenu: false,
            childItem: [],
          },
        ],
      },
    ];
  };
  return { listMenu, getMenu };
};

export default { useMenu };

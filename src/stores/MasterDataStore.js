import { ref } from "vue";
import { defineStore } from "pinia";
// import useUtilHook from "../hooks/useUtil";

const useMasterDataStore = defineStore("MasterData", () => {
  // const {
  //   ownerMaster,
  //   orderTypeMaster,
  //   supplierMaster,
  //   whMaster,
  //   getOwnerMaster,
  //   getOrderTypeMaster,
  //   getSupplierMaster,
  //   getWHMaster,
  // } = useUtilHook.useUtil();

  const ownerList = ref([]);
  const orderTypeList = ref([]);
  const supplierList = ref([]);
  const wareHouseList = ref([]);

  const getMaster = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(); //Test
      }, 1000);
    });
    // await getOwnerMaster();
    // await getOrderTypeMaster();
    // await getSupplierMaster();
    // await getWHMaster();
    // ownerList.value = ownerMaster.value.map((data) => {
    //   return {
    //     label: data.ownername,
    //     value: data.ownercode,
    //   };
    // });
    // orderTypeList.value = orderTypeMaster.value.map((data) => {
    //   return {
    //     label: data.value,
    //     value: data.value,
    //     group: data.group,
    //   };
    // });
    // supplierList.value = supplierMaster.value.map((data) => {
    //   return {
    //     label: "".concat("[", data.SupCode, "]", " ", data.SupName),
    //     value: data.SupCode,
    //     itemName: data.SupName,
    //   };
    // });
    // wareHouseList.value = whMaster.value.map((data) => {
    //   return {
    //     label: data.WhName,
    //     value: data.WhCode,
    //   };
    // });
  };
  return { ownerList, orderTypeList, supplierList, wareHouseList, getMaster };
});

export { useMasterDataStore };

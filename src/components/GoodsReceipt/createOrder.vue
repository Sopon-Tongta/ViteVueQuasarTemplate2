<template>
  <q-card class="popup-form goods-receipt-create-order">
    <q-card-section class="section-header">
      <div class="popup-title">Create Order</div>
    </q-card-section>
    <q-card-section class="section-body bg-white">
      <div class="form-component">
        <div class="popup-label">Reference No<span class="text-red-14">*</span></div>
        <q-input outlined dense clearable v-model="referenceNo" placeholder="กรอกข้อมูล" />
      </div>
      <div class="form-component">
        <div class="popup-label">Owner<span class="text-red-14">*</span></div>
        <SelectField
          :list="ownerList"
          :value="ownerCode"
          placeholder="เลือกข้อมูล"
          @onSelect="(label, val) => (ownerCode = val)"
        />
      </div>
      <div class="form-component">
        <div class="popup-label">Supplier<span class="text-red-14">*</span></div>
        <SelectField
          :list="supplierList"
          :value="supplierCode"
          placeholder="เลือกข้อมูล"
          @onSelect="(label, val) => (supplierCode = val)"
        />
      </div>
      <div class="form-component">
        <div class="popup-label">Order Type<span class="text-red-14">*</span></div>
        <SelectField
          :list="orderTypeGaneralList"
          :value="orderType"
          placeholder="เลือกข้อมูล"
          @onSelect="(label, val) => (orderType = val)"
        />
      </div>
      <div class="form-component">
        <div class="popup-label">Warehouse<span class="text-red-14">*</span></div>
        <SelectField
          :list="wareHouseList"
          :value="warehouse"
          placeholder="เลือกข้อมูล"
          @onSelect="(label, val) => (warehouse = val)"
        />
      </div>
      <div class="form-component">
        <div class="popup-label">Doc Date<span class="text-red-14">*</span></div>
        <DateField :value="docDate" @onUpdate="(value) => (docDate = value)" />
      </div>
      <div class="form-component">
        <div class="popup-label">Receiving Date<span class="text-red-14">*</span></div>
        <DateField :value="receiveDate" @onUpdate="(value) => (receiveDate = value)" />
      </div>
    </q-card-section>
    <q-card-actions>
      <q-btn outline color="red" label="Cancel" size="sm" v-close-popup no-caps />
      <q-btn
        unelevated
        color="theme-color"
        label="Confirm"
        size="sm"
        @click="confirmCreateReceiveOrder"
        no-caps
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import useUtilHook from "../../hooks/useUtil";
import { useMasterDataStore } from "../../stores/MasterDataStore";
export default defineComponent({
  emits: ["onCreate"],
  setup(props, { emit }) {
    const masterStore = useMasterDataStore();
    const { ownerList, orderTypeList, supplierList, wareHouseList } = storeToRefs(masterStore);
    const { formatDate_DDMMYYYY } = useUtilHook.useUtil();
    const referenceNo = ref("");
    const ownerCode = ref("");
    const supplierCode = ref("");
    const orderType = ref("");
    const warehouse = ref("");
    const docDate = ref(formatDate_DDMMYYYY(Date.now()));
    const receiveDate = ref(formatDate_DDMMYYYY(Date.now()));

    const confirmCreateReceiveOrder = () => {
      let params = {
        referenceNo: referenceNo.value,
        ownerCode: ownerCode.value,
        supplierCode: supplierCode.value,
        orderType: orderType.value,
        warehouse: warehouse.value,
        docDate: docDate.value,
        receiveDate: receiveDate.value,
      };
      emit("onCreate", params);
    };

    const orderTypeGaneralList = ref([]);
    const getOrderTypeGaneral = () => {
      orderTypeGaneralList.value = orderTypeList.value.filter((f) => f.group === "GENERAL");
    };
    onMounted(getOrderTypeGaneral);

    return {
      ownerList,
      orderTypeGaneralList,
      supplierList,
      wareHouseList,
      referenceNo,
      ownerCode,
      supplierCode,
      orderType,
      warehouse,
      docDate,
      receiveDate,
      confirmCreateReceiveOrder,
    };
  },
});
</script>

<style lang="scss">
.goods-receipt-create-order {
  .form-component {
    margin-bottom: 10px;
    width: 300px;
  }
}
</style>

<template>
  <q-dialog v-model="criteriaSearchShow" no-backdrop-dismiss>
    <q-card class="popup-form goods-receipt-popup-search" :style="dragProps.dragStyle">
      <q-card-section class="section-header" v-touch-pan.mouse="onPan">
        <div class="popup-title flex justify-between">
          Search Order
          <q-btn flat round color="white" size="sm" icon="close" v-close-popup />
        </div>
      </q-card-section>
      <q-card-section class="section-body bg-white">
        <div class="form-component">
          <div class="popup-label">Reference No.</div>
          <q-input
            outlined
            clearable
            class="form-ui"
            v-model="searchRefNo"
            @clear="searchRefNo = ''"
            placeholder="กรอกข้อมูล"
          />
        </div>
        <div class="form-component">
          <div class="popup-label">Receipt No.</div>
          <q-input
            outlined
            clearable
            class="form-ui"
            v-model="searchReceiptNo"
            @clear="searchReceiptNo = ''"
            placeholder="กรอกข้อมูล"
          />
        </div>
        <div class="form-component">
          <div class="popup-label">Owner</div>
          <SelectField
            class="form-ui select-ui"
            :list="ownerList"
            :value="searchOwner"
            placeholder="- เลือก -"
            @onSelect="(label, val) => (searchOwner = val)"
          />
        </div>
        <div class="form-component">
          <div class="popup-label">Order Type</div>
          <SelectField
            class="form-ui select-ui"
            :list="orderTypeGaneralList"
            :value="searchOrderType"
            placeholder="- เลือก -"
            @onSelect="(label, val) => (searchOrderType = val)"
          />
        </div>
      </q-card-section>
      <q-card-actions align="center" class="from-action">
        <q-btn
          outline
          color="red"
          label="Clear"
          size="12px"
          @click="onClearCriteriaSearch"
          no-caps
        />
        <q-btn
          unelevated
          color="theme-color"
          label="Search"
          size="12px"
          @click="searchData"
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="popupCreateOrderShow" persistent>
    <CreateReceiptOrder @onCreate="onCreateReceiveOrder" />
  </q-dialog>
  <div class="goods-receipt">
    <div class="top-panel box-main-title">
      <span class="text-main-title text-theme-color">Goods Receipt</span>
      <q-btn
        size="sm"
        color="theme-color"
        label="Create"
        class="q-ml-md"
        @click="onPopupCreateOrder"
        no-caps
      />
      <q-space />
      <q-btn size="sm" color="theme-color" icon="search" class="btn-icon" @click="onDialogSearch" />
      <SelectField
        class="select-ui"
        :search="false"
        :clearable="false"
        :list="statusList"
        :value="searchStatus"
        @onSelect="onSearchStatus"
      />
    </div>
    <div class="box-table-no-header-detail">
      <q-table
        table-class="gr-sticky-header-table"
        :rows="rows"
        :columns="columns"
        row-key="receiptNo"
        :pagination="pagination"
        hide-pagination
        flat
        bordered
        dense
        :loading="loading"
      >
        <template v-slot:loading>
          <q-inner-loading showing color="theme-color" />
        </template>
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div
                v-if="col.name == 'receiptNo'"
                @click="onEditGoodsReceipt(props.row)"
                class="link-goto"
              >
                {{ col.value }}
              </div>
              <div v-else>{{ col.value }}</div>
            </q-td>
          </q-tr>
        </template>
        <template v-slot:bottom>
          <span class="pagination-banner">
            {{ itemFirstPage }}-{{ itemFinalPage }} of {{ itemCount }}
          </span>
          <q-space />
          <q-pagination
            v-model="pagination.page"
            color="theme-color"
            :max="pageMax"
            :max-pages="6"
            direction-links
            boundary-links
            size="12px"
            @update:model-value="searchData"
          />
        </template>
      </q-table>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, onMounted, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useMasterDataStore } from "../../stores/MasterDataStore";
import useGoodsReceipt from "../../hooks/useGoodsReceipt";
import CreateReceiptOrder from "../../components/GoodsReceipt/createOrder.vue";
export default defineComponent({
  name: "goodsReceipt",
  emits: ["onRedirect", "alert", "showLoading", "hideLoading"],
  components: {
    CreateReceiptOrder,
  },
  setup(props, ctx) {
    const masterStore = useMasterDataStore();
    const { ownerList, orderTypeList } = storeToRefs(masterStore);
    const { receiveOrderList, receiveOrderTotal, saveReceiveOrder, searchReceiveOrder } =
      useGoodsReceipt.useReceiveOrder();

    const statusList = ref([
      { label: "All Status", value: "all" },
      { label: "New", value: "new" },
      { label: "Check In", value: "checkin" },
      { label: "Put Away", value: "putaway" },
      { label: "Closed", value: "closed" },
    ]);
    const criteriaSearchShow = ref(false);
    const popupCreateOrderShow = ref(false);
    const itemCount = ref(receiveOrderTotal);
    const itemFirstPage = ref(0);
    const itemFinalPage = ref(0);
    const pagination = ref({
      sortBy: "desc",
      descending: false,
      page: 1,
      rowsPerPage: 20,
    });
    const pageMax = computed(() => Math.ceil(itemCount.value / pagination.value.rowsPerPage));
    const createColumns = [
      {
        name: "receiptNo",
        label: "Receipt No",
        align: "left",
        field: "receiptNo",
      },
      {
        name: "ownerCode",
        label: "Owner",
        align: "left",
        field: "ownerCode",
      },
      {
        name: "referenceNo",
        label: "Reference No",
        align: "left",
        field: "referenceNo",
      },
      {
        name: "orderType",
        label: "Order Type",
        align: "left",
        field: "orderType",
      },
      {
        name: "warehouse",
        label: "W/H",
        align: "left",
        field: "whCodeSource",
      },
      {
        name: "docDate",
        label: "Doc Date",
        align: "left",
        field: "docDate",
      },
      {
        name: "receiptDate",
        label: "Receipt Date",
        align: "left",
        field: "receiptDate",
      },
      {
        name: "status",
        label: "Status",
        align: "left",
        field: "status",
        style: (row) => {
          let css = "";
          switch (row.status.toLowerCase()) {
            case "new":
              css = "color: #1269bf;";
              break;
            case "putaway":
              css = "color: #6e07d4;";
              break;
            case "partial putaway":
              css = "color: #ecaf02;";
              break;
            case "checkin":
              css = "color: #ecaf02;";
              break;
            case "partial checkin":
              css = "color: #ecaf02;";
              break;
            case "closed":
              css = "color: #707070;";
              break;
          }
          return css + "font-weight: bold;";
        },
      },
    ];
    const showLoading = () => ctx.emit("showLoading");
    const hideLoading = () => ctx.emit("hideLoading");

    const loading = ref(false);
    const searchStatus = ref("all");
    const searchRefNo = ref("");
    const searchReceiptNo = ref("");
    const searchOwner = ref("");
    const searchOrderType = ref("");
    const searchData = () => {
      loading.value = true;
      searchReceiveOrder(
        searchStatus.value,
        searchRefNo.value,
        searchReceiptNo.value,
        searchOwner.value,
        searchOrderType.value,
        pagination.value.page,
        pagination.value.rowsPerPage,
        (result) => {
          if (result.error != undefined) {
            ctx.emit("alert", result.error.Message, "error");
          }
        }
      );
    };

    watch(receiveOrderList, () => {
      let page = pagination.value.page;
      let pageSize = pagination.value.rowsPerPage;
      let finalPage = page * pageSize;
      let firstPage = finalPage - (pageSize - 1);
      finalPage = finalPage > itemCount.value ? itemCount.value : finalPage;
      itemFinalPage.value = finalPage;
      itemFirstPage.value = firstPage;
      loading.value = false;
    });

    const onSearchStatus = (_label, val) => {
      searchStatus.value = val;
      searchData();
    };

    const onClearCriteriaSearch = () => {
      searchRefNo.value = "";
      searchReceiptNo.value = "";
      searchOwner.value = "";
      searchOrderType.value = "";
      searchData();
    };

    const onEditGoodsReceipt = (row) => {
      ctx.emit("onRedirect", "editReceiveOrder", row);
    };

    const onPopupCreateOrder = () => {
      popupCreateOrderShow.value = true;
    };

    const onCreateReceiveOrder = (order) => {
      if (order.referenceNo.length == 0) {
        ctx.emit("alert", "โปรดระบุ Reference No", "warning");
        return;
      }
      if (order.ownerCode.length == 0) {
        ctx.emit("alert", "โปรดระบุ Owner", "warning");
        return;
      }
      if (order.supplierCode.length == 0) {
        ctx.emit("alert", "โปรดระบุ Supplier", "warning");
        return;
      }
      if (order.orderType.length == 0) {
        ctx.emit("alert", "โปรดระบุ Order Type", "warning");
        return;
      }
      if (order.warehouse.length == 0) {
        ctx.emit("alert", "โปรดระบุ Warehouse", "warning");
        return;
      }
      if (order.docDate.length == 0) {
        ctx.emit("alert", "โปรดระบุ Doc Date", "warning");
        return;
      }
      if (order.receiveDate.length == 0) {
        ctx.emit("alert", "โปรดระบุ Receive Date", "warning");
        return;
      }

      showLoading();
      saveReceiveOrder(order, (result) => {
        if (result.error != undefined) {
          hideLoading();
          ctx.emit("alert", result.error.Message, "error");
          return;
        }
        popupCreateOrderShow.value = false;
        ctx.emit("onRedirect", "editGoodsReceipt", result.receiptOrder);
      });
    };

    const dragProps = ref({
      dialogPosX: 0,
      dialogPosY: 0,
      dragStyle: "",
    });
    const onPan = (evt) => {
      dragProps.value.dialogPosX += evt.delta.x;
      dragProps.value.dialogPosY += evt.delta.y;
      dragProps.value.dragStyle = `transform: translate(${dragProps.value.dialogPosX}px, ${dragProps.value.dialogPosY}px)`;
    };

    const onDialogSearch = () => {
      criteriaSearchShow.value = true;
      dragProps.value = {
        dialogPosX: 0,
        dialogPosY: 0,
        dragStyle: "",
      };
    };

    const orderTypeGaneralList = ref([]);
    const getOrderTypeGaneral = () => {
      orderTypeGaneralList.value = orderTypeList.value.filter((f) => f.group === "GENERAL");
    };
    watch(orderTypeList, getOrderTypeGaneral);

    onMounted(() => {
      getOrderTypeGaneral();
      searchData();
    });

    return {
      ownerList,
      orderTypeGaneralList,
      searchStatus,
      searchOwner,
      searchOrderType,
      searchRefNo,
      searchReceiptNo,
      statusList,
      searchData,
      onSearchStatus,
      onPopupCreateOrder,
      onCreateReceiveOrder,
      itemCount,
      itemFirstPage,
      itemFinalPage,
      pagination,
      columns: createColumns,
      rows: receiveOrderList,
      pageMax,
      loading,
      criteriaSearchShow,
      onClearCriteriaSearch,
      popupCreateOrderShow,
      onEditGoodsReceipt,
      onPan,
      dragProps,
      onDialogSearch,
    };
  },
});
</script>

<style lang="scss">
.goods-receipt {
  .top-panel {
    display: flex;
    align-items: center;

    .select-ui {
      width: 150px;
      margin-left: 20px;
    }
  }
}
.goods-receipt-popup-search {
  .form-component {
    margin-bottom: 10px;
    width: 300px;
  }
}
</style>

<template>
  <div class="q-pa-md form">
    <div class="form-title">ข้อมูล Receive Order</div>
    <div class="form-contant">
      <div class="form-row">
        <div class="col-1">
          <div class="form-component">
            <div class="form-label">Receive No.<span class="req">*</span></div>
            <q-input outlined dense clearable class="form-ui" v-model="receiptNo" />
          </div>
        </div>
        <div class="col-1">
          <div class="form-component">
            <div class="form-label">Ref No.<span class="req">*</span></div>
            <q-input outlined dense clearable class="form-ui" v-model="refNo" />
          </div>
        </div>
        <div class="col-1">
          <div class="form-component">
            <div class="form-label">Doc Date.<span class="req">*</span></div>
            <Datefield class="form-ui" :value="docDate" @onUpdate="docDateOnUpdate" />
          </div>
        </div>
      </div>
      <div class="form-row">
        <div class="col-1">
          <div class="form-component">
            <div class="form-label">Owner. <span class="req">*</span></div>
            <q-select
              outlined
              dense
              options-dense
              clearable
              class="form-ui"
              v-model="owner"
              :options="ownerList"
            />
          </div>
        </div>
        <div class="col-1">
          <div class="form-component">
            <div class="form-label">Order Type. <span class="req">*</span></div>
            <q-select
              outlined
              dense
              options-dense
              clearable
              class="form-ui"
              v-model="orderType"
              :options="orderTypeList"
            />
          </div>
        </div>
        <div class="col-1">
          <div class="form-component">
            <div class="form-label">Receipt Date.<span class="req">*</span></div>
            <Datefield class="form-ui" :value="receiptDate" @onUpdate="receiptDateOnUpdate" />
          </div>
        </div>
      </div>
      <div class="form-row">
        <div class="col-1">
          <div class="form-component">
            <div class="form-label">Supplier ID.<span class="req">*</span></div>
            <q-input outlined dense clearable class="form-ui" v-model="supplierId" />
          </div>
        </div>
        <div class="col">
          <div class="form-component">
            <div class="form-label">Supplier Name.<span class="req">*</span></div>
            <q-input outlined dense clearable class="form-ui supplier-ui" v-model="supplierName" />
          </div>
        </div>
      </div>
      <div class="form-row">
        <div class="col-1">
          <div class="form-component">
            <div class="form-label">W/H<span class="req">*</span></div>
            <q-input outlined dense clearable class="form-ui" v-model="wareHouse" />
          </div>
        </div>
        <div class="col-1">
          <div class="form-component">
            <div class="form-label">Status<span class="req">*</span></div>
            <q-input outlined dense clearable readonly class="form-ui" v-model="status" />
          </div>
        </div>
        <div class="col-1"></div>
      </div>
    </div>
    <div class="row top-table">
      <div class="title">Receive Item</div>
      <q-space />
      <q-btn size="12px" color="theme-color" label="Add Item" />
    </div>
    <q-table
      class="receiveItem"
      table-class="receiveItem-sticky-header-table"
      :rows="rows"
      :columns="columns"
      row-key="itemCode"
      selection="multiple"
      v-model:selected="orderItemSelected"
      hide-pagination
      hide-bottom
      flat
      bordered
      :loading="loading"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="theme-color" />
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th>
            <q-checkbox v-model="props.selected" size="xs" color="green-5" />
          </q-th>
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td style="width: 30px">
            <q-checkbox v-model="props.selected" size="xs" color="theme-color" />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <div class="row bottom-table">
      <q-btn size="12px" outline color="theme-color" label="Back" @click="onBackClick" />
      <q-space />
      <q-btn size="12px" color="red" label="Delete" />
      <q-btn size="12px" class="q-ml-xs" color="theme-color" label="Save" />
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRouterStore } from "../../stores/RouterStore";
export default defineComponent({
  name: "editReceiveOrder",
  emits: ["onRedirect", "alert", "confirm", "confirmInput"],
  setup(props, ctx) {
    const { router_params } = storeToRefs(useRouterStore());
    const receiptNo = ref(router_params.value.receiptNo);
    const refNo = ref(router_params.value.referenceNo);
    const docDate = ref(router_params.value.docDate);
    const owner = ref("");
    const orderType = ref(router_params.value.orderType);
    const receiptDate = ref(router_params.value.receiptDate);
    const supplierId = ref(router_params.value.supplierId);
    const supplierName = ref(router_params.value.supplierName);
    const wareHouse = ref(router_params.value.wareHouse);
    const status = ref(router_params.value.status);
    const createItemPopup = ref(false);
    const createColumns = [
      {
        name: "itemCode",
        label: "Item Code",
        align: "left",
        field: "itemCode",
        style: "width: 50px",
      },
      {
        name: "itemName",
        label: "Item",
        align: "left",
        field: "itemName",
      },
      {
        name: "zone",
        label: "Zone",
        align: "left",
        field: "zone",
        style: "width: 50px",
      },
      {
        name: "qty",
        label: "Qty",
        align: "left",
        field: "qty",
        style: "width: 50px",
      },
      {
        name: "uom",
        label: "UoM",
        align: "left",
        field: "uom",
      },
      {
        name: "loc",
        label: "Loc",
        align: "left",
        field: "loc",
        style: "width: 50px",
      },
      {
        name: "palletNo",
        label: "Pallet No",
        align: "left",
        field: "palletNo",
        style: "width: 50px",
      },
      {
        name: "status",
        label: "Status",
        align: "left",
        field: "status",
        style: "width: 50px",
      },
    ];

    const loading = ref(false);

    const onBackClick = () => {
      ctx.emit("onRedirect", "goodsReceipt");
    };

    const orderItemSelected = ref([]);

    const ownerList = ref([
      { label: "ทดสอบ 1", value: 1 },
      { label: "ทดสอบ 2", value: 2 },
      { label: "ทดสอบ 3", value: 3 },
    ]);

    const orderTypeList = ref([
      { label: "ทดสอบ 1", value: 1 },
      { label: "ทดสอบ 2", value: 2 },
      { label: "ทดสอบ 3", value: 3 },
    ]);

    const receiptDateOnUpdate = (value) => {
      console.log(value);
    };

    const docDateOnUpdate = (value) => {
      console.log(value);
    };

    return {
      ownerList,
      orderTypeList,
      receiptNo,
      refNo,
      docDate,
      owner,
      orderType,
      receiptDate,
      supplierId,
      supplierName,
      wareHouse,
      status,
      columns: createColumns,
      loading,
      createItemPopup,
      orderItemSelected,
      onBackClick,
      receiptDateOnUpdate,
      docDateOnUpdate,
    };
  },
});
</script>
<style lang="scss">
.form {
  .form-title {
    color: $themeColor;
    font-family: "Prompt-Bold";
    font-size: 18px;
    margin-bottom: 8px;
  }
  .form-contant {
    .form-row {
      display: flex;
      flex-wrap: wrap;
      .form-component {
        display: flex;
        margin: 0px 10px 10px 0px;
        .form-label {
          display: flex;
          align-items: center;
          width: 100px;
          margin-right: 10px;
          .req {
            color: red;
          }
        }
        .form-ui {
          width: 200px;
          .q-field__control,
          .q-field__append,
          .q-field__native {
            min-height: 28px;
            height: 28px;
            .q-icon,
            .q-field__focusable-action {
              font-size: 14px;
            }
            .q-select__dropdown-icon {
              font-size: 20px;
            }
          }
        }
        .supplier-ui {
          width: 520px;
        }
      }
    }
  }
}
.top-table,
.bottom-table {
  display: flex;
  align-items: center;
  .title {
    font-family: "Prompt-Bold";
    font-size: 16px;
    color: $themeColor;
  }
}

.receiveItem {
  margin-top: 2px;
  .q-table__top {
    padding: 8px;
  }
  margin-bottom: 10px;
  .receiveItem-sticky-header-table {
    /* height or max-height is important */
    min-height: 200px;
    height: calc(100vh - 390px);
    .q-table__top,
    .q-table__bottom,
    thead tr:first-child th {
      /* bg color is important for th; just specify one */
      background-color: $themeColor;
      font-weight: bold;
      font-size: 15px;
      color: white;
    }
    thead tr th {
      position: sticky;
      z-index: 1;
    }
    thead tr:first-child th {
      top: 0;
    }
    /* this is when the loading indicator appears */
    &.q-table--loading thead tr:last-child th {
      /* height of all previous header rows */
      top: 48px;
    }
  }
}
</style>

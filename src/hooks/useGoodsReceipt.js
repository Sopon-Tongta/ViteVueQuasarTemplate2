import { ref } from "vue";
import useUtil from "./useUtil";

const useReceiveOrder = () => {
  const { formatDate_DB, alertFetchError } = useUtil.useUtil();
  const receiveOrderList = ref([]);
  const receiveOrderTotal = ref(0);

  const saveReceiveOrder = (saveOrder, callBackFn) => {
    let params = {
      receiptOrder: {
        referenceNo: saveOrder.referenceNo,
        ownerCode: saveOrder.ownerCode,
        supplierCode: saveOrder.supplierCode,
        orderType: saveOrder.orderType,
        whCodeDes: saveOrder.warehouse,
        whCodeSource: saveOrder.warehouse,
        docDate: formatDate_DB(saveOrder.docDate),
        receiptDate: formatDate_DB(saveOrder.receiveDate),
      },
      userCode: "J26383",
      userId: 7,
    };

    //Save
    // fetch(`https://inventorydev.thaibevapp.com/inventoryapi/api/v1/receiptorder`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(params),
    // })
    //   .then((res) => {
    //     if (res.ok) {
    //       return res.json();
    //     }
    //     throw new Error(`${res.status}: ${res.statusText}`);
    //   })
    //   .then((resJson) => {
    //     if (typeof callBackFn === "function") {
    //       callBackFn(resJson);
    //     }
    //   })
    //   .catch((error) => {
    //     alertFetchError(error.message);
    //   });

    callBackFn(params);
  };

  const editReceiveOrder = (editOrder, callBackFn) => {
    let params = {
      receiptOrder: {
        referenceNo: editOrder.referenceNo,
        ownerCode: editOrder.ownerCode,
        supplierCode: editOrder.supplierCode,
        orderType: editOrder.orderType,
        whCodeDes: editOrder.warehouse,
        whCodeSource: editOrder.warehouse,
        docDate: formatDate_DB(editOrder.docDate),
        receiptDate: formatDate_DB(editOrder.receiveDate),
        receiptNo: editOrder.receiptNo,
      },
      userId: 7,
    };
    fetch(
      `https://inventorydev.thaibevapp.com/inventoryapi/api/v1/receiptorder/owner/${editOrder.ownerCode}/receipt/${editOrder.receiptNo}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(`${res.status}: ${res.statusText}`);
      })
      .then((resJson) => {
        if (typeof callBackFn === "function") {
          callBackFn(resJson);
        }
      })
      .catch((error) => {
        alertFetchError(error.message);
      });
  };

  const deleteReceiveOrder = (delOrder, callBackFn) => {
    let delParams = {
      UserId: 7,
      owner: delOrder.ownerCode,
      receiptNo: delOrder.receiptNo,
      remark: delOrder.remark,
    };

    fetch(`https://inventorydev.thaibevapp.com/inventoryapi/api/v1/receiptorder`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(delParams),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(`${res.status}: ${res.statusText}`);
      })
      .then((resJson) => {
        if (typeof callBackFn === "function") {
          callBackFn(resJson);
        }
      })
      .catch((error) => {
        alertFetchError(error.message);
      });
  };

  const searchReceiveOrder = (
    status,
    refNo,
    receiptNo,
    owner,
    orderType,
    page,
    pageSize,
    callBackFn
  ) => {
    status = status == null ? "" : status.toLowerCase() == "all" ? "" : status.toLowerCase();
    refNo = refNo == null ? "" : refNo.toLowerCase();
    receiptNo = receiptNo == null ? "" : receiptNo.toLowerCase();
    owner = owner == null ? "" : owner.toLowerCase();
    orderType = orderType == null ? "" : orderType.toLowerCase();

    fetch(`https://inventorydev.thaibevapp.com/inventoryapi/api/v1/receiptorder/list`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderType: orderType,
        ownerCode: owner,
        page: page,
        pageSize: pageSize,
        receiptCode: receiptNo,
        refNo: refNo,
        status: status,
        supplier: "",
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(`${res.status}: ${res.statusText}`);
      })
      .then((resJson) => {
        receiveOrderList.value = resJson.list;
        receiveOrderTotal.value = resJson.total;
        if (typeof callBackFn === "function") {
          callBackFn(resJson);
        }
      })
      .catch((error) => {
        alertFetchError(error.message);
      });
  };

  return {
    receiveOrderList,
    receiveOrderTotal,
    saveReceiveOrder,
    editReceiveOrder,
    deleteReceiveOrder,
    searchReceiveOrder,
  };
};

const useReceiveItem = () => {
  const { uid, formatDate_DB, alertFetchError, addComma } = useUtil.useUtil();
  const receiveItemList = ref([]);
  const receiveItemTotal = ref(0);

  const calculateOrderStatus = (callBackFn) => {
    let orderStatus = "";
    let count_new = 0;
    let count_checkin = 0;
    let count_putaway = 0;

    receiveItemList.value.forEach((item) => {
      switch (item.status.toUpperCase()) {
        case "NEW":
          count_new++;
          break;
        case "CHECKIN":
          count_checkin++;
          break;
        case "PUTAWAY":
          count_putaway++;
          break;
      }
    });

    if (count_new >= 0 && count_checkin == 0 && count_putaway == 0) {
      orderStatus = "NEW";
    } else if (count_new > 0 && count_checkin > 0 && count_putaway == 0) {
      orderStatus = "PARTIAL CHECKIN";
    } else if (count_new > 0 && count_checkin > 0 && count_putaway > 0) {
      orderStatus = "PARTIAL PUTAWAY";
    } else if (count_new == 0 && count_checkin > 0 && count_putaway > 0) {
      orderStatus = "PARTIAL PUTAWAY";
    } else if (count_new == 0 && count_checkin > 0 && count_putaway == 0) {
      orderStatus = "CHECKIN";
    } else if (count_new == 0 && count_checkin == 0 && count_putaway > 0) {
      orderStatus = "CLOSE";
    } else if (count_new > 0 && count_checkin == 0 && count_putaway > 0) {
      orderStatus = "PARTIAL PUTAWAY";
    }

    if (typeof callBackFn === "function") {
      callBackFn(orderStatus);
    }
  };

  const calculateRemainItem = (itemFromAPI, callBackFn) => {
    receiveItemList.value = [];
    itemFromAPI.forEach((itemResult) => {
      let uomDisplay1 = "";
      let uomDisplay2 = "";
      let uomItemMaster = [];
      let itemQty1 = 0;
      let itemQty2 = 0;
      let itemUom1 = "";
      let itemUom2 = "";
      let receiveQty1 = 0;
      let receiveQty2 = 0;
      let remainQty1 = 0;
      let remainQty2 = 0;
      if (itemResult.uomBase.uomCode == itemResult.uomOrder.uomCode) {
        uomDisplay1 = itemResult.uomBase.uomNameTH;
        itemQty1 = itemResult.uomBase.qty;
        itemQty2 = 0;
        itemUom1 = itemResult.uomBase.uomCode;
        itemUom2 = "";
        receiveQty1 = itemResult.confirm.qty;
        receiveQty2 = 0;
        remainQty1 = itemResult.uomBase.qty - itemResult.confirm.qty;
        remainQty2 = 0;
        uomItemMaster.push({
          uomCode: itemResult.uomBase.uomCode,
          uomLabel: itemResult.uomBase.uomNameTH,
          convertQty: itemResult.uomBase.convertQty,
        });
      } else {
        uomDisplay1 = itemResult.uomOrder.uomNameTH;
        uomDisplay2 = itemResult.uomBase.uomNameTH;
        itemQty1 = parseInt(itemResult.uomBase.qty / itemResult.uomOrder.convertQty);
        itemQty2 = itemResult.uomBase.qty % itemResult.uomOrder.convertQty;
        itemUom1 = itemResult.uomOrder.uomCode;
        itemUom2 = itemResult.uomBase.uomCode;

        receiveQty1 = parseInt(itemResult.confirm.qty / itemResult.uomOrder.convertQty);
        receiveQty2 = itemResult.confirm.qty % itemResult.uomOrder.convertQty;

        let minusQty = itemResult.uomBase.qty - itemResult.confirm.qty;
        minusQty = minusQty < 0 ? 0 : minusQty;

        remainQty1 = parseInt(minusQty / itemResult.uomOrder.convertQty);
        remainQty2 = minusQty % itemResult.uomOrder.convertQty;

        uomItemMaster.push({
          uomCode: itemResult.uomOrder.uomCode,
          uomLabel: itemResult.uomOrder.uomNameTH,
          convertQty: itemResult.uomOrder.convertQty,
        });

        uomItemMaster.push({
          uomCode: itemResult.uomBase.uomCode,
          uomLabel: itemResult.uomBase.uomNameTH,
          convertQty: itemResult.uomBase.convertQty,
        });
      }

      let qtyDisplay = addComma(itemQty1);
      let uomDisplay = uomDisplay1;
      let receiveDisplay = addComma(receiveQty1);
      let receiveUomDisplay = uomDisplay1;
      let remainQtyDisplay = addComma(remainQty1);
      let remainUomDisplay = uomDisplay1;

      if (itemUom1.length > 0 && itemUom2.length > 0 && itemUom1 !== itemUom2) {
        qtyDisplay = qtyDisplay.concat("/", addComma(itemQty2));
        uomDisplay = uomDisplay.concat("/", uomDisplay2);

        if (receiveQty1 > 0 || receiveQty2 > 0) {
          receiveDisplay = receiveDisplay.concat("/", addComma(receiveQty2));
        } else {
          receiveDisplay = "-/-";
        }
        receiveUomDisplay = receiveUomDisplay.concat("/", uomDisplay2);

        remainQtyDisplay = remainQtyDisplay.concat("/", addComma(remainQty2));
        remainUomDisplay = remainUomDisplay.concat("/", uomDisplay2);
      } else {
        if (receiveQty1 > 0) {
          receiveDisplay = addComma(receiveQty1);
        } else {
          receiveDisplay = "-";
        }
      }

      receiveItemList.value.push({
        clientId: uid(),
        lineNo: itemResult.lineno,
        receiptNo: itemResult.receiptNo,
        skuCode: itemResult.skuCode,
        description: itemResult.description,
        palletNo: itemResult.palletNo,
        lot: itemResult.lot,
        batch: itemResult.batch,
        qty1: itemQty1,
        uom1: itemUom1,
        uomDisplay1: uomDisplay1,
        qty2: itemQty2,
        uom2: itemUom2,
        uomDisplay2: uomDisplay2,
        receiveQty1: receiveQty1,
        receiveUom1: itemUom1,
        receiveQty2: receiveQty2,
        receiveUom2: itemUom2,
        zone: itemResult.zoneCode,
        loc: itemResult.locationCode,
        mfgDate: itemResult.mfgDate,
        expDate: itemResult.expDate,
        status: itemResult.status,
        qtyDisplay: qtyDisplay,
        uomDisplay: uomDisplay,
        receiveDisplay: receiveDisplay,
        receiveUomDisplay: receiveUomDisplay,
        remainQtyDisplay: remainQtyDisplay,
        remainUomDisplay: remainUomDisplay,
        uomItemMaster: uomItemMaster,
        baseConvertQty: itemResult.uomBase.convertQty,
        baseUomCode: itemResult.uomBase.uomCode,
        baseUomName: itemResult.uomBase.uomNameTH,
        saleConvertQty: itemResult.uomOrder.convertQty,
        saleUomCode: itemResult.uomOrder.uomCode,
        saleUomName: itemResult.uomOrder.uomNameTH,
        confirmConvertQty: itemResult.confirm.convertQty,
        confirmUomCode: itemResult.confirm.uomCode,
        confirmUomName: itemResult.confirm.uomNameTH,
        checkItem: itemResult.checkItem,
      });
    });
    if (typeof callBackFn === "function") {
      callBackFn(receiveItemList.value);
    }
  };

  const searchReceiveItem = (receiptNo, ownerCode, loadSS, callBackFn) => {
    const itemSessionJson = sessionStorage.getItem("goods-receipt-item");
    if (itemSessionJson && loadSS) {
      let itemSession = JSON.parse(itemSessionJson);
      calculateRemainItem(itemSession, () => calculateOrderStatus(callBackFn));
    } else {
      let url = `https://inventorydev.thaibevapp.com/inventoryapi/api/v1/receiptorder/item/owner/${ownerCode}/receipt/${receiptNo}`;
      fetch(url)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error(`${res.status}: ${res.statusText}`);
        })
        .then((resJson) => {
          let itemFromAPI = resJson.item;
          itemFromAPI.map((data) => {
            data.checkItem = false;
            data.reasonNotFull = "";
          });
          let jsonItem = JSON.stringify(itemFromAPI);
          sessionStorage.setItem("goods-receipt-item", jsonItem);
          calculateRemainItem(itemFromAPI, () => calculateOrderStatus(callBackFn));
        })
        .catch((error) => {
          alertFetchError(error.message);
        });
    }
  };

  const createReceiveItem = (item, callBackFn) => {
    let itemParams = [];
    let udfSave = [];

    if (item.qty1 > 0) {
      udfSave.push({
        qty: item.qty1,
        uom: item.uom1,
      });
    }
    if (item.qty2 > 0) {
      udfSave.push({
        qty: item.qty2,
        uom: item.uom2,
      });
    }
    if (item.qty3 > 0) {
      udfSave.push({
        qty: item.qty3,
        uom: item.uom3,
      });
    }
    itemParams.push({
      ownerCode: item.ownerCode,
      batch: item.batch,
      description: item.itemName,
      expDate: formatDate_DB(item.expDate),
      locationCode: "",
      lot: item.lot,
      mfgDate: formatDate_DB(item.mfgDate),
      palletNo: item.palletNo,
      receiptNo: item.receiptNo,
      skuCode: item.itemCode,
      udf: udfSave,
    });

    let inputParams = {
      owner: item.ownerCode,
      receipt: item.receiptNo,
      userId: 7,
      item: itemParams,
    };

    fetch(`https://inventorydev.thaibevapp.com/inventoryapi/api/v1/receiptorder/item`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputParams),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(`${res.status}: ${res.statusText}`);
      })
      .then((resJson) => {
        if (typeof callBackFn === "function") {
          callBackFn(resJson);
        }
      })
      .catch((error) => {
        alertFetchError(error.message);
      });
  };

  const saveReceiveItem = (saveMode, editData, callBackFn) => {
    const itemSessionJson = sessionStorage.getItem("goods-receipt-item");
    if (itemSessionJson) {
      let itemSession = JSON.parse(itemSessionJson);
      itemSession.map((f) => {
        if (f.lineno == editData.lineNo) {
          if (saveMode.toUpperCase() == "CHECKIN") {
            let sumBaseReceiveQty = 0;
            if (f.uomBase.uomCode == editData.receiveUom1) {
              sumBaseReceiveQty += editData.receiveQty1;
            } else {
              sumBaseReceiveQty += parseInt(editData.receiveQty1 * f.uomOrder.convertQty);
            }

            if (f.uomBase.uomCode == editData.receiveUom2) {
              sumBaseReceiveQty += editData.receiveQty2;
            } else {
              sumBaseReceiveQty += parseInt(editData.receiveQty2 * f.uomOrder.convertQty);
            }
            f.confirm.qty = sumBaseReceiveQty;
            f.palletNo = editData.palletNo;
            f.locationCode = editData.loc;
            f.zoneCode = editData.zoneCode;
            f.reasonNotFull = editData.reasonNotFull;
            f.checkItem = true;
          } else if (saveMode.toUpperCase() == "PUTAWAY") {
            f.locationCode = editData.loc;
            f.zoneCode = editData.zoneCode;
            f.checkItem = true;
          }
        }
      });
      sessionStorage.setItem("goods-receipt-item", JSON.stringify(itemSession));
      calculateRemainItem(itemSession, () => calculateOrderStatus(callBackFn));
    }
  };

  const delelteReceiveItem = (lineNo, ownerCode, receiptNo, callBackFn) => {
    let params = [
      {
        UserId: 7,
        lineNo: lineNo,
        owner: ownerCode,
        receiptNo: receiptNo,
      },
    ];
    fetch(`https://inventorydev.thaibevapp.com/inventoryapi/api/v1/receiptorder/item`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(`${res.status}: ${res.statusText}`);
      })
      .then((resJson) => {
        if (typeof callBackFn === "function") {
          callBackFn(resJson);
        }
      })
      .catch((error) => {
        alertFetchError(error.message);
      });
  };

  const saveCheckItemToConfirm = (lineNoList, callBackFn) => {
    const itemSessionJson = sessionStorage.getItem("goods-receipt-item");
    if (itemSessionJson) {
      let itemSession = JSON.parse(itemSessionJson);
      itemSession.map((ms) => {
        ms.checkItem = lineNoList.findIndex((lineNo) => lineNo == ms.lineno) > -1;
      });
      sessionStorage.setItem("goods-receipt-item", JSON.stringify(itemSession));
      calculateRemainItem(itemSession, () => calculateOrderStatus(callBackFn));
    }
  };

  const checkInReceiveItem = (checkInSaveList, callBackFn) => {
    fetch(`https://inventorydev.thaibevapp.com/inventoryapi/api/v1/receiptorder/checkIn`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(checkInSaveList),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(`${res.status}: ${res.statusText}`);
      })
      .then((resJson) => {
        if (typeof callBackFn === "function") {
          callBackFn(resJson);
        }
      })
      .catch((error) => {
        alertFetchError(error.message);
      });
  };

  const putAwayReceiveItem = (item, callBackFn) => {
    fetch(`https://inventorydev.thaibevapp.com/inventoryapi/api/v1/receiptorder/putawaylocation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(`${res.status}: ${res.statusText}`);
      })
      .then((resJson) => {
        if (typeof callBackFn === "function") {
          callBackFn(resJson);
        }
      })
      .catch((error) => {
        alertFetchError(error.message);
      });
  };

  const checkPalletDup = (palletName, callBackFn) => {
    fetch(`https://inventorydev.thaibevapp.com/inventoryapi/api/v1/pallet/${palletName}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(`${res.status}: ${res.statusText}`);
      })
      .then((resJson) => {
        let isDup = resJson.Ok !== null;
        if (typeof callBackFn === "function") {
          callBackFn(isDup);
        }
      })
      .catch((error) => {
        alertFetchError(error.message);
      });
  };

  return {
    receiveItemList,
    receiveItemTotal,
    searchReceiveItem,
    createReceiveItem,
    saveReceiveItem,
    delelteReceiveItem,
    saveCheckItemToConfirm,
    checkInReceiveItem,
    putAwayReceiveItem,
    checkPalletDup,
  };
};

export default { useReceiveOrder, useReceiveItem };

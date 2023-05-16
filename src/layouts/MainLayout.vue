<template>
  <q-layout view="hhh LpR fFf">
    <q-dialog :class="alertClass" v-model="alertShow" persistent>
      <q-card>
        <q-card-section>
          <div class="titie">
            <q-icon
              v-if="alertClass == 'alert-error'"
              class="icon"
              name="error"
              color="red"
              size="35px"
            />
            <span class="text">{{ alertTitle }}</span>
          </div>
          <div class="contant">{{ alertContant }}</div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            size="12px"
            unelevated
            label="ตกลง"
            :color="alertClass == 'alert-error' ? 'red' : 'theme-color'"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog class="msg-confirm" v-model="confirmShow">
      <q-card>
        <q-card-section>
          <div class="titie">{{ confirmTitle }}</div>
          <div class="contant">{{ confirmContant }}</div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn size="12px" outline label="ยกเลิก" color="red" v-close-popup />
          <q-btn size="12px" unelevated label="ตกลง" color="theme-color" @click="confirmOnSubmit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog class="msg-confirm-input" v-model="confirmInputShow">
      <q-card>
        <q-card-section>
          <div class="titie">{{ confirmInputTitle }}</div>
          <div class="text-input">
            {{ confirmInputText }}
          </div>
          <div>
            <q-input outlined dense clearable class="form-input" v-model="confirmInputForm" />
          </div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn size="12px" outline label="ยกเลิก" color="red" v-close-popup />
          <q-btn
            size="12px"
            unelevated
            label="ยืนยัน"
            color="theme-color"
            @click="confirmInputOnSubmit"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-header class="header-main">
      <q-toolbar class="toolbar-1">
        <q-toolbar-title>
          <div class="logo font">LOGO</div>
          <div class="version">Version 1.0.0</div>
        </q-toolbar-title>
        <q-btn-dropdown flat text-color="white" color="green-9" :label="userName">
          <q-list>
            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>Sign out</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
      <q-toolbar class="toolbar-2">
        <q-btn dense flat round icon="menu" class="btn-toggle" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <q-breadcrumbs gutter="xs" class="toolbar-menu" active-color="black">
            <template v-for="(row, index) in menuDisplay" :key="index">
              <q-breadcrumbs-el
                :class="row.cls"
                :label="row.label"
                v-on:click="onRedirect(row.name)"
              />
            </template>
          </q-breadcrumbs>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer show-if-above v-model="leftDrawerOpen" bordered class="criteria-main" side="left">
      <div style="display: grid; padding: 20px; position: relative">
        <label class="label-project">Project Name</label>
        <label class="label-project-version">Version 1.0.0</label>
        <q-btn
          flat
          round
          class="c-btn-close"
          icon="close"
          style="position: absolute; top: 0; right: 0"
          @click="toggleLeftDrawer"
        />
      </div>
      <q-separator style="margin-bottom: 15px" />
      <div class="criteria-menu">
        <template v-for="(row_menu, index_menu) in listMenu" :key="index_menu">
          <template v-for="(row_main, index_main) in row_menu.childItem" :key="index_main">
            <q-expansion-item
              v-if="row_main.childMenu && row_main.childItem.length > 1"
              expand-separator
              :label="row_main.label"
            >
              <template v-for="(row_child, index_child) in row_main.childItem" :key="index_child">
                <q-item
                  :clickable="row_child.clickable"
                  :disable="row_child.disable"
                  v-on:click="onRedirect(row_child.name)"
                >
                  <q-item-section class="text-bold">
                    {{ row_child.label }}
                  </q-item-section>
                </q-item>
              </template>
            </q-expansion-item>
            <q-item
              v-else
              :clickable="row_main.clickable"
              :disable="row_main.disable"
              v-on:click="onRedirect(row_main.name)"
            >
              <q-item-section class="text-bold">
                {{ row_main.label }}
              </q-item-section>
            </q-item>
          </template>
        </template>
      </div>
    </q-drawer>
    <q-page-container class="container">
      <router-view
        v-on:onRedirect="onRedirect"
        v-on:showLoading="showLoading"
        v-on:hideLoading="hideLoading"
        v-on:alert="childUseAlert"
        v-on:confirm="childUseConfirm"
        v-on:confirmInput="childUseConfirmInput"
      />
    </q-page-container>
  </q-layout>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuasar, QSpinnerCube } from "quasar";
import { useRouterStore } from "../stores/RouterStore";
import useMenuHooks from "../hooks/useMenu";

export default {
  setup() {
    const routerStore = useRouterStore();
    const { getRouterParams } = routerStore;
    const { listMenu, getMenu } = useMenuHooks.useMenu();
    const userName = ref("Kittisak K.");
    const route = useRoute();
    const router = useRouter();
    const $q = useQuasar();

    const leftDrawerOpen = ref(false);
    const labelDisplay = ref([]);

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    const findMenu = (findNode, name) => {
      for (let i = 0; i < findNode.length; i++) {
        if (findNode[i].name == name) {
          return findNode[i];
        } else if (findNode[i].childItem !== undefined && findNode[i].childItem.length > 0) {
          let result = findMenu(findNode[i].childItem, name);
          if (result !== undefined) {
            return result;
          }
        }
      }
    };

    const saveParent = (saveList, findNode, parentId) => {
      for (let i = 0; i < findNode.length; i++) {
        if (findNode[i].menuId == parentId) {
          saveList.push(findNode[i]);
          if (findNode[i].parentId > 0) {
            saveList = saveParent(saveList, listMenu.value, findNode[i].parentId);
          }
          break;
        } else if (findNode[i].childItem !== undefined && findNode[i].childItem.length > 0) {
          saveList = saveParent(saveList, findNode[i].childItem, parentId);
        }
      }
      return saveList;
    };

    const onRedirect = (name, params) => {
      let all = listMenu.value;
      let currentRow = findMenu(all, name);
      if (currentRow === undefined) {
        childUseAlert("System Error", "Page redirect not found.", "bg-deep-orange text-white");
        return;
      }

      let findId = currentRow.parentId;
      let saveList = [];
      saveList.push(currentRow);
      saveList = saveParent(saveList, all, findId);
      labelDisplay.value = []; //clear

      while (saveList.length > 0) {
        let popRow = saveList.pop();
        popRow.cls = saveList.length == 0 ? "font-menu-active" : "font-menu";
        labelDisplay.value.push(popRow);
      }

      showLoading();
      params = params == undefined ? {} : params;
      sessionStorage.setItem("inventory_params", JSON.stringify(params));
      router.push({ name: currentRow.name }).then(() => {
        hideLoading();
      });
    };

    const showLoading = () => {
      $q.loading.show({
        spinner: QSpinnerCube,
        spinnerSize: 50,
        spinnerColor: "theme-color",
        messageColor: "black",
        backgroundColor: "white",
      });
    };

    const hideLoading = () => {
      $q.loading.hide();
    };

    const pageParams = sessionStorage.getItem("e_service_params");
    if (pageParams !== null) {
      const objParams = JSON.parse(pageParams);
      let paramList = Object.keys(objParams);
      paramList.forEach((paramName) => {
        route.params[paramName] = objParams[paramName];
      });
    }

    onMounted(() => {
      getMenu();
    });

    watch(route, async () => {
      getRouterParams();
    });

    //=== Alert ===
    const alertShow = ref(false);
    const alertClass = ref("");
    const alertTitle = ref("");
    const alertContant = ref("");
    const childUseAlert = (title, message, cls) => {
      alertTitle.value = title;
      alertContant.value = message;
      alertClass.value = "alert-info";
      if (cls !== undefined && cls !== null) {
        switch (cls.toLowerCase()) {
          case "info":
            alertClass.value = "alert-info";
            break;
          case "error":
            alertClass.value = "alert-error";
            break;
        }
      }
      alertShow.value = true;
    };
    //=== Confirm ===
    const confirmTitle = ref("");
    const confirmContant = ref("");
    const confirmShow = ref(false);
    const confirmOnSubmit = ref(() => {});
    const childUseConfirm = (title, contant, onFunc) => {
      confirmTitle.value = title;
      confirmContant.value = contant;
      confirmOnSubmit.value = () => {
        if (typeof onFunc === "function") {
          onFunc();
        }
        confirmShow.value = false;
      };
      confirmShow.value = true;
    };
    //=== Confirm Input===
    const confirmInputTitle = ref("");
    const confirmInputText = ref("");
    const confirmInputForm = ref("");
    const confirmInputShow = ref(false);
    const confirmInputOnSubmit = ref(() => {});
    const childUseConfirmInput = (title, textInput, onFunc) => {
      confirmInputTitle.value = title;
      confirmInputText.value = textInput;
      confirmInputForm.value = "";
      confirmInputOnSubmit.value = () => {
        if (typeof onFunc === "function") {
          onFunc(confirmInputForm.value);
        }
        confirmInputShow.value = false;
      };
      confirmInputShow.value = true;
    };

    return {
      userName,
      leftDrawerOpen,
      listMenu,
      menuDisplay: labelDisplay,
      toggleLeftDrawer,
      onRedirect,
      showLoading,
      hideLoading,
      alertShow,
      alertClass,
      alertTitle,
      alertContant,
      childUseAlert,
      confirmShow,
      confirmTitle,
      confirmContant,
      confirmOnSubmit,
      childUseConfirm,
      confirmInputShow,
      confirmInputTitle,
      confirmInputText,
      confirmInputForm,
      confirmInputOnSubmit,
      childUseConfirmInput,
    };
  },
};
</script>
<style lang="scss">
.header-main {
  background-color: #e0e0e0;
  font-family: "Prompt-Regular";
  color: #333;
  .toolbar-1 {
    color: white;
    background-color: $themeColor;
    height: 60px;
    padding: 0px 25px;
    .logo {
      margin-top: -5px;
      margin-bottom: -15px;
      font-size: 2.25rem;
      font-weight: bold;
      letter-spacing: 0.0125em;
    }
    .version {
      margin-left: 2px;
      font-size: 12px;
    }
  }
  .toolbar-2 {
    min-height: 35px;
    .btn-toggle {
      font-size: 14px;
    }
    .toolbar-menu {
      color: black;
      font-size: 14px;
    }
    .font-menu {
      cursor: pointer;
    }
    .font-menu-active {
      cursor: normal;
      font-family: "Prompt-SemiBold";
    }
  }
}
.criteria-main {
  background: #f0f0f0;
  .c-btn-close {
    color: #333;
    font-size: 10px;
  }
  .label-project {
    font-family: "Prompt-Bold";
    font-size: 25px;
  }
  .label-project-version {
    font-family: "Prompt-Medium";
    font-size: 12px;
  }
  .criteria-menu {
    font-family: "Prompt-SemiBold";
    font-size: 16px;
    padding-left: 5px;
    .q-expansion-item__content {
      font-family: "Prompt-SemiBold";
    }
  }
}
.container {
  font-family: "Prompt-Regular";
  height: 100vh;
}
.alert-info {
  .titie {
    font-family: "Prompt-Bold";
    font-size: 18px;
    color: $themeColor;
  }
  .contant {
    font-family: "Prompt-Regular";
    font-size: 14px;
  }
}
.alert-error {
  .titie {
    font-family: "Prompt-Bold";
    font-size: 18px;
    color: red;
    .icon {
      padding-right: 5px;
    }
  }
  .contant {
    font-family: "Prompt-Regular";
    font-size: 14px;
  }
}
.msg-confirm {
  .titie {
    display: flex;
    justify-content: center;
    margin-bottom: 5px;
    font-family: "Prompt-Bold";
    font-size: 20px;
  }
  .contant {
    display: flex;
    justify-content: center;
    font-family: "Prompt-Regular";
    font-size: 14px;
  }
}
.msg-confirm-input {
  .titie {
    display: flex;
    justify-content: center;
    margin-bottom: 5px;
    font-family: "Prompt-Bold";
    font-size: 20px;
  }
  .text-input {
    display: flex;
    justify-content: left;
    font-family: "Prompt-Regular";
    font-size: 14px;
  }
  .form-input {
    width: 300px;
  }
}
</style>

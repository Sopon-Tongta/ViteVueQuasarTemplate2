<template>
  <q-select
    outlined
    dense
    options-dense
    :class="selectClass"
    v-model="selectListValue"
    :options="selectList"
    multiple
    :clearable="selectClearable"
    :display-value="counterSelect"
    @clear="onClearSelect"
  >
    <template v-slot:before-options>
      <q-item dense clickable :active="selectedAll" @click="onToggleCheckAll">
        <q-item-section>
          <q-item-label>Select All</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-checkbox size="xs" :model-value="selectedAll" @update:model-value="onToggleCheckAll" />
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:option="{ itemProps, opt, selected, toggleOption, index }">
      <q-item
        dense
        v-bind="itemProps"
        :focused="focusAll[index]"
        @mouseover="onSetFocusMenu(index, true)"
        @mouseleave="onSetFocusMenu(index, false)"
      >
        <q-item-section>
          <q-item-label>{{ opt.label }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-checkbox size="xs" :model-value="selected" @update:model-value="toggleOption(opt)" />
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey font-thaibev-regular">No results</q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
import { defineComponent, ref, watch, onMounted } from "vue";
export default defineComponent({
  props: ["list", "listValue", "clearable", "displayText"],
  emits: ["onClear", "onSelect"],
  setup(props, { emit }) {
    const selectList = ref(props.list);
    const selectListValue = ref(props.listValue);
    const selectClass = ref("multi-select-text-grey");
    const selectClearable = ref(props.clearable == undefined ? true : props.clearable);
    const displayText = props.displayText == undefined ? "Selected" : props.displayText;
    const focusAll = ref([]);
    const counterSelect = ref("-- เลือก --");
    const selectedAll = ref(false);

    onMounted(() => {
      if (selectListValue.value.length > 0) {
        counterSelect.value = `${selectListValue.value.length} ${displayText}`;
        selectClass.value = "";
      }
      selectList.value.forEach(() => {
        focusAll.value.push(false);
      });
      if (props.list.length == props.listValue.length) {
        selectedAll.value = true;
      }
    });

    const onClearSelect = () => {
      selectListValue.value = [];
      emit("onClear");
    };

    const onToggleCheckAll = () => {
      selectedAll.value = !selectedAll.value;
      if (selectedAll.value) {
        selectListValue.value = selectList.value;
        return;
      }
      selectListValue.value = [];
    };

    const onSetFocusMenu = (index, value) => {
      focusAll.value[index] = value;
    };

    watch(selectListValue, () => {
      emit("onSelect", selectListValue.value);
      if (selectListValue.value.length == 0) {
        counterSelect.value = "-- เลือก --";
        selectClass.value = "multi-select-text-grey";
        selectedAll.value = false;
        return;
      } else if (selectListValue.value.length === selectList.value.length) {
        selectedAll.value = true;
      } else {
        selectedAll.value = false;
      }
      selectClass.value = "";
      counterSelect.value = `${selectListValue.value.length} ${displayText}`;
    });

    watch(props, () => {
      if (selectListValue.value == props.listValue) {
        return;
      }
      selectList.value = props.list;
      selectListValue.value = props.listValue;
    });

    return {
      selectList,
      selectListValue,
      selectClass,
      selectClearable,
      counterSelect,
      selectedAll,

      focusAll,

      onToggleCheckAll,
      onSetFocusMenu,
      onClearSelect,
    };
  },
});
</script>

<style></style>

<template>
  <q-select
    outlined
    dense
    options-dense
    :clearable="selectClearable"
    :class="selectClass"
    v-model="selectValue"
    :options="selectList"
    @clear="onClearEvent"
    @filter="onFilterEvent"
    @update:model-value="
      () => {
        $refs.selectEl.blur();
        onSelectEvent();
      }
    "
    :use-input="search == undefined ? true : search"
    :hide-selected="search == undefined ? true : search"
    :placeholder="placeholder == undefined ? '' : placeholder"
    fill-input
    input-debounce="0"
    map-options
    emit-value
    ref="selectEl"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey font-thaibev-regular"> No results </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
<script>
import { defineComponent, ref, watch } from "vue";
export default defineComponent({
  props: ["list", "value", "class", "clearable", "search", "placeholder"],
  emits: ["onClear", "onSelect"],
  setup(props, { emit }) {
    const selectList = ref(props.list);
    const selectValue = ref(props.value);
    const selectClass = ref(props.class);
    const selectClearable = ref(props.clearable == undefined ? true : props.clearable);

    watch(props, () => {
      selectList.value = props.list;
      selectValue.value = props.value;
      selectClass.value = props.class;
    });

    const onClearEvent = () => {
      selectValue.value = "";
      emit("onClear");
    };

    let timeoutFilterId = 0;
    const onFilterEvent = (val, update, abort) => {
      clearTimeout(timeoutFilterId);
      timeoutFilterId = setTimeout(() => {
        update(() => {
          if (val === "") {
            selectClearable.value = props.clearable == undefined ? true : props.clearable;
            selectList.value = props.list;
          } else {
            selectClearable.value = false;
            const needle = val.toLowerCase();
            selectList.value = props.list.filter(
              (data) => data.label.toLowerCase().indexOf(needle) > -1
            );
          }
        });
      }, 200);
    };

    const onSelectEvent = () => {
      selectClearable.value = props.clearable == undefined ? true : props.clearable;
      selectValue.value = selectValue.value == null ? "" : selectValue.value;
      let recordSel = props.list.find((data) => data.value == selectValue.value);
      if (recordSel !== undefined) {
        emit("onSelect", recordSel.label, recordSel.value);
      } else {
        emit("onSelect", "", "");
      }
    };

    return {
      selectList,
      selectValue,
      selectClass,
      selectClearable,
      onClearEvent,
      onFilterEvent,
      onSelectEvent,
    };
  },
});
</script>

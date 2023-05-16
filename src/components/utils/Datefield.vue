<template>
  <q-input
    outlined
    dense
    :clearable="clearable == undefined ? true : clearable"
    :class="dateClass"
    :mask="dateMaskInput"
    :style="dateStyle"
    v-model="dateValue"
    @clear="onClear"
    :placeholder="dateFormat"
  >
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
          <q-date
            v-model="dateValue"
            :mask="dateFormat"
            @update:model-value="
              () => {
                $refs.qDateProxy.hide();
                onUpdate();
              }
            "
          ></q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>
<script>
import { defineComponent, ref, watch } from "vue";
export default defineComponent({
  props: ["label", "value", "format", "mask", "class", "style", "clearable"],
  emits: ["onUpdate"],
  setup(props, { emit }) {
    const dateValue = ref(props.value); //DD/MM/YYYY
    const dateFormat = ref("");
    const dateMaskInput = ref("");
    const dateClass = ref(props.class);
    const dateStyle = ref(props.style);

    watch(props, () => {
      dateValue.value = props.value;
      dateClass.value = props.class;
      dateStyle.value = props.style;
    });

    const onClear = () => {
      dateValue.value = "";
      onUpdate();
    };
    const onUpdate = () => {
      emit("onUpdate", dateValue.value == null ? "" : dateValue.value);
    };

    dateFormat.value =
      props.format !== undefined && props.format !== null ? props.format : "DD/MM/YYYY";
    dateMaskInput.value =
      props.mask !== undefined && props.mask !== null ? props.format : "##/##/####";

    watch(dateValue, onUpdate);
    return {
      dateValue,
      dateFormat,
      dateMaskInput,
      onClear,
      onUpdate,
      dateClass,
      dateStyle,
    };
  },
});
</script>

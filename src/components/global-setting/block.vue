<template>
  <div class="block">
    <h5 class="title">{{ title }}</h5>
    <div v-for="option in options" :key="option.name" class="switch-wrapper">
      <span>{{ $t(option.name) }}</span>
      <form-wrapper
        :default-value="option.defaultVal"
        :name="option.key"
        :type="option.type || 'switch'"
        @input-change="handleChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { useAppStore } from "@/store";
import FormWrapper from "./form-wrapper.vue";

interface OptionsProps {
  name: string;
  key: string;
  type?: string;
  defaultVal?: boolean | string | number;
}

defineProps({
  title: {
    type: String,
    default: "",
  },
  options: {
    type: Array as PropType<OptionsProps[]>,
    default() {
      return [];
    },
  },
});
const appStore = useAppStore();
const handleChange = async ({
  key,
  value,
}: {
  key: string;
  value: unknown;
}) => {
  if (key === "colorWeak") {
    document.body.style.filter = value ? "invert(80%)" : "none";
  }
  if (key === "topMenu") {
    appStore.updateSettings({
      menuCollapse: false,
    });
  }
  appStore.updateSettings({ [key]: value });
};
</script>

<style lang="less" scoped>
.block {
  margin-bottom: 24px;
}

.title {
  margin: 10px 0;
  padding: 0;
  font-size: 14px;
}

.switch-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
}
</style>

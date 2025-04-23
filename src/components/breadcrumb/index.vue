<template>
  <a-breadcrumb class="container-breadcrumb">
    <a-breadcrumb-item>
      <icon-apps />
    </a-breadcrumb-item>
    <a-breadcrumb-item v-for="item in items" :key="item">
      {{ getBreadcrumbText(item) }}
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  direct: Boolean,
  items: {
    type: Array as PropType<string[]>,
    default() {
      return [];
    },
  },
});
const i18n = useI18n();

const getBreadcrumbText = (key: string): string => {
  if (props.direct) return key;
  return i18n.te(key) ? i18n.t(key) : key;
};
</script>

<style lang="less" scoped>
.container-breadcrumb {
  margin: 16px 0;

  :deep(.arco-breadcrumb-item) {
    color: rgb(var(--gray-6));

    &:last-child {
      color: rgb(var(--gray-8));
    }
  }
}
</style>

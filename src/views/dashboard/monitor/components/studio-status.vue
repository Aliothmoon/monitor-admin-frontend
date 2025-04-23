<template>
  <a-card
    :title="$t('monitor.studioStatus.title.studioStatus')"
    class="general-card"
  >
    <template #extra>
      <a-tag color="green">{{ $t("monitor.studioStatus.smooth") }}</a-tag>
    </template>
    <a-descriptions :column="2" :data="dataStatus" layout="horizontal">
      <template #label="{ label }">
        <span
          v-if="['mainstream', 'hotStandby', 'coldStandby'].includes(label)"
        >
          <a-typography-text style="padding-right: 8px">
            {{ $t(`monitor.studioStatus.${label}`) }}
          </a-typography-text>
          {{ $t("monitor.studioStatus.bitRate") }}
        </span>
        <span v-else>{{ label }}</span>
      </template>
    </a-descriptions>
    <a-typography-title :heading="6" style="margin-bottom: 16px">
      {{ $t("monitor.studioStatus.title.pictureInfo") }}
    </a-typography-title>
    <a-descriptions :column="2" :data="dataPicture" layout="horizontal" />
  </a-card>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const dataStatus = computed(() => [
  {
    label: "mainstream",
    value: "6 Mbps",
  },
  {
    label: t("monitor.studioStatus.frameRate"),
    value: "60",
  },
  {
    label: "hotStandby",
    value: "6 Mbps",
  },
  {
    label: t("monitor.studioStatus.frameRate"),
    value: "60",
  },
  {
    label: "coldStandby",
    value: "6 Mbps",
  },
  {
    label: t("monitor.studioStatus.frameRate"),
    value: "60",
  },
]);
const dataPicture = computed(() => [
  {
    label: t("monitor.studioStatus.line"),
    value: "热备",
  },
  {
    label: "CDN",
    value: "KS",
  },
  {
    label: t("monitor.studioStatus.play"),
    value: "FLV",
  },
  {
    label: t("monitor.studioStatus.pictureQuality"),
    value: "原画",
  },
]);
</script>

<style lang="less" scoped>
:deep(.arco-descriptions-item-label) {
  padding-right: 6px;
}
</style>

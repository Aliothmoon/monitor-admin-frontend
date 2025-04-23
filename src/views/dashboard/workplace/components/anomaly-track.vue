<template>
  <div class="anomaly-track-panel">
    <a-typography-title :heading="6">实时异常追踪</a-typography-title>
    <a-timeline class="anomaly-list">
      <a-timeline-item
        v-for="(event, index) in anomalies"
        :key="index"
        :dot-color="getEventColor(event.type)"
      >
        <a-space direction="vertical" fill>
          <a-row align="center" justify="space-between">
            <a-col :span="16">
              <a-tag :color="getEventColor(event.type)" size="small">
                {{ event.type }}
              </a-tag>
              {{ event.description }}
            </a-col>
            <a-col :span="8" class="text-right">
              <span class="time-text">{{ event.time }}</span>
            </a-col>
          </a-row>
          <a-button
            v-if="!event.resolved"
            class="action-btn"
            size="mini"
            status="danger"
            type="outline"
          >
            处理异常
          </a-button>
        </a-space>
      </a-timeline-item>
    </a-timeline>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from "vue";

defineProps({
  anomalies: {
    type: Array as PropType<
      Array<{
        time: string;
        type: string;
        description: string;
        resolved: boolean;
      }>
    >,
    required: true,
  },
});

const getEventColor = (type: string) => {
  switch (type) {
    case "作弊行为":
      return "#dc3545";
    case "网络中断":
      return "#ffc107";
    case "设备异常":
      return "#0dcaf0";
    default:
      return "#6c757d";
  }
};
</script>

<style lang="less" scoped>
.anomaly-track-panel {
  padding: 16px;
  background: var(--color-bg-2);
  border-radius: 4px;
  margin-top: 16px;

  .anomaly-list {
    margin-top: 12px;

    :deep(.arco-timeline-item-content) {
      padding-bottom: 20px;
    }
  }

  .time-text {
    font-size: 12px;
    color: var(--color-text-3);
  }

  .action-btn {
    margin-top: 8px;
  }

  .text-right {
    text-align: right;
  }
}
</style>

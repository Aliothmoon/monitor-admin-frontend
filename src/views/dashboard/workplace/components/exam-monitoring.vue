<template>
  <div class="exam-monitoring-panel">
    <a-typography-title :heading="6">实时考生监控</a-typography-title>
    <a-list :bordered="false" class="monitoring-list">
      <a-list-item v-for="(candidate, index) in candidates" :key="index">
        <a-space direction="vertical" fill>
          <a-row align="center" justify="space-between">
            <a-col :span="12">
              <a-tag color="blue">考位 {{ index + 1 }}</a-tag>
              {{ candidate.name }}
            </a-col>
            <a-col :span="12" class="text-right">
              <a-tag :color="getStatusColor(candidate.status)">
                {{ candidate.status }}
              </a-tag>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-space>
                <icon-video />
                <span>{{ candidate.cameraStatus }}</span>
              </a-space>
            </a-col>
            <a-col :span="12" class="text-right">
              <a-button
                v-if="candidate.hasAnomaly"
                size="mini"
                status="danger"
                type="outline"
              >
                查看异常
              </a-button>
            </a-col>
          </a-row>
        </a-space>
      </a-list-item>
    </a-list>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from "vue";

defineProps({
  stats: {
    type: Object as PropType<{
      onlineCandidates: number;
      recentAnomalies: Array<{
        time: string;
        type: string;
        status: string;
      }>;
    }>,
    required: true,
  },
});

const getStatusColor = (status: string) => {
  switch (status) {
    case "正常":
      return "green";
    case "可疑":
      return "orange";
    case "异常":
      return "red";
    default:
      return "gray";
  }
};

// 模拟数据
const candidates = [
  { name: "张三", status: "正常", cameraStatus: "正常", hasAnomaly: false },
  { name: "李四", status: "可疑", cameraStatus: "断线", hasAnomaly: true },
  { name: "王五", status: "正常", cameraStatus: "正常", hasAnomaly: false },
];
</script>

<style lang="less" scoped>
.exam-monitoring-panel {
  padding: 16px;
  background: var(--color-bg-2);
  border-radius: 4px;

  .monitoring-list {
    margin-top: 12px;

    :deep(.arco-list-item) {
      padding: 12px 0;
      border-bottom: 1px solid var(--color-border-2);
    }
  }

  .text-right {
    text-align: right;
  }
}
</style>

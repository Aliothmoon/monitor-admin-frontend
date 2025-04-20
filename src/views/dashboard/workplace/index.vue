<template>
  <div class="container">
    <div class="left-side">
      <div class="panel">
        <Banner />
        <DataPanel />
<!--        <ContentChart />-->
      </div>
      <a-row :gutter="24" class="monitor-stats">
          <a-col :span="6">
            <a-statistic
              title="当前考试场次"
              :value="stats.activeExams"
              value-style="color: #0D6EFD"
            />
          </a-col>
          <a-col :span="6">
            <a-statistic
              title="异常事件"
              :value="stats.anomalies"
              value-style="color: #DC3545"
            />
          </a-col>
          <a-col :span="6">
            <a-statistic
              title="监考员在线"
              :value="`${stats.onlineProctors}/${stats.totalProctors}`"
              value-style="color: #198754"
            />
          </a-col>
          <a-col :span="6">
            <a-statistic
              title="考生在线"
              :value="stats.onlineCandidates"
              value-style="color: #FFC107"
            />
          </a-col>
        </a-row>
        <a-grid :cols="24" :col-gap="16" :row-gap="16" style="margin-top: 16px">
        
      </a-grid>
    </div>
    <div class="right-side">
      <a-grid :cols="24" :row-gap="16">
        <a-grid-item :span="24">
          <ExamMonitoring :stats="stats" />
        </a-grid-item>
        <a-grid-item :span="24">
          <AnomalyTrack :anomalies="stats.recentAnomalies" />
        </a-grid-item>
      </a-grid>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getMonitorStats } from './index';
  import Banner from './components/banner.vue';
  import DataPanel from './components/data-panel.vue';
  import ContentChart from './components/content-chart.vue';
  import ExamMonitoring from './components/exam-monitoring.vue';
  import AnomalyTrack from './components/anomaly-track.vue';


const loading = ref(true);

const stats = ref({
  activeExams: 0,
  anomalies: 0,
  onlineProctors: 0,
  totalProctors: 0,
  onlineCandidates: 0
});

const fetchStats = async () => {
  try {
    const { data } = await getMonitorStats();
    stats.value = data;
  } finally {
    loading.value = false;
  }
};

fetchStats();
</script>

<script lang="ts">
  export default {
    name: 'Dashboard', // If you want the include property of keep-alive to take effect, you must name the component
  };


const loading = ref(true);

const stats = ref({
  activeExams: 0,
  anomalies: 0,
  onlineProctors: 0,
  totalProctors: 0,
  onlineCandidates: 0
});

const fetchStats = async () => {
  try {
    const { data } = await getMonitorStats();
    stats.value = data;
  } finally {
    loading.value = false;
  }
};

fetchStats();
</script>

<style lang="less" scoped>
  .container {
    background-color: var(--color-fill-2);
    padding: 16px 20px;
    padding-bottom: 0;
    display: flex;
  }

  .left-side {
    flex: 1;
    overflow: auto;
  }

  .right-side {
    width: 280px;
    margin-left: 16px;
  }

  .panel {
    background-color: var(--color-bg-2);
    border-radius: 4px;
    overflow: auto;
  }
  :deep(.panel-border) {
    margin-bottom: 0;
    border-bottom: 1px solid rgb(var(--gray-2));
  }
  .moduler-wrap {
    border-radius: 4px;
    background-color: var(--color-bg-2);
    :deep(.text) {
      font-size: 12px;
      text-align: center;
      color: rgb(var(--gray-8));
    }

    :deep(.wrapper) {
      margin-bottom: 8px;
      text-align: center;
      cursor: pointer;

      &:last-child {
        .text {
          margin-bottom: 0;
        }
      }
      &:hover {
        .icon {
          color: rgb(var(--arcoblue-6));
          background-color: #e8f3ff;
        }
        .text {
          color: rgb(var(--arcoblue-6));
        }
      }
    }

    :deep(.icon) {
      display: inline-block;
      width: 32px;
      height: 32px;
      margin-bottom: 4px;
      color: rgb(var(--dark-gray-1));
      line-height: 32px;
      font-size: 16px;
      text-align: center;
      background-color: rgb(var(--gray-1));
      border-radius: 4px;
    }
  }
</style>

<style lang="less" scoped>
  // responsive
  .mobile {
    .container {
      display: block;
    }
    .right-side {
      // display: none;
      width: 100%;
      margin-left: 0;
      margin-top: 16px;
    }
  }
</style>

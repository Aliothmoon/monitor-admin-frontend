<template>
  <div class="container-form">
    <div class="left-side">
      <div class="panel overview-panel">
        <a-row :gutter="16" class="welcome-section">
          <a-col :span="16">
            <a-typography-title :heading="5" style="margin-top: 0">
              欢迎回来，{{ userInfo.name }} - 在线考试监考系统
            </a-typography-title>
            <a-typography-paragraph type="secondary">
              当前有
              <a-tag color="blue">{{ stats.activeExams }}</a-tag>
              场考试需要监控
            </a-typography-paragraph>
          </a-col>
          <a-col :span="8" class="text-right">
            <a-button type="primary" status="success">
              <template #icon>
                <icon-video-camera />
              </template>
              立即进入监考
            </a-button>
          </a-col>
        </a-row>
        <a-divider class="panel-border" />

        <a-row :gutter="16" class="monitor-stats">
          <a-col :span="6">
            <a-card class="stat-card">
              <a-statistic
                title="当前考试场次"
                :value="stats.activeExams"
                animation
              >
                <template #prefix>
                  <icon-calendar class="stat-icon blue-icon" />
                </template>
              </a-statistic>
              <div class="stat-footer">
                <a-tag size="small">今日考试总数: {{ stats.totalExams }}</a-tag>
              </div>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card class="stat-card warning-card">
              <a-statistic title="异常事件" :value="stats.anomalies" animation>
                <template #prefix>
                  <icon-exclamation-circle class="stat-icon red-icon" />
                </template>
              </a-statistic>
              <div class="stat-footer">
                <a-tag color="red" size="small"
                  >需要处理: {{ stats.pendingAnomalies }}</a-tag
                >
              </div>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card class="stat-card">
              <a-statistic
                title="监考员在线"
                :value="stats.onlineProctors"
                animation
              >
                <template #suffix> / {{ stats.totalProctors }} </template>
                <template #prefix>
                  <icon-user class="stat-icon green-icon" />
                </template>
              </a-statistic>
              <div class="stat-footer">
                <a-tag color="green" size="small"
                  >在线率:
                  {{
                    Math.round(
                      (stats.onlineProctors / stats.totalProctors) * 100
                    )
                  }}%
                </a-tag>
              </div>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card class="stat-card">
              <a-statistic
                title="考生在线"
                :value="stats.onlineCandidates"
                animation
              >
                <template #prefix>
                  <icon-user-group class="stat-icon yellow-icon" />
                </template>
              </a-statistic>
              <div class="stat-footer">
                <a-link
                  >查看考生分布
                  <icon-right />
                </a-link>
              </div>
            </a-card>
          </a-col>
        </a-row>

        <a-row :gutter="16" style="margin-top: 16px">
          <a-col :span="12">
            <a-card class="exam-schedule-card">
              <template #title>
                <a-space>
                  <icon-calendar />
                  <span>考试日程</span>
                </a-space>
              </template>
              <a-list :bordered="false" :max-height="300">
                <a-list-item v-for="(exam, index) in examSchedule" :key="index">
                  <a-space direction="vertical" fill style="width: 100%">
                    <a-row justify="space-between">
                      <a-col>
                        <a-space>
                          <a-tag :color="getStatusColor(exam.status)">{{
                            exam.status
                          }}</a-tag>
                          <span>{{ exam.name }}</span>
                        </a-space>
                      </a-col>
                      <a-col>
                        <a-space>
                          <a-tag>{{ exam.time }}</a-tag>
                          <a-tag>{{ exam.duration }}分钟</a-tag>
                        </a-space>
                      </a-col>
                    </a-row>
                    <a-row justify="space-between">
                      <a-col>
                        <a-space>
                          <icon-user />
                          {{ exam.proctor }}
                        </a-space>
                      </a-col>
                      <a-col>
                        <a-space>
                          <icon-user-group />
                          {{ exam.candidateCount }} 名考生
                          <a-button
                            v-if="exam.status === '进行中'"
                            type="text"
                            size="mini"
                          >
                            监控
                          </a-button>
                        </a-space>
                      </a-col>
                    </a-row>
                  </a-space>
                </a-list-item>
              </a-list>
            </a-card>
          </a-col>
          <a-col :span="12">
            <a-card class="live-monitoring-card">
              <template #title>
                <a-space>
                  <icon-video-camera />
                  <span>实时监控</span>
                </a-space>
              </template>
              <div v-if="loading" class="loading-container">
                <a-spin />
              </div>
              <div v-else class="camera-grid">
                <div
                  v-for="candidate in candidateLiveData"
                  :key="candidate.id"
                  class="camera-cell"
                  :class="{ warning: candidate.hasAnomaly }"
                >
                  <div class="camera-overlay" v-if="candidate.hasAnomaly">
                    <icon-exclamation-circle />
                    <span>{{ candidate.anomalyType }}</span>
                  </div>
                  <div class="camera-info">
                    <span
                      >{{ candidate.name }}
                      <a-tag
                        :color="
                          candidate.cameraStatus === '正常' ? 'green' : 'red'
                        "
                        size="small"
                        >{{ candidate.cameraStatus }}</a-tag
                      ></span
                    >
                  </div>
                </div>
              </div>
              <template #extra>
                <a-button type="text">
                  点击查看考场
                  <icon-right />
                </a-button>
              </template>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </div>
    <!--    <div class="right-side">-->
    <!--      <a-card class="activity-card">-->
    <!--        <template #title>-->
    <!--          <a-space>-->
    <!--            <icon-notification />-->
    <!--            <span>系统通知</span>-->
    <!--            <a-badge count="3" dot />-->
    <!--          </a-space>-->
    <!--        </template>-->
    <!--        <a-timeline>-->
    <!--          <a-timeline-item v-for="(notification, index) in systemNotifications" :key="index">-->
    <!--            <div class="timeline-title">{{ notification.title }}</div>-->
    <!--            <div class="timeline-content">{{ notification.content }}</div>-->
    <!--            <div class="timeline-time">{{ notification.time }}</div>-->
    <!--          </a-timeline-item>-->
    <!--        </a-timeline>-->
    <!--      </a-card>-->
    <!--      -->
    <!--&lt;!&ndash;      <AnomalyTrack :anomalies="recentAnomalies" style="margin-top: 16px" />&ndash;&gt;-->
    <!--&lt;!&ndash;      &ndash;&gt;-->
    <!--&lt;!&ndash;      <a-card class="quick-actions-card" title="快捷操作" style="margin-top: 16px">&ndash;&gt;-->
    <!--&lt;!&ndash;        <a-grid :cols="3" :colGap="8" :rowGap="8">&ndash;&gt;-->
    <!--&lt;!&ndash;          <a-grid-item v-for="(action, index) in quickActions" :key="index">&ndash;&gt;-->
    <!--&lt;!&ndash;            <a-button class="action-button" :status="action.status">&ndash;&gt;-->
    <!--&lt;!&ndash;              <template #icon>&ndash;&gt;-->
    <!--&lt;!&ndash;                <component :is="action.icon" />&ndash;&gt;-->
    <!--&lt;!&ndash;              </template>&ndash;&gt;-->
    <!--&lt;!&ndash;              {{ action.name }}&ndash;&gt;-->
    <!--&lt;!&ndash;            </a-button>&ndash;&gt;-->
    <!--&lt;!&ndash;          </a-grid-item>&ndash;&gt;-->
    <!--&lt;!&ndash;        </a-grid>&ndash;&gt;-->
    <!--&lt;!&ndash;      </a-card>&ndash;&gt;-->
    <!--    </div>-->
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import {
  getMonitorStats,
  getExamSchedule,
  getSystemNotifications,
  getCandidateLiveData,
} from "./index";
import AnomalyTrack from "./components/anomaly-track.vue";
import { useUserStore } from "@/store";

const userStore = useUserStore();
const userInfo = computed(() => {
  return {
    name: userStore.name || "监考教师",
  };
});

const loading = ref(true);

const stats = ref({
  activeExams: 0,
  totalExams: 0,
  anomalies: 0,
  pendingAnomalies: 0,
  onlineProctors: 0,
  totalProctors: 0,
  onlineCandidates: 0,
});

// 考试日程数据
const examSchedule = ref([]);

// 系统通知数据
const systemNotifications = ref([]);

// 异常事件数据
const recentAnomalies = ref([]);

// 实时监控数据
const candidateLiveData = ref([]);

// 快捷操作数据
const quickActions = ref([
  { name: "紧急暂停", icon: "icon-pause-circle", status: "danger" as const },
  { name: "全体通知", icon: "icon-notification", status: "warning" as const },
  { name: "延长时间", icon: "icon-clock-circle", status: "normal" as const },
  { name: "添加监考", icon: "icon-user-add", status: "normal" as const },
  { name: "导出记录", icon: "icon-export", status: "normal" as const },
  { name: "系统设置", icon: "icon-settings", status: "normal" as const },
]);

const getStatusColor = (status: string) => {
  switch (status) {
    case "进行中":
      return "green";
    case "即将开始":
      return "blue";
    case "已结束":
      return "gray";
    case "已排期":
      return "purple";
    default:
      return "gray";
  }
};

const fetchData = async () => {
  try {
    loading.value = true;

    // 并行获取所有数据
    const [statsRes, examRes, notificationsRes, liveDataRes] =
      await Promise.all([
        getMonitorStats(),
        getExamSchedule(),
        getSystemNotifications(),
        getCandidateLiveData(),
      ]);

    stats.value = statsRes.data;
    recentAnomalies.value = statsRes.data.recentAnomalies || [];
    examSchedule.value = examRes.data;
    systemNotifications.value = notificationsRes.data;
    candidateLiveData.value = liveDataRes.data;
  } catch (error) {
    console.error("获取数据失败:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<script lang="ts">
export default {
  name: "Dashboard", // 保留组件名称，使keep-alive生效
};
</script>

<style lang="less" scoped>
.container-form {
  background-color: var(--color-fill-2);
  padding: 16px 20px;
  display: flex;
  gap: 16px;
}

.left-side {
  flex: 1;
  overflow: auto;
}

.right-side {
  width: 300px;
}

.panel {
  background-color: var(--color-bg-2);
  border-radius: 4px;
  overflow: auto;
}

.overview-panel {
  padding: 20px;
}

.welcome-section {
  margin-bottom: 16px;
}

.text-right {
  text-align: right;
}

:deep(.panel-border) {
  margin: 10px 0;
  border-bottom: 1px solid rgb(var(--gray-2));
}

.monitor-stats {
  .stat-card {
    height: 100%;
    border-radius: 4px;

    &.warning-card {
      background-color: rgba(var(--red-1), 0.1);
    }

    .stat-icon {
      font-size: 24px;
      margin-right: 8px;

      &.blue-icon {
        color: rgb(var(--arcoblue-6));
      }

      &.red-icon {
        color: rgb(var(--red-6));
      }

      &.green-icon {
        color: rgb(var(--green-6));
      }

      &.yellow-icon {
        color: rgb(var(--orange-6));
      }
    }

    .stat-footer {
      margin-top: 8px;
    }
  }
}

.exam-schedule-card,
.live-monitoring-card,
.activity-card,
.quick-actions-card {
  height: 100%;

  :deep(.arco-list-item) {
    padding: 12px 0;

    &:not(:last-child) {
      border-bottom: 1px solid var(--color-border-2);
    }
  }
}

.camera-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;

  .camera-cell {
    position: relative;
    aspect-ratio: 16 / 9;
    background-color: rgba(var(--gray-8), 0.8);
    border-radius: 4px;
    overflow: hidden;

    &.warning {
      border: 2px solid rgb(var(--red-6));
    }

    .camera-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: rgba(var(--red-6), 0.2);
      color: rgb(var(--red-6));
      font-size: 16px;
    }

    .camera-info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 4px 8px;
      background-color: rgba(0, 0, 0, 0.6);
      color: white;
      font-size: 12px;
    }
  }
}

.activity-card {
  .timeline-title {
    font-weight: 500;
    margin-bottom: 4px;
  }

  .timeline-content {
    color: var(--color-text-3);
    font-size: 13px;
  }

  .timeline-time {
    font-size: 12px;
    color: var(--color-text-4);
    margin-top: 4px;
  }
}

.quick-actions-card {
  .action-button {
    width: 100%;
    display: flex;
    flex-direction: column;
    height: auto;
    padding: 12px 0;

    :deep(.arco-icon) {
      font-size: 20px;
      margin-bottom: 4px;
    }
  }
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

// 响应式
@media screen and (max-width: 1200px) {
  .container-form {
    flex-direction: column;
  }

  .right-side {
    width: 100%;
    margin-top: 16px;
  }

  .monitor-stats {
    :deep(.arco-col) {
      margin-bottom: 16px;
    }
  }
}
</style>

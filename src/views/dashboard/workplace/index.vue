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
            <a-button status="success" type="primary" @click="$router.push('/exam/manage')">
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
                :value="stats.activeExams"
                animation
                title="当前考试场次"
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
              <a-statistic :value="stats.anomalies" animation title="异常事件">
                <template #prefix>
                  <icon-exclamation-circle class="stat-icon red-icon" />
                </template>
              </a-statistic>
              <div class="stat-footer">
                <a-tag color="red" size="small"
                  >需要处理: {{ stats.pendingAnomalies }}
                </a-tag>
              </div>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card class="stat-card">
              <a-statistic
                :value="stats.onlineProctors"
                animation
                title="监考员在线"
              >
                <template #suffix> / {{ stats.totalProctors }}</template>
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
                :value="stats.onlineCandidates"
                animation
                title="考生在线"
              >
                <template #prefix>
                  <icon-user-group class="stat-icon yellow-icon" />
                </template>
              </a-statistic>
              <div class="stat-footer">
                <a-link @click="$router.push('/users/candidate-accounts')">
                  查看考生分布
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
                          <a-tag :color="getStatusColor(exam.status)"
                            >{{ exam.status }}
                          </a-tag>
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
                            size="mini"
                            type="text"
                            @click="$router.push('/exam/manage')"
                          >
                            监控
                          </a-button>
                        </a-space>
                      </a-col>
                    </a-row>
                  </a-space>
                </a-list-item>
                <a-list-item v-if="examSchedule.length === 0">
                  <a-empty description="暂无考试数据" />
                </a-list-item>
              </a-list>
            </a-card>
          </a-col>
          <a-col :span="12">
            <a-card class="live-monitoring-card">
              <template #title>
                <a-space>
                  <icon-video-camera />
                  <span>考试监控</span>
                </a-space>
              </template>
              <div v-if="loading" class="loading-container">
                <a-spin />
              </div>
              <div v-else-if="examSchedule.length === 0" class="placeholder-container">
                <a-empty description="暂无进行中的考试">
                  <template #image>
                    <icon-video-camera style="font-size: 48px; opacity: 0.25" />
                  </template>
                  <a-button type="primary" @click="$router.push('/exam/manage')">
                    创建考试
                  </a-button>
                </a-empty>
              </div>
              <div v-else class="placeholder-container">
                <div class="text-center">
                  <a-space direction="vertical" align="center">
                    <icon-video-camera style="font-size: 48px; opacity: 0.5" />
                    <div>请进入考试监控页面查看详细监控信息</div>
    
                  </a-space>
                </div>
              </div>
              <template #extra>
                <a-button type="text" @click="$router.push('/exam/manage')">
                  点击查看考场
                  <icon-right />
                </a-button>
              </template>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/store";
import axios from "axios";

const userStore = useUserStore();
const userInfo = computed(() => {
  return {
    name: userStore.username || "监考教师",
  };
});

const loading = ref(true);

// 简化的统计数据
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

// 实时监控数据
const candidateLiveData = ref([]);

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

// 获取考试数据，可以从真实接口获取
const fetchExams = async () => {
  try {
    // 调用后端接口获取考试列表
    const res = await axios.get("/dashboard/exams", {
      params: {
        limit: 5
      }
    }).catch(() => {
      // 接口异常时使用模拟数据
      return {
        data: {
          data: [
            {
              name: "2023-数据结构",
              status: "进行中",
              time: "09:00-11:00",
              duration: 120,
              proctor: "王教授",
              candidateCount: 48,
            },
            {
              name: "2023-算法实现",
              status: "即将开始",
              time: "13:30-15:30",
              duration: 120,
              proctor: "李教授",
              candidateCount: 60,
            },
            {
              name: "计算机网络原理",
              status: "已结束",
              time: "08:00-10:00",
              duration: 120,
              proctor: "张教授",
              candidateCount: 42,
            }
          ]
        }
      }
    });

    examSchedule.value = res.data.data || [];
  } catch (error) {
    console.error("获取考试数据失败:", error);
    // 设置一些默认数据
    examSchedule.value = [];
  }
};

// 获取统计数据
const fetchStats = async () => {
  try {
    // 调用后端接口获取统计数据
    const res = await axios.get("/dashboard/stats").catch(() => {
      // 接口异常时使用模拟数据
      return {
        data: {
          data: {
            activeExams: 2,
            totalExams: 5,
            anomalies: 3,
            pendingAnomalies: 1,
            onlineProctors: 5,
            totalProctors: 10,
            onlineCandidates: 45,
          }
        }
      }
    });
    
    stats.value = res.data.data || {
      activeExams: 0,
      totalExams: 0,
      anomalies: 0,
      pendingAnomalies: 0,
      onlineProctors: 0,
      totalProctors: 0,
      onlineCandidates: 0,
    };
  } catch (error) {
    console.error("获取统计数据失败:", error);
    // 出错时重置数据
    stats.value = {
      activeExams: 0,
      totalExams: 0,
      anomalies: 0,
      pendingAnomalies: 0,
      onlineProctors: 0,
      totalProctors: 0,
      onlineCandidates: 0,
    };
  }
};

const fetchData = async () => {
  try {
    loading.value = true;
    
    // 获取数据
    await Promise.all([
      fetchExams(),
      fetchStats()
    ]);
    
    // 简化的实时监控数据
    candidateLiveData.value = Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      name: `考生${i + 1}`,
      status: i === 2 ? "异常" : "正常",
      hasAnomaly: i === 2,
      anomalyType: i === 2 ? "可疑行为" : null,
      cameraStatus: i === 4 ? "断线" : "正常",
    }));
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

.text-center {
  text-align: center;
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
.live-monitoring-card {
  height: 100%;

  :deep(.arco-list-item) {
    padding: 12px 0;

    &:not(:last-child) {
      border-bottom: 1px solid var(--color-border-2);
    }
  }
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.placeholder-container {
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

  .monitor-stats {
    :deep(.arco-col) {
      margin-bottom: 16px;
    }
  }
}
</style>

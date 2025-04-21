<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

// 创建随机屏幕截图路径 (使用picsum.photos服务提供随机图片)
const getRandomScreenshot = (id: number) =>
  `https://picsum.photos/800/600?random=${id}`;

// 模拟数据
const studentInfo = ref({
  name: "张三",
  id: "20230001",
  examName: "2023年度计算机基础考试",
  status: "online", // online, offline
  screenCapture: getRandomScreenshot(1),
  switchCount: 5,
  lastActiveTime: "10:30:45",
});

// 网站访问记录
const visitedWebsites = ref([
  {
    id: 1,
    url: "https://www.baidu.com",
    time: "10:15:30",
    risk: "normal",
    description: "搜索引擎",
  },
  {
    id: 2,
    url: "https://www.google.com",
    time: "10:16:45",
    risk: "normal",
    description: "搜索引擎",
  },
  {
    id: 3,
    url: "https://chat.openai.com",
    time: "10:20:12",
    risk: "warning",
    description: "AI助手(违规)",
  },
  {
    id: 4,
    url: "https://www.github.com",
    time: "10:25:30",
    risk: "normal",
    description: "代码仓库",
  },
]);

// 后台进程列表
const backgroundProcesses = ref([
  { id: 1, name: "Chrome.exe", status: "normal", description: "浏览器" },
  { id: 2, name: "Word.exe", status: "normal", description: "文档编辑器" },
  { id: 3, name: "QQ.exe", status: "warning", description: "聊天软件(违规)" },
  {
    id: 4,
    name: "WeChat.exe",
    status: "warning",
    description: "聊天软件(违规)",
  },
]);

// 截图列表 - 使用随机图片
const screenshots = ref([
  {
    id: 1,
    time: "10:10:00",
    url: getRandomScreenshot(10),
    hasWarning: false,
    analysis: "正常考试状态",
  },
  {
    id: 2,
    time: "10:15:00",
    url: getRandomScreenshot(20),
    hasWarning: true,
    analysis: "检测到非考试应用",
  },
  {
    id: 3,
    time: "10:20:00",
    url: getRandomScreenshot(30),
    hasWarning: false,
    analysis: "正常考试状态",
  },
  {
    id: 4,
    time: "10:25:00",
    url: getRandomScreenshot(40),
    hasWarning: true,
    analysis: "检测到使用手机",
  },
]);

// 截图分析记录
const analysisRecords = ref([
  { id: 1, time: "10:15:05", content: "检测到切屏行为", level: "info" },
  {
    id: 2,
    time: "10:15:10",
    content: "打开了非授权应用: QQ",
    level: "warning",
  },
  {
    id: 3,
    time: "10:20:15",
    content: "访问了违规网站: chat.openai.com",
    level: "danger",
  },
  { id: 4, time: "10:25:30", content: "返回考试页面", level: "success" },
]);

// 获取状态对应的颜色
const getStatusColor = (status: string) => {
  return status === "online" ? "green" : "red";
};

// 获取风险等级对应的颜色
const getRiskColor = (risk: string) => {
  return risk === "normal" ? "blue" : "red";
};

// 获取分析记录等级对应的颜色
const getAnalysisColor = (level: string) => {
  switch (level) {
    case "info":
      return "blue";
    case "warning":
      return "orange";
    case "danger":
      return "red";
    case "success":
      return "green";
    default:
      return "gray";
  }
};

// 刷新屏幕截图
const refreshScreenshot = () => {
  studentInfo.value.screenCapture = getRandomScreenshot(
    Math.floor(Math.random() * 100)
  );
};

// 操作函数
const sendWarning = () => {
  // eslint-disable-next-line no-alert
  alert("已向考生发送警告");
};

const lockScreen = () => {
  // eslint-disable-next-line no-alert
  alert("已锁定考生屏幕");
};

const forceRefresh = () => {
  refreshScreenshot();
  // eslint-disable-next-line no-alert
  alert("已强制刷新考生页面");
};

// 定时刷新屏幕截图（模拟实时监控）
let autoRefreshInterval: number | null = null;

// 自动刷新功能
const toggleAutoRefresh = (enable: boolean) => {
  if (enable && !autoRefreshInterval) {
    autoRefreshInterval = window.setInterval(() => {
      if (studentInfo.value.status === "online") {
        refreshScreenshot();
      }
    }, 5000); // 每5秒刷新一次
  } else if (!enable && autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
    autoRefreshInterval = null;
  }
};

onMounted(() => {
  // 启动自动刷新
  toggleAutoRefresh(true);
  console.log("监控页面已加载");
});

// 组件卸载时清除定时器
onUnmounted(() => {
  toggleAutoRefresh(false);
});
</script>

<template>
  <div class="monitor-single">
    <a-card class="header-card">
      <template #title>
        <a-typography-title :heading="4" style="margin: 0"
          >单人监控
        </a-typography-title>
      </template>
      <a-space size="medium">
        <a-descriptions
          :data="[
            { label: '考生', value: studentInfo.name },
            { label: '学号', value: studentInfo.id },
            { label: '考试', value: studentInfo.examName },
          ]"
          :column="3"
          layout="inline-horizontal"
        />
        <a-tag :color="getStatusColor(studentInfo.status)" size="medium">
          <template #icon>
            <div class="status-dot"></div>
          </template>
          {{ studentInfo.status === "online" ? "在线" : "离线" }}
        </a-tag>
        <span v-if="studentInfo.status === 'online'">
          最后活动: {{ studentInfo.lastActiveTime }}
        </span>
      </a-space>
    </a-card>

    <div class="monitor-content">
      <!-- 左侧屏幕显示区域 -->
      <div class="screen-section">
        <a-card class="screen-card">
          <template #title>
            <div>考生屏幕</div>
          </template>
          <template #extra>
            <a-space size="medium" class="mt-2">
              <a-button type="outline" status="warning" @click="sendWarning">
                <template #icon>
                  <icon-align-left />
                </template>
                发送警告
              </a-button>
              <a-button status="danger" @click="lockScreen">
                <template #icon>
                  <icon-lock />
                </template>
                锁定屏幕
              </a-button>
              <a-button type="primary" @click="forceRefresh">
                <template #icon>
                  <icon-refresh />
                </template>
                强制刷新
              </a-button>
            </a-space>
          </template>
          <div
            class="screen-container"
            :class="{ offline: studentInfo.status === 'offline' }"
          >
            <a-image
              v-if="studentInfo.status === 'online'"
              :src="studentInfo.screenCapture"
              alt="考生屏幕"
              :preview="false"
              width="100%"
              height="100%"
            />
            <a-empty v-else description="考生已离线">
              <template #image>
                <icon-poweroff style="fontsize: 48px; color: #f5222d" />
              </template>
              <a-typography-text type="secondary"
                >考生可能已断开连接或关闭了监控客户端
              </a-typography-text>
            </a-empty>
          </div>
        </a-card>
      </div>

      <!-- 右侧信息区域 -->
      <a-card class="info-section">
        <a-tabs type="card">
          <a-tab-pane key="2" title="访问网站">
            <a-card class="info-card" :bordered="false">
              <a-list :data="visitedWebsites">
                <template #item="{ item }">
                  <a-list-item>
                    <a-space direction="vertical" style="width: 100%">
                      <a-space justify="space-between" fill>
                        <a-typography-text>{{ item.time }}</a-typography-text>
                        <a-tag :color="getRiskColor(item.risk)">
                          {{ item.risk === "warning" ? "风险" : "正常" }}
                        </a-tag>
                      </a-space>
                      <a-typography-paragraph>
                        <a-typography-text bold
                          >{{ item.url }}
                        </a-typography-text>
                      </a-typography-paragraph>
                      <a-typography-text type="secondary"
                        >{{ item.description }}
                      </a-typography-text>
                    </a-space>
                  </a-list-item>
                </template>
              </a-list>
            </a-card>
          </a-tab-pane>

          <a-tab-pane key="3" title="后台进程">
            <a-card class="info-card" :bordered="false">
              <a-list :data="backgroundProcesses">
                <template #item="{ item }">
                  <a-list-item>
                    <a-space justify="space-between" fill>
                      <a-space direction="vertical">
                        <a-typography-text bold
                          >{{ item.name }}
                        </a-typography-text>
                        <a-typography-text type="secondary"
                          >{{ item.description }}
                        </a-typography-text>
                      </a-space>
                      <a-tag
                        :color="item.status === 'warning' ? 'red' : 'blue'"
                      >
                        {{ item.status === "warning" ? "风险" : "正常" }}
                      </a-tag>
                    </a-space>
                  </a-list-item>
                </template>
              </a-list>
            </a-card>
          </a-tab-pane>

          <a-tab-pane key="4" title="自动截图">
            <a-card class="info-card" :bordered="false">
              <a-grid
                :cols="{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }"
                :col-gap="12"
                :row-gap="12"
              >
                <a-grid-item
                  v-for="screenshot in screenshots"
                  :key="screenshot.id"
                >
                  <a-card
                    :bordered="false"
                    :class="{ 'warning-screenshot': screenshot.hasWarning }"
                    class="screenshot-card"
                  >
                    <a-image
                      :src="screenshot.url"
                      alt="截图"
                      :preview="true"
                      width="100%"
                      height="100px"
                    />
                    <div class="screenshot-info">
                      <a-space
                        justify="space-between"
                        fill
                        style="margin-top: 4px"
                      >
                        <a-typography-text
                          type="secondary"
                          style="font-size: 12px"
                          >{{ screenshot.time }}
                        </a-typography-text>
                        <a-tag
                          v-if="screenshot.hasWarning"
                          color="red"
                          size="small"
                          >异常
                        </a-tag>
                      </a-space>
                      <a-tooltip :content="screenshot.analysis">
                        <a-typography-text
                          type="secondary"
                          style="
                            font-size: 12px;
                            display: block;
                            margin-top: 4px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                          "
                        >
                          {{ screenshot.analysis }}
                        </a-typography-text>
                      </a-tooltip>
                    </div>
                  </a-card>
                </a-grid-item>
              </a-grid>
            </a-card>
          </a-tab-pane>

          <a-tab-pane key="5" title="行为分析">
            <a-card class="info-card" :bordered="false">
              <div class="timeline-container">
                <a-timeline>
                  <a-timeline-item
                    v-for="record in analysisRecords"
                    :key="record.id"
                    :line-type="
                      record.level === 'warning' || record.level === 'danger'
                        ? 'dashed'
                        : 'solid'
                    "
                    :line-color="getAnalysisColor(record.level)"
                  >
                    <a-space>
                      <a-typography-text
                        type="secondary"
                        style="font-size: 12px"
                        >{{ record.time }}
                      </a-typography-text>
                      <a-typography-text style="font-size: 13px"
                        >{{ record.content }}
                      </a-typography-text>
                    </a-space>
                  </a-timeline-item>
                </a-timeline>
              </div>
            </a-card>
          </a-tab-pane>

          <a-tab-pane key="8" title="切屏次数">
            <a-card class="info-card" :bordered="false">
              <div style="text-align: center">
                <a-statistic
                  :value="studentInfo.switchCount"
                  :title="studentInfo.switchCount > 3 ? '异常' : '正常'"
                  :value-style="{
                    color: studentInfo.switchCount > 3 ? '#f5222d' : '#52c41a',
                    fontSize: '32px',
                  }"
                />
              </div>
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </div>
  </div>
</template>

<style scoped lang="less">
.monitor-single {
  padding: 16px;
  height: 70%;
  background-color: var(--color-fill-2);
  margin: 0 auto;

  .header-card {
    margin-bottom: 8px;
  }

  .monitor-content {
    display: flex;
    gap: 16px;
    min-height: 60%;

    .screen-section {
      flex: 3;
      display: flex;
      flex-direction: column;

      .screen-card {
        flex: 1;

        .screen-container {
          height: calc(60vh - 48px);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    .info-section {
      flex: 2;
      overflow: auto;

      :deep(.arco-tabs) {
        height: 100%;

        .arco-tabs-content {
          padding: 12px 0;
          height: calc(100% - 40px);
          overflow: auto;
        }

        .arco-tabs-nav {
          margin-bottom: 0;
        }

        .arco-tabs-nav-tab {
          justify-content: space-between;
        }

        .arco-tabs-tab {
          font-size: 14px;
          padding: 8px 12px;
        }
      }

      .info-card {
        width: 100%;
        height: 100%;

        :deep(.arco-card-body) {
          padding: 12px;
          height: 100%;
          overflow: auto;
        }

        :deep(.arco-card-header) {
          padding: 12px 16px;
        }
      }

      .warning-screenshot {
        border: 1px solid var(--color-danger-light-4);
      }
    }
  }
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: currentColor;
  margin-right: 4px;
}

// 优化截图网格
:deep(.arco-grid) {
  .arco-grid-item {
    height: auto;
  }
}

.screenshot-card {
  height: 100%;

  :deep(.arco-card-body) {
    padding: 8px;
    display: flex;
    flex-direction: column;
  }

  .screenshot-info {
    margin-top: 4px;
  }
}

.timeline-container {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-neutral-4);
    border-radius: 2px;
  }
}
</style>

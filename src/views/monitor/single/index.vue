<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

// 获取路由实例和当前路由
const router = useRouter();
const route = useRoute();

// 从路由中获取考生ID、考试ID和学生ID
const candidateId = ref(route.query.id ? Number(route.query.id) : null);
const examId = ref(route.query.examId ? Number(route.query.examId) : null);
const studentId = ref(route.query.studentId ? String(route.query.studentId) : "");
const accountId = ref(route.query.accountId ? Number(route.query.accountId) : null);

// 返回上一级
const goBack = () => {
  router.back();
};

// 创建随机屏幕截图路径 (使用picsum.photos服务提供随机图片)
const getRandomScreenshot = (id: number) =>
  `https://picsum.photos/800/600?random=${id}`;

// 学生信息
const studentInfo = ref({
  name: "",
  id: "",
  examName: "",
  status: "offline", // online, offline
  screenCapture: "",
  switchCount: 0,
  lastActiveTime: "",
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

// 获取考生详细信息
const fetchCandidateDetails = async () => {
  if (!candidateId.value) return;
  
  try {
    // 获取考生信息
    const response = await axios.get(`/examinee/detail/${candidateId.value}`);
    
    if (response.data.code === 0) {
      const data = response.data.data;
      
      studentInfo.value = {
        name: data.name || "未知姓名",
        id: data.studentId || "未知学号",
        examName: data.examName || "未知考试",
        status: data.status === 1 ? "online" : "offline",
        screenCapture: data.screenshot || getRandomScreenshot(candidateId.value),
        switchCount: data.switchCount || 0,
        lastActiveTime: data.lastActivity || new Date().toLocaleTimeString(),
      };
      
      // 更新accountId
      if (data.accountId && !accountId.value) {
        accountId.value = data.accountId;
      }
      
      // 更新examId
      if (data.examId && !examId.value) {
        examId.value = data.examId;
      }
    }
  } catch (error) {
    console.error("获取考生详情失败:", error);
    
    // 使用临时数据
    studentInfo.value = {
      name: "考生" + candidateId.value,
      id: studentId.value || "未知学号",
      examName: "考试信息加载中...",
      status: "online",
      screenCapture: getRandomScreenshot(candidateId.value),
      switchCount: 0,
      lastActiveTime: new Date().toLocaleTimeString(),
    };
  }
  
  // 如果有考试ID，获取考试信息
  if (examId.value) {
    try {
      const examResponse = await axios.get(`/exam/detail/${examId.value}`);
      if (examResponse.data.code === 0) {
        studentInfo.value.examName = examResponse.data.data.name || "未知考试";
      }
    } catch (error) {
      console.error("获取考试信息失败:", error);
    }
  }
  
  // 获取考生监控数据
  await fetchScreenshots();
  await fetchWebsiteVisits();
  await fetchProcessRecords();
  await fetchBehaviorAnalysis();
};

// 获取考生自动截图列表
const fetchScreenshots = async () => {
  if (!accountId.value || !examId.value) return;
  
  try {
    const response = await axios.get('/monitor/data/screenshots', {
      params: {
        accountId: accountId.value,
        examId: examId.value,
        limit: 10 // 最多获取10张截图
      }
    });
    
    if (response.data.code === 0 && response.data.data) {
      // 更新截图列表
      screenshots.value = response.data.data.map(item => ({
        id: item.id,
        time: item.time,
        url: item.url || getRandomScreenshot(item.id), // 使用URL或备用图片
        hasWarning: item.hasWarning || false,
        analysis: item.analysis || "正常考试状态"
      }));
      
      // 如果有截图，更新屏幕显示
      if (screenshots.value.length > 0 && studentInfo.value.status === "online") {
        studentInfo.value.screenCapture = screenshots.value[0].url;
      }
    }
  } catch (error) {
    console.error("获取截图数据失败:", error);
    // 保留已有的模拟数据
  }
};

// 获取考生最新截图
const fetchLatestScreenshot = async () => {
  if (!accountId.value || !examId.value) return;
  
  try {
    const response = await axios.get('/monitor/data/latest-screenshot', {
      params: {
        accountId: accountId.value,
        examId: examId.value
      }
    });
    
    if (response.data.code === 0 && response.data.data) {
      // 更新当前屏幕显示
      studentInfo.value.screenCapture = response.data.data.url || getRandomScreenshot(Math.random() * 100);
      
      // 如果这是新截图，添加到截图列表的开头
      const newScreenshot = response.data.data;
      const existingIndex = screenshots.value.findIndex(s => s.id === newScreenshot.id);
      
      if (existingIndex === -1) {
        screenshots.value.unshift({
          id: newScreenshot.id,
          time: newScreenshot.time,
          url: newScreenshot.url || getRandomScreenshot(newScreenshot.id),
          hasWarning: newScreenshot.hasWarning || false,
          analysis: newScreenshot.analysis || "正常考试状态"
        });
        
        // 如果列表超过10个，移除最老的
        if (screenshots.value.length > 10) {
          screenshots.value.pop();
        }
      }
    }
  } catch (error) {
    console.error("获取最新截图失败:", error);
    // 使用随机截图作为后备
    refreshScreenshot();
  }
};

// 获取考生访问网站记录
const fetchWebsiteVisits = async () => {
  if (!accountId.value || !examId.value) return;
  
  try {
    const response = await axios.get('/monitor/data/website-visits', {
      params: {
        accountId: accountId.value,
        examId: examId.value
      }
    });
    
    if (response.data.code === 0 && response.data.data) {
      // 更新网站访问记录
      visitedWebsites.value = response.data.data.map(item => ({
        id: item.id,
        url: item.url,
        time: item.time,
        risk: item.risk || (item.riskLevel > 0 ? "warning" : "normal"),
        description: item.description || "网站访问"
      }));
    }
  } catch (error) {
    console.error("获取网站访问记录失败:", error);
    // 保留已有的模拟数据
  }
};

// 获取考生后台进程记录
const fetchProcessRecords = async () => {
  if (!accountId.value || !examId.value) return;
  
  try {
    const response = await axios.get('/monitor/data/process-records', {
      params: {
        accountId: accountId.value,
        examId: examId.value
      }
    });
    
    if (response.data.code === 0 && response.data.data) {
      // 更新后台进程记录
      backgroundProcesses.value = response.data.data.map(item => ({
        id: item.id,
        name: item.name,
        status: item.status || (item.riskLevel > 0 ? "warning" : "normal"),
        description: item.description || "进程信息"
      }));
    }
  } catch (error) {
    console.error("获取后台进程记录失败:", error);
    // 保留已有的模拟数据
  }
};

// 获取考生行为分析记录
const fetchBehaviorAnalysis = async () => {
  if (!accountId.value || !examId.value) return;
  
  try {
    const response = await axios.get('/monitor/data/behavior-analysis', {
      params: {
        accountId: accountId.value,
        examId: examId.value
      }
    });
    
    if (response.data.code === 0 && response.data.data) {
      // 更新行为分析记录
      analysisRecords.value = response.data.data.map(item => ({
        id: item.id,
        time: item.time,
        content: item.content,
        level: item.level || "info"
      }));
      
      // 更新切屏次数
      const switchEvents = analysisRecords.value.filter(
        record => record.content.includes("切屏") || record.content.includes("切换")
      );
      if (switchEvents.length > 0) {
        studentInfo.value.switchCount = switchEvents.length;
      }
    }
  } catch (error) {
    console.error("获取行为分析记录失败:", error);
    // 保留已有的模拟数据
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
const toggleRefresh = () => {
  fetchScreenshots();
  fetchWebsiteVisits();
  fetchProcessRecords();
  fetchBehaviorAnalysis();
};

onMounted(() => {
  // 获取考生详情信息
  fetchCandidateDetails();

  console.log("监控页面已加载", {
    candidateId: candidateId.value,
    examId: examId.value,
    studentId: studentId.value,
    accountId: accountId.value
  });
});


</script>

<template>
  <div class="monitor-single">
    <a-card class="header-card">
      <template #title>
        <a-space>
          <a-button type="text" size="small" @click="goBack">
            <template #icon>
              <icon-arrow-left />
            </template>
            返回
          </a-button>
          <a-divider direction="vertical" />
          <a-typography-title :heading="4" style="margin: 0"
            >单人监控
          </a-typography-title>
        </a-space>
      </template>
      <a-space size="medium">
        <a-descriptions
          :column="3"
          :data="[
            { label: '考生', value: studentInfo.name },
            { label: '学号', value: studentInfo.id },
            { label: '考试', value: studentInfo.examName },
          ]"
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
            <a-space class="mt-2" size="medium">
              <a-button status="warning" type="outline" @click="sendWarning">
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
            :class="{ offline: studentInfo.status === 'offline' }"
            class="screen-container"
          >
            <a-image
              v-if="studentInfo.status === 'online'"
              :preview="false"
              :src="studentInfo.screenCapture"
              alt="考生屏幕"
              height="100%"
              width="100%"
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
        <a-tabs type="card" @change="toggleRefresh">
          <a-tab-pane key="2" title="访问网站">
            <a-card :bordered="false" class="info-card">
              <a-list :data="visitedWebsites">
                <template #item="{ item }">
                  <a-list-item>
                    <a-space direction="vertical" style="width: 100%">
                      <a-space fill justify="space-between">
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
            <a-card :bordered="false" class="info-card">
              <a-list :data="backgroundProcesses">
                <template #item="{ item }">
                  <a-list-item>
                    <a-space fill justify="space-between">
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
            <a-card :bordered="false" class="info-card">
              <div class="screenshots-container">
                <div
                  v-for="screenshot in screenshots"
                  :key="screenshot.id"
                  class="screenshot-item"
                >
                  <a-card
                    :bordered="false"
                    :class="{ 'warning-screenshot': screenshot.hasWarning }"
                    class="screenshot-card"
                  >
                    <a-image
                      :preview="true"
                      :src="screenshot.url"
                      alt="截图"
                      fit="cover"
                      width="100%"
                    />
                    <div class="screenshot-info">
                      <a-space
                        fill
                        justify="space-between"
                        style="margin: 0"
                      >
                        <a-typography-text
                          style="font-size: 12px"
                          type="secondary"
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
                          style="
                            font-size: 12px;
                            display: block;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                          "
                          type="secondary"
                        >
                          {{ screenshot.analysis }}
                        </a-typography-text>
                      </a-tooltip>
                    </div>
                  </a-card>
                </div>
              </div>
            </a-card>
          </a-tab-pane>

          <a-tab-pane key="5" title="行为分析">
            <a-card :bordered="false" class="info-card">
              <div class="timeline-container">
                <a-timeline>
                  <a-timeline-item
                    v-for="record in analysisRecords"
                    :key="record.id"
                    :line-color="getAnalysisColor(record.level)"
                    :line-type="
                      record.level === 'warning' || record.level === 'danger'
                        ? 'dashed'
                        : 'solid'
                    "
                  >
                    <a-space>
                      <a-typography-text
                        style="font-size: 12px"
                        type="secondary"
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
            <a-card :bordered="false" class="info-card">
              <div style="text-align: center">
                <a-statistic
                  :title="studentInfo.switchCount > 3 ? '异常' : '正常'"
                  :value="studentInfo.switchCount"
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

<style lang="less" scoped>
.monitor-single {
  padding: 16px;
  height: 60%;
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
      overflow: hidden;

      :deep(.arco-tabs) {
        height: 100%;

        .arco-tabs-content {
          padding: 12px 0;
          //height: calc(100% - 40px);
          overflow: hidden;
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
        height: 60vh;

        :deep(.arco-card-body) {
          padding: 12px;
          height: calc(60vh - 58px); /* 减去卡片头部的高度 */
          overflow-y: auto;
          overflow-x: hidden;
          
          &::-webkit-scrollbar {
            width: 4px;
          }
          
          &::-webkit-scrollbar-thumb {
            background-color: var(--color-neutral-3);
            border-radius: 4px;
          }
          
          &::-webkit-scrollbar-track {
            background-color: var(--color-neutral-1);
            border-radius: 4px;
          }
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

// 添加新的flex布局样式
.screenshots-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-content: flex-start;
  height: 100%;
}

.screenshot-item {
  flex: 0 0 calc(50% - 6px);
  height: 220px;
  
  @media (max-width: 768px) {
    flex: 0 0 100%;
  }
}

.screenshot-card {
  height: 100%;
  display: flex;
  flex-direction: column;

  :deep(.arco-card-body) {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    height: 100%;
  }

  :deep(.arco-image) {
    flex: 1;
    min-height: 150px;
    margin-bottom: 0;

    img {
      object-fit: cover;
      height: 100%;
      width: 100%;
    }
  }

  .screenshot-info {
    margin-top: 0;
    flex-shrink: 0;
  }
}

.timeline-container {
  height: calc(70vh - 90px);
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-neutral-3);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background-color: var(--color-neutral-1);
    border-radius: 4px;
  }
}
</style>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { Pagination } from "@/types/global";
import {
  Candidate,
  getCandidateList,
  getExamCandidateList,
  getRiskLevelColor,
  getRiskLevelText,
  getStatusColor,
  getStatusText,
} from "./index";
import useLoading from "@/hooks/loading";
import { Message } from "@arco-design/web-vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

console.log(route.params);

// 获取路由中的考试ID参数
const examId = ref<number | null>(null);
const examName = ref<string>("多人监控");

// 搜索表单
const formModel = ref({
  keyword: "",
});

// 分页参数
const pagination = reactive<Pagination>({
  current: 1,
  pageSize: 10,
  total: 0,
});

// 监控卡片数据
const monitoringCards = ref<Candidate[]>([]);
// 加载状态
const { loading, setLoading } = useLoading(false);
// 追踪正在播放的视频
const playingVideos = ref<Set<number>>(new Set());
// 最大同时播放数量
const MAX_PLAYING_VIDEOS = 6;

// 根据字符串生成颜色的函数
const getAvatarColor = (name: string) => {
  const colors = [
    "#1890ff",
    "#52c41a",
    "#722ed1",
    "#eb2f96",
    "#faad14",
    "#fa8c16",
    "#f5222d",
    "#13c2c2",
    "#2f54eb",
    "#a0d911",
  ];

  // 计算字符串的简单哈希
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // 将哈希映射到颜色数组索引
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// 获取考生监控数据
const fetchCandidateData = async (page = 1) => {
  setLoading(true);
  try {
    let data = [];
    let total = 0;

    // 如果有考试ID，则获取该考试的考生数据
    if (examId.value) {
      const result = await getExamCandidateList(
        examId.value,
        page,
        pagination.pageSize,
        formModel.value.keyword
      );
      data = result.data;
      total = result.total;
    } else {
      // 否则获取常规监控数据
      const result = await getCandidateList(
        page,
        pagination.pageSize,
        formModel.value.keyword
      );
      data = result.data;
      total = result.total;
    }

    monitoringCards.value = data;
    pagination.total = total;
  } catch (error) {
    console.error("获取考生数据失败:", error);
    Message.error("获取考生数据失败");
  } finally {
    setLoading(false);
  }
};

// 搜索
const search = () => {
  fetchCandidateData(1);
};

// 重置
const reset = () => {
  formModel.value.keyword = "";
  fetchCandidateData(1);
};

// 刷新数据
const refreshData = () => {
  fetchCandidateData(pagination.current);
  Message.success("监控数据已刷新");
};

// 处理分页变化
const handlePageChange = (page: number) => {
  pagination.current = page;
  fetchCandidateData(page);
};

// 切换视频播放状态
const toggleVideoPlay = (candidate: Candidate) => {
  if (playingVideos.value.has(candidate.id)) {
    // 如果视频已经在播放，则停止
    playingVideos.value.delete(candidate.id);
  } else {
    // 如果视频未播放，检查是否已达到最大播放数
    if (playingVideos.value.size >= MAX_PLAYING_VIDEOS) {
      // 找到最早播放的视频并停止
      const oldestVideo = Array.from(playingVideos.value)[0];
      playingVideos.value.delete(oldestVideo);
      Message.info(
        `已达到最大同时播放数量(${MAX_PLAYING_VIDEOS}个)，已自动停止最早播放的视频`
      );
    }
    // 开始播放新视频
    playingVideos.value.add(candidate.id);
  }
};

// 查看单个考生详情
const viewCandidateDetail = (candidate: Candidate) => {
  router.push({
    name: "online-monitor-watch",
    query: {
      id: candidate.id,
      examId: examId.value || undefined,
      studentId: candidate.studentId,
      accountId: candidate.accountId,
    },
  });
};

// 在script部分添加默认图片处理
const getScreenshot = (candidate: Candidate) => {
  // 如果截图存在且有效
  if (candidate.screenshot && 
      candidate.screenshot.trim() !== '' && 
      !candidate.screenshot.includes('undefined') &&
      !candidate.screenshot.includes('null')) {
    return candidate.screenshot;
  }
  
  // 返回默认占位图
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120' viewBox='0 0 200 120'%3E%3Crect width='200' height='120' fill='%23f0f2f5'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' text-anchor='middle' fill='%23909399'%3E等待截图...%3C/text%3E%3C/svg%3E`;
};

// 初始加载
onMounted(() => {
  // 从路由参数中获取考试ID
  if (route.query.examId) {
    examId.value = Number(route.query.examId);
  }

  // 获取考试名称
  if (route.query.examName) {
    examName.value = String(route.query.examName);
  }

  fetchCandidateData();
});
</script>

<template>
  <div id="many-monitor-container" class="container-form">
    <Breadcrumb :items="['考场监控', '多人监控']" direct />
    <a-card
      :title="examId ? `考试监控 - ${examName}` : '多人考场监控'"
      class="general-card"
    >
      <a-row>
        <a-col :flex="1">
          <a-form
            :label-col-props="{ span: 6 }"
            :model="formModel"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item :label="'关键词搜索'" field="keyword">
                  <a-input
                    v-model="formModel.keyword"
                    placeholder="搜索考生姓名或考号"
                    allow-clear
                  >
                    <template #suffix>
                      <icon-search />
                    </template>
                  </a-input>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider direction="vertical" style="height: 42px" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space :size="18" direction="vertical">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              查询
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              重置
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />

      <a-row style="margin-bottom: 16px">
        <a-col :span="24">
          <a-space>
            <a-button type="primary" @click="refreshData">
              <template #icon>
                <icon-refresh />
              </template>
              刷新数据
            </a-button>
            <a-button status="warning">
              <template #icon>
                <icon-exclamation-circle-fill />
              </template>
              查看异常
            </a-button>
            <a-button>
              <template #icon>
                <icon-settings />
              </template>
              监控设置
            </a-button>
          </a-space>
        </a-col>
      </a-row>

      <div class="flex w-full justify-center">
        <a-spin :loading="loading">
          <div v-if="monitoringCards.length === 0" class="empty-container">
            <a-empty description="暂无监控数据" />
          </div>
          <div v-else class="monitor-cards-wrapper w-full">
            <div
              v-for="candidate in monitoringCards"
              :key="candidate.id"
              class="monitor-card"
              :class="{ 'risk-card': candidate.riskLevel !== 'none' }"
            >
              <div class="monitor-card-video">
                <div class="video-container">
                  <img
                    v-if="!playingVideos.has(candidate.id)"
                    :src="getScreenshot(candidate)"
                    alt="监控画面"
                    class="video-screenshot"
                  />
                  <div v-else class="live-video">
                    <img
                      :src="getScreenshot(candidate)"
                      alt="实时监控"
                      class="live-stream"
                    />
                    <div class="live-indicator">
                      <span class="live-dot"></span>
                      直播中
                    </div>
                  </div>

                  <div class="video-overlay">
                    <div class="student-info-overlay">
                      <span class="student-name-overlay">{{
                        candidate.name
                      }}</span>
                      <span class="student-id-overlay">{{
                        candidate.examId
                      }}</span>
                    </div>
                  </div>


                  <div
                    class="status-badge"
                    :style="{ background: getStatusColor(candidate.status) }"
                  >
                    {{ getStatusText(candidate.status) }}
                  </div>

                  <div
                    v-if="candidate.riskLevel !== 'none'"
                    class="risk-badge"
                    :style="{
                      background: getRiskLevelColor(candidate.riskLevel),
                    }"
                  >
                    {{ getRiskLevelText(candidate.riskLevel) }}
                  </div>
                </div>
              </div>

              <div
                class="monitor-card-info"
                @click="viewCandidateDetail(candidate)"
              >
                <div class="candidate-info">
                  <a-space direction="vertical" fill size="mini">
                    <a-row align="center" justify="space-between">
                      <a-col :span="16">
                        <a-space align="center">
                          <a-avatar
                            :size="28"
                            :style="{
                              backgroundColor: getAvatarColor(candidate.name),
                            }"
                          >
                            {{ candidate.name.charAt(0) }}
                          </a-avatar>
                          <span class="candidate-name">{{
                            candidate.name
                          }}</span>
                        </a-space>
                      </a-col>
                      <a-col :span="8" class="text-right">
                        <a-button
                          type="text"
                          size="mini"
                          @click.stop="viewCandidateDetail(candidate)"
                        >
                          详情
                          <template #icon>
                            <icon-right />
                          </template>
                        </a-button>
                      </a-col>
                    </a-row>

                    <a-row justify="space-between">
                      <a-col :span="24">
                        <a-space fill size="mini">
                          <a-typography-text type="secondary"
                            >考号: {{ candidate.examId }}</a-typography-text
                          >
                          <a-typography-text
                            v-if="candidate.lastActivity"
                            type="secondary"
                          >
                            最后活动: {{ candidate.lastActivity }}
                          </a-typography-text>
                        </a-space>
                      </a-col>
                    </a-row>

                    <a-row v-if="candidate.riskDescription">
                      <a-col :span="24" class="risk-description">
                        <icon-exclamation-circle-fill
                          style="color: #f53f3f; margin-right: 4px"
                        />
                        {{ candidate.riskDescription }}
                      </a-col>
                    </a-row>
                  </a-space>
                </div>
              </div>
            </div>
          </div>

          <div class="pagination-container">
            <a-pagination
              v-model:current="pagination.current"
              v-model:page-size="pagination.pageSize"
              :page-size-options="[8, 12, 24, 36]"
              :total="pagination.total"
              show-total
              @change="handlePageChange"
            />
          </div>
        </a-spin>
      </div>
    </a-card>

    <a-back-top
      :style="{ position: 'absolute' }"
      target-container="#many-monitor-container"
    />
  </div>
</template>

<style lang="less" scoped>
.container-form {
  padding: 0 20px 20px 20px;
}

.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.monitor-cards-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
  justify-content: start;
}

.monitor-card {
  flex-basis: calc(25% - 9px);
  min-width: 160px;
  min-height: 40px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  background-color: var(--color-bg-2);
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }

  &.risk-card {
    box-shadow: 0 2px 10px rgba(245, 63, 63, 0.2);

    &:hover {
      box-shadow: 0 4px 15px rgba(245, 63, 63, 0.25);
    }
  }
}

.monitor-card-video {
  position: relative;
  width: 100%;
  height: 120px;
  overflow: hidden;
}

.video-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
}

.video-screenshot,
.live-stream {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  background-color: #f0f2f5;
}

.monitor-card:hover .video-screenshot,
.monitor-card:hover .live-stream {
  transform: scale(1.05);
}

.video-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 8px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.monitor-card:hover .video-overlay {
  opacity: 1;
}

.student-info-overlay {
  display: flex;
  flex-direction: column;
}

.student-name-overlay {
  font-weight: bold;
  font-size: 14px;
}

.student-id-overlay {
  font-size: 12px;
  opacity: 0.8;
}

.video-controls {
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 10;
}

.status-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  z-index: 5;
}

.risk-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  z-index: 5;
}

.live-indicator {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background-color: rgba(255, 0, 0, 0.7);
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.live-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: white;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}

.monitor-card-info {
  padding: 8px;
  flex: 1;
  cursor: pointer;
}

.candidate-name {
  font-weight: 500;
}

.text-right {
  text-align: right;
}

.risk-description {
  color: #f53f3f;
  font-size: 13px;
  line-height: 1.3;
  margin-top: 4px;
  background-color: rgba(245, 63, 63, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

@media screen and (min-width: 1500px) {
  .monitor-card {
    flex-basis: calc(20% - 9.6px);
  }
}

@media screen and (max-width: 1400px) {
  .monitor-card {
    flex-basis: calc(33.333% - 8px);
  }
}

@media screen and (max-width: 1100px) {
  .monitor-card {
    flex-basis: calc(50% - 6px);
  }
}

@media screen and (max-width: 768px) {
  .monitor-card {
    flex-basis: 100%;
    min-width: unset;
  }
}
</style>

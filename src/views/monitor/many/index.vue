<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { Pagination } from "@/types/global";
import { Candidate, getCandidateList, getStatusColor, getStatusText, getRiskLevelColor, getRiskLevelText } from "./index";
import useLoading from "@/hooks/loading";
import { Message } from "@arco-design/web-vue";
import router from "@/router";

// 搜索表单
const formModel = ref({
  keyword: "",
});

// 分页参数
const pagination = reactive<Pagination>({
  current: 1,
  pageSize: 24,
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

// 获取考生监控数据
const fetchCandidateData = async (page = 1) => {
  setLoading(true);
  try {
    const { data, total } = await getCandidateList(
      page, 
      pagination.pageSize, 
      formModel.value.keyword
    );
    
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

// 初始加载
onMounted(() => {
  fetchCandidateData();
});
</script>

<template>
  <div class="container-form" id="many-monitor-container">
    <Breadcrumb :items="['考场监控', '多人监控']" direct />
    <a-card class="general-card" :title="'多人考场监控'">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item field="keyword" :label="'关键词搜索'">
                  <a-input
                    v-model="formModel.keyword"
                    placeholder="搜索考生姓名或考号"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 42px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
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
            <div class="monitor-cards-wrapper w-full" >
                  <div
                      v-for="candidate in monitoringCards"
                      :key="candidate.id"
                      class="monitor-card"
                  >
                    <div class="monitor-card-video">
                      <div class="video-container">
                        <img
                            v-if="!playingVideos.has(candidate.id)"
                            :src="candidate.screenshot"
                            alt="监控画面"
                            class="video-screenshot"
                        />
                        <div v-else class="live-video">
                          <img
                              :src="candidate.screenshot"
                              alt="实时监控"
                              class="live-stream"
                          />
                          <div class="live-indicator">直播中</div>
                        </div>

                        <div class="video-controls">
                          <a-button
                              :type="
                      playingVideos.has(candidate.id) ? 'primary' : 'outline'
                    "
                              shape="circle"
                              @click="toggleVideoPlay(candidate)"
                          >
                            <template #icon>
                              <icon-pause v-if="playingVideos.has(candidate.id)" />
                              <icon-play-arrow v-else />
                            </template>
                          </a-button>
                        </div>
                      </div>
                    </div>

                    <div class="monitor-card-info" @click="router.push({name: 'online-monitor-watch'})">
                      <div class="candidate-info">
                        <a-space direction="vertical" fill>
                          <a-row justify="space-between">
                            <a-col :span="16">
                              <a-space>
                                <a-avatar :size="24">{{
                                    candidate.name.charAt(0)
                                  }}</a-avatar>
                                <span class="candidate-name">{{ candidate.name }}</span>
                              </a-space>
                            </a-col>
                            <a-col :span="8" class="text-right">
                              <a-tag :color="getStatusColor(candidate.status)">
                                {{ getStatusText(candidate.status) }}
                              </a-tag>
                            </a-col>
                          </a-row>

                          <a-row justify="space-between">
                            <a-col :span="14">考号: {{ candidate.examId }}</a-col>
                            <a-col :span="10" class="text-right">
                              <a-tag
                                  v-if="candidate.riskLevel !== 'none'"
                                  :color="getRiskLevelColor(candidate.riskLevel)"
                              >
                                {{ getRiskLevelText(candidate.riskLevel) }}
                              </a-tag>
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
                  :total="pagination.total"
                  show-total
                  :page-size-options="[6, 12, 18]"
                  @change="handlePageChange"
              />
            </div>
        </a-spin>
      </div>
    </a-card>

    <a-back-top target-container="#many-monitor-container" :style="{position:'absolute'}" />
  </div>
</template>

<style scoped lang="less">
.container-form {
  padding: 0 20px 20px 20px;
}

.monitor-cards-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
  justify-content: start;
}

.monitor-card {
  flex-basis: calc(25% - 12px);
  min-width: 180px;
  min-height: 60px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  background-color: var(--color-bg-2);
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
}

.monitor-card-video {
  position: relative;
  width: 100%;
  height: 180px;
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
}

.video-controls {
  position: absolute;
  bottom: 16px;
  right: 16px;
}

.live-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(255, 0, 0, 0.7);
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.monitor-card-info {
  padding: 12px;
  flex: 1;
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
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

@media screen and (max-width: 1400px) {
  .monitor-card {
    flex-basis: calc(33.333% - 11px);
    min-height: 320px;
  }
}
  
@media screen and (max-width: 1100px) {
  .monitor-card {
    flex-basis: calc(50% - 8px);
  }
}
  
@media screen and (max-width: 768px) {
  .monitor-card {
    flex-basis: 100%;
    min-width: unset;
  }
}
</style>

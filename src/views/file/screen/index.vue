<template>
  <div class="container-form">
    <Breadcrumb :items="['文件管理', '录屏管理']" direct />
    <a-card :title="'录屏管理'">
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
                    placeholder="搜索考试名称、学生姓名或备注"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="'风险等级'" field="riskLevel">
                  <a-select
                    v-model="formModel.riskLevel"
                    allow-clear
                    placeholder="请选择风险等级"
                  >
                    <a-option :value="0" label="低风险" />
                    <a-option :value="1" label="中风险" />
                    <a-option :value="2" label="高风险" />
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="'录屏时间'" field="timeRange">
                  <a-range-picker
                    v-model="formModel.timeRange"
                    format="YYYY-MM-DD HH:mm:ss"
                    show-time
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider direction="vertical" style="height: 84px" />
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
      <a-table
        :bordered="false"
        :columns="columns"
        :data="renderData"
        :loading="loading"
        :pagination="pagination"
        :size="'medium'"
        row-key="id"
        @page-change="fetchData"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>

        <template #fileSize="{ record }">
          {{ formatFileSize(record.fileSize) }}
        </template>

        <template #duration="{ record }">
          {{ formatDuration(record.duration) }}
        </template>

        <template #timeRange="{ record }">
          {{ dayjs(record.startTime).format("YYYY-MM-DD HH:mm:ss") }}
          至
          {{ dayjs(record.endTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>

        <template #riskLevel="{ record }">
          <a-tag :color="getRiskLevelColor(record.riskLevel)">
            {{ getRiskLevelText(record.riskLevel) }}
          </a-tag>
        </template>

        <template #operation="{ record }">
          <a-button
            size="small"
            style="margin-right: 10px"
            type="primary"
            @click="handlePlay(record)"
          >
            查看
          </a-button>
          <a-button
            size="small"
            style="margin-right: 10px"
            type="primary"
            @click="handleEdit(record)"
          >
            编辑
          </a-button>
          <a-button
            size="small"
            status="danger"
            type="primary"
            @click="handleRemove(record)"
          >
            删除
          </a-button>
        </template>
      </a-table>
    </a-card>

    <!-- 播放弹窗 -->
    <a-modal
      v-model:visible="playVisible"
      :footer="false"
      :mask-closable="true"
      :modal-style="{ maxWidth: '900px', width: '90%' }"
      title="录屏播放"
    >
      <div class="video-container">
        <video
          ref="videoPlayer"
          controls
          style="max-width: 100%; max-height: 500px"
        >
          <source :src="currentVideoUrl" type="video/mp4" />
          您的浏览器不支持视频播放。
        </video>
      </div>
      <div v-if="currentRecord" class="video-info">
        <h3>{{ currentRecord.examName }} - {{ currentRecord.studentName }}</h3>
        <p>时长：{{ formatDuration(currentRecord.duration) }}</p>
        <p>
          开始时间：{{
            dayjs(currentRecord.startTime).format("YYYY-MM-DD HH:mm:ss")
          }}
        </p>
        <p>
          结束时间：{{
            dayjs(currentRecord.endTime).format("YYYY-MM-DD HH:mm:ss")
          }}
        </p>
        <p v-if="currentRecord.remark">备注：{{ currentRecord.remark }}</p>
      </div>
    </a-modal>

    <!-- 编辑弹窗 -->
    <a-modal
      v-model:visible="editVisible"
      :on-before-ok="handleSave"
      title="编辑录屏信息"
    >
      <a-form
        ref="editFormRef"
        :auto-label-width="true"
        :model="editForm"
        :size="'large'"
      >
        <a-form-item
          :rules="[{ required: true, message: '不能为空' }]"
          field="riskLevel"
          label="风险等级"
        >
          <a-select v-model="editForm.riskLevel" placeholder="请选择风险等级">
            <a-option :value="0" label="低风险" />
            <a-option :value="1" label="中风险" />
            <a-option :value="2" label="高风险" />
          </a-select>
        </a-form-item>
        <a-form-item field="remark" label="备注">
          <a-textarea
            v-model="editForm.remark"
            placeholder="请输入备注信息"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, onMounted } from "vue";
import useLoading from "@/hooks/loading";
import { Pagination } from "@/types/global";
import type { TableColumnData } from "@arco-design/web-vue/es/table/interface";
import { Message } from "@arco-design/web-vue";
import dayjs from "dayjs";

// 导入录屏相关API和类型
import {
  ScreenRecord,
  getScreenRecordList,
  updateScreenRecordInfo,
  deleteScreenRecordById,
} from "./index";


const generateFormModel = () => {
  return {
    keyword: "",
    riskLevel: undefined,
    timeRange: [],
  };
};

const formModel = reactive(generateFormModel());

// 重置表单
const reset = () => {
  Object.assign(formModel, generateFormModel());
  fetchData(1);
};

// 查询
const search = () => {
  fetchData(1);
};

// 格式化文件大小
const formatFileSize = (size: number) => {
  if (size < 1024) {
    return size + " KB";
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + " MB";
  } else {
    return (size / (1024 * 1024)).toFixed(2) + " GB";
  }
};

// 格式化时长
const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [
    hours > 0 ? hours.toString().padStart(2, "0") : null,
    minutes.toString().padStart(2, "0"),
    secs.toString().padStart(2, "0"),
  ]
    .filter(Boolean)
    .join(":");
};

// 获取风险等级文本
const getRiskLevelText = (riskLevel: number) => {
  switch (riskLevel) {
    case 0:
      return "低风险";
    case 1:
      return "中风险";
    case 2:
      return "高风险";
    default:
      return "未知";
  }
};

// 获取风险等级颜色
const getRiskLevelColor = (riskLevel: number) => {
  switch (riskLevel) {
    case 0:
      return "green";
    case 1:
      return "orange";
    case 2:
      return "red";
    default:
      return "gray";
  }
};

// 表格配置
const columns = computed<TableColumnData[]>(() => [
  {
    title: "序号",
    dataIndex: "index",
    slotName: "index",
    width: 80,
    align: "center",
  },
  {
    title: "考试名称",
    dataIndex: "examName",
    width: 100,
    align: "center",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "学生姓名",
    dataIndex: "studentName",
    width: 100,
    align: "center",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "时间范围",
    dataIndex: "timeRange",
    slotName: "timeRange",
    width: 320,
    ellipsis: true,
    tooltip: true,
    align: "center",
  },
  {
    title: "时长",
    dataIndex: "duration",
    slotName: "duration",
    width: 100,
    align: "center",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "文件大小",
    dataIndex: "fileSize",
    slotName: "fileSize",
    width: 100,
    align: "center",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "风险等级",
    dataIndex: "riskLevel",
    slotName: "riskLevel",
    width: 100,
  },
  {
    title: "备注",
    dataIndex: "remark",
    ellipsis: true,
    tooltip: true,
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "operations",
    slotName: "operation",
    width: 240,
    align: "center",
    fixed: "right",
  },
]);

// 渲染数据
const renderData = ref<ScreenRecord[]>([]);
const { loading, setLoading } = useLoading();

// 分页
const pagination = reactive<Pagination>({
  current: 1,
  pageSize: 10,
  total: 0,
});

// 获取列表数据
const fetchData = async (current: number = 1) => {
  setLoading(true);
  try {
    const { keyword, riskLevel, timeRange } = formModel;
    const startDate =
      timeRange && timeRange.length > 0 ? timeRange[0] : undefined;
    const endDate =
      timeRange && timeRange.length > 0 ? timeRange[1] : undefined;

    const { data, total } = await getScreenRecordList(
      current,
      pagination.pageSize,
      keyword,
      riskLevel,
      startDate,
      endDate
    );
    renderData.value = data;
    pagination.current = current;
    pagination.total = total;
  } catch (err) {
    // 处理错误
    Message.error("获取数据失败");
  } finally {
    setLoading(false);
  }
};

// 视频播放
const playVisible = ref(false);
const videoPlayer = ref<HTMLVideoElement | null>(null);
const currentVideoUrl = ref("");
const currentRecord = ref<ScreenRecord | null>(null);

const handlePlay = (record: ScreenRecord) => {
  currentVideoUrl.value = record.videoUrl;
  currentRecord.value = record;
  playVisible.value = true;
  // 让视频自动播放
  setTimeout(() => {
    if (videoPlayer.value) {
      videoPlayer.value.play().catch((e) => console.error("自动播放失败:", e));
    }
  }, 300);
};

// 编辑表单
const editVisible = ref(false);
const editFormRef = ref(null);
const editForm = ref<Partial<ScreenRecord> & { id: number }>({
  id: 0,
  riskLevel: 0,
  remark: "",
});

// 编辑
const handleEdit = (record: ScreenRecord) => {
  editForm.value = {
    id: record.id,
    riskLevel: record.riskLevel,
    remark: record.remark || "",
  };
  editVisible.value = true;
};

// 保存
const handleSave = async () => {
  return new Promise<boolean>((resolve) => {
    if (!editFormRef.value) {
      resolve(false);
      return;
    }

    editFormRef.value.validate(async (errors: any) => {
      if (errors) {
        resolve(false);
        return;
      }

      const result = await updateScreenRecordInfo(editForm.value);

      if (result) {
        fetchData(pagination.current);
      }

      resolve(result);
    });
  });
};

// 删除
const handleRemove = async (record: ScreenRecord) => {
  const result = await deleteScreenRecordById(record.id);
  if (result) {
    fetchData(
      renderData.value.length === 1 && pagination.current > 1
        ? pagination.current - 1
        : pagination.current
    );
  }
};

// 初始化
onMounted(() => {
  fetchData(1);
});
</script>

<style scoped>
.container-form {
  padding: 20px;
}

.video-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.video-info {
  padding: 8px 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style>

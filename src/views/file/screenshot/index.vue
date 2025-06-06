<template>
  <div class="container-form">
    <Breadcrumb :items="['文件管理', '截屏管理']" direct />
    <a-card :title="'截屏管理'">
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
                <a-form-item :label="'截图时间'" field="timeRange">
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

        <template #captureTime="{ record }">
          {{ dayjs(record.captureTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>

        <template #riskLevel="{ record }">
          <a-tag :color="getRiskLevelColor(record.riskLevel)">
            {{ getRiskLevelText(record.riskLevel) }}
          </a-tag>
        </template>

        <template #image="{ record }">
          <a-button size="small" type="text" @click="viewImage(record)">
            <template #icon>
              <icon-eye />
            </template>
            查看
          </a-button>
        </template>

        <template #operation="{ record }">
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

    <!-- 查看图片弹窗 -->
    <a-modal
      v-model:visible="imageVisible"
      :footer="false"
      :mask-closable="true"
      :modal-style="{ maxWidth: '900px', width: '90%' }"
      title="截图查看"
    >
      <div class="image-container">
        <img
          :src="currentImageUrl"
          style="max-width: 100%; max-height: 500px"
          alt="截图"
        />
      </div>
      <div v-if="currentRecord" class="image-info">
        <h3>{{ currentRecord.examName }} - {{ currentRecord.studentName }}</h3>
        <p>
          截图时间：
          {{ dayjs(currentRecord.captureTime).format("YYYY-MM-DD HH:mm:ss") }}
        </p>
        <p>文件大小：{{ formatFileSize(currentRecord.fileSize) }}</p>
        <p v-if="currentRecord.remark">备注：{{ currentRecord.remark }}</p>
      </div>
    </a-modal>

    <!-- 编辑弹窗 -->
    <a-modal
      v-model:visible="editVisible"
      :on-before-ok="handleSave"
      title="编辑截图信息"
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
import { Message, Modal } from "@arco-design/web-vue";
import dayjs from "dayjs";

// 导入截图相关API和类型
import {
  Screenshot,
  getScreenshotList,
  updateScreenshotInfo,
  deleteScreenshotById,
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
    ellipsis: true,
    tooltip: true,
    width: 180,
    align: "center",
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
    title: "图片",
    dataIndex: "image",
    slotName: "image",
    width: 100,
    align: "center",
  },
  {
    title: "文件大小",
    dataIndex: "fileSize",
    slotName: "fileSize",
    width: 100,
    ellipsis: true,
    tooltip: true,
    align: "center",
  },
  {
    title: "风险等级",
    dataIndex: "riskLevel",
    slotName: "riskLevel",
    width: 100,
    align: "center",
  },
  {
    title: "截图时间",
    dataIndex: "captureTime",
    slotName: "captureTime",
    width: 180,
    align: "center",
  },
  {
    title: "备注",
    dataIndex: "remark",
    ellipsis: true,
    tooltip: true,
    width: 100,
    align: "center",
  },

  {
    title: "操作",
    dataIndex: "operations",
    slotName: "operation",
    width: 200,
    align: "center",
    fixed: "right",
  },
]);

// 渲染数据
const renderData = ref<Screenshot[]>([]);
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
    const startTime =
      timeRange && timeRange.length > 0 ? timeRange[0] : undefined;
    const endTime =
      timeRange && timeRange.length > 0 ? timeRange[1] : undefined;

    const { data, total } = await getScreenshotList(
      current,
      pagination.pageSize,
      keyword,
      riskLevel,
      startTime,
      endTime
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

// 图片查看
const imageVisible = ref(false);
const currentImageUrl = ref("");
const currentRecord = ref<Screenshot | null>(null);

const viewImage = (record: Screenshot) => {
  currentImageUrl.value = record.imageUrl;
  currentRecord.value = record;
  imageVisible.value = true;
};

// 编辑表单
const editVisible = ref(false);
const editFormRef = ref(null);
const editForm = ref<Partial<Screenshot> & { id: number }>({
  id: 0,
  riskLevel: 0,
  remark: "",
});

// 编辑
const handleEdit = (record: Screenshot) => {
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

      const result = await updateScreenshotInfo(editForm.value);

      if (result) {
        await fetchData(pagination.current);
      }

      resolve(result);
    });
  });
};

// 删除
const handleRemove = async (record: Screenshot) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除该截图吗？此操作不可逆。`,
    okText: '确认',
    cancelText: '取消',
    onOk: async () => {
      const result = await deleteScreenshotById(record.id);
      if (result) {
        await fetchData(
          renderData.value.length === 1 && pagination.current > 1
            ? pagination.current - 1
            : pagination.current
        );
        Message.success('删除成功');
      }
    }
  });
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

.image-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.image-info {
  padding: 8px 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style>

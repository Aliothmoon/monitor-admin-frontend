<template>
  <div class="container-form">
    <Breadcrumb :items="['文件管理', '截图管理']" direct />
    <a-card :title="'截图管理'">
      <a-row>
        <a-col :flex="1">
          <a-form
            :label-col-props="{ span: 6 }"
            :model="formModel"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item :label="'关键词搜索'" field="keyword">
                  <a-input
                    v-model="formModel.keyword"
                    placeholder="搜索考试名称、学生姓名或备注"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
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
              <a-col :span="8">
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

        <template #imageUrl="{ record }">
          <div class="image-preview-wrapper">
            <div class="image-preview" @click="previewImage(record)">
              <img
                :src="record.imageUrl"
                alt="截图"
                style="max-width: 100px; max-height: 60px"
              />
              <div class="preview-icon">
                <icon-eye class="eye-icon" />
              </div>
            </div>
          </div>
        </template>

        <template #captureTime="{ record }">
          {{ dayjs(record.captureTime).format("YYYY-MM-DD HH:mm:ss") }}
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

    <!-- 图片预览 -->
    <a-modal
      v-model:visible="previewVisible"
      :footer="false"
      :mask-closable="true"
      title="截图预览"
    >
      <div class="image-preview-container">
        <img
          :src="previewImageUrl"
          alt="截图预览"
          style="max-width: 100%; max-height: 500px"
        />
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
import { Message } from "@arco-design/web-vue";
import dayjs from "dayjs";

// 导入截图相关API和类型
import {
  Screenshot,
  getScreenshotList,
  updateScreenshot,
  deleteScreenshot,
} from "./index";

// 表单相关
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
    width: 180,
  },
  {
    title: "学生姓名",
    dataIndex: "studentName",
    width: 120,
  },
  {
    title: "截图",
    dataIndex: "imageUrl",
    slotName: "imageUrl",
    width: 120,
  },
  {
    title: "截图时间",
    dataIndex: "captureTime",
    slotName: "captureTime",
    width: 180,
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
    width: 200,
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
    const startDate =
      timeRange && timeRange.length > 0 ? timeRange[0] : undefined;
    const endDate =
      timeRange && timeRange.length > 0 ? timeRange[1] : undefined;

    const { data, total } = await getScreenshotList(
      current,
      pagination.pageSize,
      undefined,
      undefined,
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

// 图片预览
const previewVisible = ref(false);
const previewImageUrl = ref("");

const previewImage = (record: Screenshot) => {
  previewImageUrl.value = record.imageUrl;
  previewVisible.value = true;
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

      const result = await updateScreenshot(editForm.value);

      if (result) {
        fetchData(pagination.current);
      }

      resolve(result);
    });
  });
};

// 删除
const handleRemove = async (record: Screenshot) => {
  const result = await deleteScreenshot(record.id);
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

.image-preview-wrapper {
  position: relative;
  display: inline-block;
}

.image-preview {
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.3s;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.eye-icon {
  color: #165DFF;
  font-size: 18px;
}

.image-preview:hover .preview-icon {
  opacity: 1;
}

.image-preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

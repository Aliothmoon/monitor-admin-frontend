<template>
  <div class="container-form">
    <Breadcrumb :items="['风险图片模板']" direct />
    <a-card :title="'风险图片模板管理'">
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
                    placeholder="搜索名称或描述"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="'分类'" field="category">
                  <a-select
                    v-model="formModel.category"
                    allow-clear
                    placeholder="请选择分类"
                  >
                    <a-option label="公式" value="公式" />
                    <a-option label="答案" value="答案" />
                    <a-option label="小抄" value="小抄" />
                    <a-option label="参考表" value="参考表" />
                    <a-option label="其他" value="其他" />
                  </a-select>
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
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="handleInsert">
              <template #icon>
                <icon-plus />
              </template>
              新增
            </a-button>
          </a-space>
        </a-col>
      </a-row>
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
          <div class="image-preview">
            <img
              :src="record.imageUrl"
              alt="模板图片"
              style="max-width: 100px; max-height: 60px"
            />
            <a-button type="text" @click="previewImage(record)">
              <icon-eye />
            </a-button>
          </div>
        </template>

        <template #similarity="{ record }"> {{ record.similarity }}% </template>

        <template #createdAt="{ record }">
          {{ dayjs(record.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
        </template>

        <template #updatedAt="{ record }">
          {{ dayjs(record.updatedAt).format("YYYY-MM-DD HH:mm:ss") }}
        </template>

        <template #operation="{ record }">
          <a-button
            size="small"
            style="margin-right: 10px"
            type="primary"
            @click="handleUpdate(record)"
          >
            修改
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
    <a-modal
      v-model:visible="visible"
      :on-before-ok="handleCompete"
      :title="upsertType == 'c' ? '新增' : '修改'"
    >
      <a-form
        ref="upsertFormRef"
        :auto-label-width="true"
        :model="upsertForm"
        :size="'large'"
      >
        <a-form-item
          :rules="[{ required: true, message: '不能为空' }]"
          field="name"
          label="名称"
        >
          <a-input v-model="upsertForm.name"></a-input>
        </a-form-item>
        <a-form-item field="description" label="描述">
          <a-textarea v-model="upsertForm.description"></a-textarea>
        </a-form-item>
        <a-form-item
          :rules="[{ required: true, message: '不能为空' }]"
          field="category"
          label="分类"
        >
          <a-select v-model="upsertForm.category" placeholder="请选择分类">
            <a-option label="公式" value="公式" />
            <a-option label="答案" value="答案" />
            <a-option label="小抄" value="小抄" />
            <a-option label="参考表" value="参考表" />
            <a-option label="其他" value="其他" />
          </a-select>
        </a-form-item>
        <a-form-item
          :rules="[{ required: true, message: '不能为空' }]"
          field="imageUrl"
          label="图片URL"
        >
          <a-input v-model="upsertForm.imageUrl"></a-input>
        </a-form-item>
        <a-form-item
          :rules="[
            { required: true, message: '不能为空' },
            { type: 'number', min: 1, max: 100, message: '取值范围1-100' },
          ]"
          field="similarity"
          label="相似度阈值(%)"
        >
          <a-input-number
            v-model="upsertForm.similarity"
            :max="100"
            :min="1"
            style="width: 100%"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 图片预览 -->
    <a-modal
      v-model:visible="previewVisible"
      :footer="false"
      :mask-closable="true"
      title="图片预览"
    >
      <div class="image-preview-container">
        <img
          :src="previewImageUrl"
          alt="图片预览"
          style="max-width: 100%; max-height: 500px"
        />
      </div>
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

// 导入风险图片模板API和类型
import {
  RiskImageTemplate,
  getRiskImageTemplateList,
  createRiskImageTemplate,
  updateRiskImageTemplate,
  deleteRiskImageTemplate,
} from "./image";

// 表单相关
const generateFormModel = () => {
  return {
    keyword: "",
    category: "",
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

// 表格配置
const columns = computed<TableColumnData[]>(() => [
  {
    title: "序号",
    dataIndex: "index",
    slotName: "index",
    align: "center",
  },
  {
    title: "名称",
    dataIndex: "name",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "描述",
    dataIndex: "description",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "图片",
    dataIndex: "imageUrl",
    slotName: "imageUrl",
  },
  {
    title: "相似度阈值",
    dataIndex: "similarity",
    slotName: "similarity",
  },
  {
    title: "创建时间",
    dataIndex: "createdAt",
    slotName: "createdAt",
  },
  {
    title: "更新时间",
    dataIndex: "updatedAt",
    slotName: "updatedAt",
  },
  {
    title: "操作",
    dataIndex: "operations",
    slotName: "operation",
    width: 200,
    align: "center",
  },
]);

// 渲染数据
const renderData = ref<RiskImageTemplate[]>([]);
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
    const { keyword, category } = formModel;
    const { data, total } = await getRiskImageTemplateList(
      current,
      pagination.pageSize,
      keyword,
      category
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

const previewImage = (record: RiskImageTemplate) => {
  previewImageUrl.value = record.imageUrl;
  previewVisible.value = true;
};

// 表单相关
const visible = ref(false);
const upsertFormRef = ref(null);
const upsertType = ref<"c" | "u">("c");
const upsertForm = ref<Partial<RiskImageTemplate> & { id?: number }>({
  name: "",
  description: "",
  category: "",
  imageUrl: "",
  similarity: 80,
});

// 新增
const handleInsert = () => {
  upsertType.value = "c";
  upsertForm.value = {
    name: "",
    description: "",
    category: "",
    imageUrl: "",
    similarity: 80,
  };
  visible.value = true;
};

// 修改
const handleUpdate = (record: RiskImageTemplate) => {
  upsertType.value = "u";
  upsertForm.value = {
    id: record.id,
    name: record.name,
    description: record.description,
    category: record.category,
    imageUrl: record.imageUrl,
    similarity: record.similarity,
  };
  visible.value = true;
};

// 删除
const handleRemove = async (record: RiskImageTemplate) => {
  const result = await deleteRiskImageTemplate(record.id);
  if (result) {
    fetchData(
      renderData.value.length === 1 && pagination.current > 1
        ? pagination.current - 1
        : pagination.current
    );
  }
};

// 提交表单
const handleCompete = async () => {
  return new Promise<boolean>((resolve) => {
    if (!upsertFormRef.value) {
      resolve(false);
      return;
    }

    upsertFormRef.value.validate(async (errors: any) => {
      if (errors) {
        resolve(false);
        return;
      }

      let result = false;
      if (upsertType.value === "c") {
        // 新增
        result = await createRiskImageTemplate(
          upsertForm.value as Omit<
            RiskImageTemplate,
            "id" | "createdAt" | "updatedAt"
          >
        );
      } else {
        // 修改
        result = await updateRiskImageTemplate(
          upsertForm.value as Partial<RiskImageTemplate> & { id: number }
        );
      }

      if (result) {
        fetchData(pagination.current);
      }

      resolve(result);
    });
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

.image-preview {
  display: flex;
  align-items: center;
  gap: 8px;
}

.image-preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

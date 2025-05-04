<template>
  <div class="container-form">
    <Breadcrumb :items="['监考设置', '风险图片模板']" direct />
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
          <div class="image-preview-wrapper">
            <div class="image-preview" @click="previewImage(record)">
              <img
                :src="getFullImageUrl(record.imageUrl)"
                alt="模板图片"
                style="max-width: 100px; max-height: 60px"
              />
              <div class="preview-icon">
                <icon-eye class="eye-icon" />
              </div>
            </div>
          </div>
        </template>

        <template #similarity="{ record }"> {{ record.similarity }}%</template>

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
          :rules="[{ required: true, message: '请上传图片' }]"
          field="imageUrl"
          label="图片"
        >
          <div
            v-if="upsertForm.imageUrl"
            class="current-image"
            @click="openFileUpload"
          >
            <img
              :src="getFullImageUrl(upsertForm.imageUrl)"
              style="max-width: 200px; max-height: 100px"
            />
            <div class="image-overlay">
              <icon-refresh class="refresh-icon" />
              <span>点击更换图片</span>
            </div>
          </div>
          <a-upload
            ref="uploadRef"
            v-if="!upsertForm.imageUrl"
            :custom-request="handleUpload"
            :limit="1"
            :show-file-list="false"
            accept="image/*"
          >
            <template #upload-button>
              <a-button>
                <template #icon>
                  <icon-upload />
                </template>
                上传图片
              </a-button>
            </template>
          </a-upload>
          <input
            ref="hiddenFileInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="handleFileInputChange"
          />
          <div v-if="uploadLoading" style="margin-top: 8px">
            <a-spin />
            <span style="margin-left: 8px">上传中...</span>
          </div>
          <div v-if="upsertForm.imageUrl && !uploadLoading" style="margin-top: 8px">
            <a-tag color="green">图片已上传</a-tag>
          </div>
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
import { computed, onMounted, reactive, ref } from "vue";
import useLoading from "@/hooks/loading";
import { Pagination } from "@/types/global";
import type { TableColumnData } from "@arco-design/web-vue/es/table/interface";
import { Message } from "@arco-design/web-vue";
import dayjs from "dayjs";
import { useUserStore } from "@/store";
import { v4 as uuidv4 } from "uuid";

// 导入风险图片模板API和类型
import {
  createRiskImageTemplate,
  deleteRiskImageTemplate,
  getRiskImageTemplateList,
  RiskImageTemplate,
  updateRiskImageTemplate,
} from "./image";
import { RequestOption } from "@arco-design/web-vue/es/upload/interfaces";
import axios from "axios";

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

// 获取用户信息，用于拼接文件URL
const userStore = useUserStore();

// 获取完整的图片URL
const getFullImageUrl = (imageUrl: string) => {
  if (!imageUrl) return "";
  return userStore.fileUrlPrefix + imageUrl;
};

// 上传图片相关
const uploadLoading = ref(false);
const hiddenFileInput = ref<HTMLInputElement | null>(null);
const showImageUploader = ref(false);

// 直接打开文件选择窗口
const openFileUpload = () => {
  if (hiddenFileInput.value) {
    hiddenFileInput.value.click();
  }
};

// 处理文件选择变化
const handleFileInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    // 模拟RequestOption对象
    const options = {
      fileItem: { file },
      onSuccess: () => {
        // 清空input，使同一文件可以再次被选择
        if (hiddenFileInput.value) {
          hiddenFileInput.value.value = '';
        }
      },
      onError: () => {
        // 清空input，使同一文件可以再次被选择
        if (hiddenFileInput.value) {
          hiddenFileInput.value.value = '';
        }
      }
    };
    // 调用上传函数
    handleUpload(options as RequestOption);
  }
};

// 处理更换图片按钮点击（保留以支持其他可能的触发方式）
const handleReplaceImage = () => {
  openFileUpload();
};

// 处理图片上传
const handleUpload = async (options: RequestOption) => {
  const { fileItem, onSuccess, onError } = options;

  const file = fileItem?.file;
  if (!file) {
    Message.error("请选择文件");
    return;
  }
  
  uploadLoading.value = true;
  showImageUploader.value = false;
  
  try {
    // 生成UUID作为文件名的一部分
    const uuid = uuidv4();
    // 获取文件扩展名
    const ext = file.name.substring(file.name.lastIndexOf("."));
    // 构建文件名 risk-image/uuid.扩展名
    const filename = `risk-image/${uuid}${ext}`;

    // 创建FormData对象
    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", filename);

    // 发送请求
    const response = await axios.post("/common/upload", formData);

    if (response.status !== 200) {
      throw new Error("上传失败");
    }

    const result = response.data;

    if (result.code === 0) {
      // 将文件名存储到表单中
      upsertForm.value.imageUrl = filename;
      Message.success("上传成功");
      if (typeof onSuccess === 'function') {
        onSuccess(result);
      }
    } else {
      throw new Error(result.message || "上传失败");
    }
  } catch (error) {
    console.error("上传失败", error);
    Message.error(
      "上传失败: " + (error instanceof Error ? error.message : "未知错误")
    );
    if (typeof onError === 'function') {
      onError(error);
    }
  } finally {
    uploadLoading.value = false;
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
    title: "名称",
    dataIndex: "name",
    ellipsis: true,
    tooltip: true,
    align: "center",
  },
  {
    title: "描述",
    dataIndex: "description",
    ellipsis: true,
    tooltip: true,
    align: "center",
  },
  {
    title: "图片",
    dataIndex: "imageUrl",
    slotName: "imageUrl",
    align: "center",
    width: 100,
  },
  {
    title: "相似度阈值",
    dataIndex: "similarity",
    slotName: "similarity",
    align: "center",
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
  previewImageUrl.value = getFullImageUrl(record.imageUrl);
  previewVisible.value = true;
};

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
  showImageUploader.value = false;
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
  showImageUploader.value = false;
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
  color: #165dff;
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

.current-image {
  margin-bottom: 10px;
  position: relative;
  cursor: pointer;
  display: inline-block;
  border-radius: 4px;
  overflow: hidden;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
  color: white;
}

.refresh-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.current-image:hover .image-overlay {
  opacity: 1;
}

.image-actions {
  display: none;
}
</style>

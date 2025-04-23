<template>
  <div class="container-form">
    <Breadcrumb :items="['访问域名黑名单']" direct />
    <a-card :title="'访问域名黑名单管理'">
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
                    placeholder="搜索域名或描述"
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
                    <a-option label="社交媒体" value="社交媒体" />
                    <a-option label="视频网站" value="视频网站" />
                    <a-option label="搜索引擎" value="搜索引擎" />
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
          field="domain"
          label="域名"
        >
          <a-input
            v-model="upsertForm.domain"
            placeholder="例如: *.example.com"
          ></a-input>
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
            <a-option label="社交媒体" value="社交媒体" />
            <a-option label="视频网站" value="视频网站" />
            <a-option label="搜索引擎" value="搜索引擎" />
            <a-option label="其他" value="其他" />
          </a-select>
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

// 导入域名黑名单API和类型
import {
  DomainBlacklist,
  getDomainBlacklistList,
  createDomainBlacklist,
  updateDomainBlacklist,
  deleteDomainBlacklist,
} from "./domain";

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
    width: 80,
    align: "center",
  },
  {
    title: "域名",
    dataIndex: "domain",
    width: 200,
  },
  {
    title: "描述",
    dataIndex: "description",
    width: 250,
  },
  {
    title: "分类",
    dataIndex: "category",
    width: 120,
  },
  {
    title: "创建时间",
    dataIndex: "createdAt",
    slotName: "createdAt",
    width: 180,
  },
  {
    title: "更新时间",
    dataIndex: "updatedAt",
    slotName: "updatedAt",
    width: 180,
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
const renderData = ref<DomainBlacklist[]>([]);
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
    const { data, total } = await getDomainBlacklistList(
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

// 表单相关
const visible = ref(false);
const upsertFormRef = ref(null);
const upsertType = ref<"c" | "u">("c");
const upsertForm = ref<Partial<DomainBlacklist> & { id?: number }>({
  domain: "",
  description: "",
  category: "",
});

// 新增
const handleInsert = () => {
  upsertType.value = "c";
  upsertForm.value = {
    domain: "",
    description: "",
    category: "",
  };
  visible.value = true;
};

// 修改
const handleUpdate = (record: DomainBlacklist) => {
  upsertType.value = "u";
  upsertForm.value = {
    id: record.id,
    domain: record.domain,
    description: record.description,
    category: record.category,
  };
  visible.value = true;
};

// 删除
const handleRemove = async (record: DomainBlacklist) => {
  const result = await deleteDomainBlacklist(record.id);
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
        result = await createDomainBlacklist(
          upsertForm.value as Omit<
            DomainBlacklist,
            "id" | "createdAt" | "updatedAt"
          >
        );
      } else {
        // 修改
        result = await updateDomainBlacklist(
          upsertForm.value as Partial<DomainBlacklist> & { id: number }
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
</style>

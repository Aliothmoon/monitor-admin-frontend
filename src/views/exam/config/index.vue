<template>
  <div class="container-form">
    <Breadcrumb :items="['监考配置', '可疑进程黑名单管理']" direct />
    <a-card :title="'可疑进程黑名单管理'">
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
                <a-form-item :label="'进程名称'" field="processName">
                  <a-input
                    v-model="formModel.processName"
                    placeholder="搜索进程名称"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="'风险等级'" field="riskLevel">
                  <a-select
                    v-model="formModel.riskLevel"
                    placeholder="请选择风险等级"
                    allow-clear
                  >
                    <a-option
                      v-for="option in riskLevelOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </a-option>
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

        <template #riskLevel="{ record }">
          <a-tag
            :color="
              record.riskLevel === 3
                ? 'red'
                : record.riskLevel === 2
                ? 'orange'
                : 'blue'
            "
          >
            {{ getRiskLevelText(record.riskLevel) }}
          </a-tag>
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
          field="processName"
          label="进程名称"
        >
          <a-input
            v-model="upsertForm.processName"
            placeholder="例如: chrome.exe"
          ></a-input>
        </a-form-item>
        <a-form-item
          :rules="[{ required: true, message: '不能为空' }]"
          field="description"
          label="描述"
        >
          <a-textarea
            v-model="upsertForm.description"
            placeholder="请输入进程描述"
          ></a-textarea>
        </a-form-item>
        <a-form-item
          :rules="[{ required: true, message: '不能为空' }]"
          field="riskLevel"
          label="风险等级"
        >
          <a-select v-model="upsertForm.riskLevel" placeholder="请选择风险等级">
            <a-option
              v-for="option in riskLevelOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </a-option>
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

// 导入可疑进程API和类型
import {
  SuspiciousProcess,
  getSuspiciousProcessList,
  createSuspiciousProcess,
  updateSuspiciousProcessData,
  deleteSuspiciousProcessData,
  riskLevelOptions,
  getRiskLevelText,
} from "./index";

// 表单相关
const generateFormModel = () => {
  return {
    processName: "",
    riskLevel: undefined,
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
    title: "进程名称",
    dataIndex: "processName",
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
    title: "风险等级",
    dataIndex: "riskLevel",
    slotName: "riskLevel",
  },
  {
    title: "创建时间",
    dataIndex: "createdAt",
    slotName: "createdAt",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "更新时间",
    dataIndex: "updatedAt",
    slotName: "updatedAt",
    ellipsis: true,
    tooltip: true,
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
const renderData = ref<SuspiciousProcess[]>([]);
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
    const { processName, riskLevel } = formModel;
    const { data, total } = await getSuspiciousProcessList(
      current,
      pagination.pageSize,
      processName,
      riskLevel
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
const upsertForm = ref<SuspiciousProcess>({
  processName: "",
  description: "",
  riskLevel: 1,
});

// 新增
const handleInsert = () => {
  upsertType.value = "c";
  upsertForm.value = {
    processName: "",
    description: "",
    riskLevel: 1,
  };
  visible.value = true;
};

// 修改
const handleUpdate = (record: SuspiciousProcess) => {
  upsertType.value = "u";
  upsertForm.value = {
    id: record.id,
    processName: record.processName,
    description: record.description,
    riskLevel: record.riskLevel,
  };
  visible.value = true;
};

// 删除
const handleRemove = async (record: SuspiciousProcess) => {
  if (!record.id) {
    Message.error("记录ID不存在");
    return;
  }

  const result = await deleteSuspiciousProcessData(record.id);
  if (result) {
    await fetchData(
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
        result = await createSuspiciousProcess(upsertForm.value);
      } else {
        // 修改
        result = await updateSuspiciousProcessData(upsertForm.value);
      }

      if (result) {
        await fetchData(pagination.current);
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

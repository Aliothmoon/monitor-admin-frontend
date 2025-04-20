<template>
  <div class="container">
    <Breadcrumb :items="['监考员管理', '监考员管理']" direct />
    <a-card class="general-card" :title="'查询表格'">
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
                <a-form-item field="account" :label="'账户'">
                  <a-input v-model="formModel.account" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="username" :label="'用户名'">
                  <a-input v-model="formModel.username" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
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
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="handleInsert">
              <template #icon>
                <icon-plus />
              </template>
              新建
            </a-button>
            <a-upload action="/">
              <template #upload-button>
                <a-button> 批量导入</a-button>
              </template>
            </a-upload>
          </a-space>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="columns"
        :data="renderData"
        :bordered="false"
        :size="'medium'"
        @page-change="fetchData"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>

        <template #updatedAt="{ record }">
          {{ dayjs(record.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
        </template>

        <template #createdAt="{ record }">
          {{ dayjs(record.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
        </template>

        <template #operation="{ rowIndex, record }">
          <a-button
            @click="handleUpdate(record)"
            type="primary"
            style="margin-right: 10px"
            size="small"
          >
            修改
          </a-button>
          <a-button
            @click="handleRemove(record)"
            type="primary"
            status="danger"
            size="small"
          >
            删除
          </a-button>
        </template>
      </a-table>
    </a-card>
    <a-modal
      v-model:visible="visible"
      :title="upsertType == 'c' ? '新增' : '修改'"
      :on-before-ok="handleCompete"
    >
      <a-form
        :auto-label-width="true"
        :model="upsertForm"
        :size="'large'"
        ref="upsertFormRef"
      >
        <a-form-item
          field="account"
          label="账号"
          :rules="[{ required: true, message: '不能为空' }]"
        >
          <a-input v-model="upsertForm.account"></a-input>
        </a-form-item>
        <a-form-item
          field="username"
          label="用户名"
          :rules="[{ required: true, message: '不能为空' }]"
        >
          <a-input v-model="upsertForm.username"></a-input>
        </a-form-item>
        <a-form-item
          v-if="upsertType !== 'u'"
          field="password"
          label="密码"
          :rules="[{ required: true, message: '不能为空' }]"
        >
          <a-input-password v-model="upsertForm.password"></a-input-password>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import useLoading from "@/hooks/loading";
import { Pagination } from "@/types/global";
import type { TableColumnData } from "@arco-design/web-vue/es/table/interface";
import { MonitorUser } from "@/api/code/models/monitor-user";
import { getMonitorUserPageData, saveMonitorUser, updateMonitorUser, removeMonitorUser } from "@/views/users/manager/index";
import { TableDataInfo } from "@/api/types";
import { useTrigger } from "@/utils/trigger";
import { Message } from "@arco-design/web-vue";
import dayjs from "dayjs";


const generateFormModel = () => {
  return {
    username: "",
    account: "",
  };
};
const { loading, setLoading } = useLoading(true);
const renderData = ref<Array<MonitorUser>>([]);
const formModel = ref(generateFormModel());

const pagination = reactive<Pagination>({
  current: 1,
  pageSize: 10,
});

const columns = computed<TableColumnData[]>(() => [
  {
    title: "序号",
    dataIndex: "userId",
    slotName: "index",
  },
  {
    title: "ID",
    dataIndex: "userId",
  },
  {
    title: "账户",
    dataIndex: "account",
  },
  {
    title: "用户名",
    dataIndex: "username",
  },
  {
    title: "创建时间",
    align: "center",
    slotName: "createdAt",
  },
  {
    title: "上次修改",
    align: "center",
    slotName: "updatedAt",
  },
  {
    title: "操作",
    align: "center",
    slotName: "operation",
  },
]);

const fetchData = async () => {
  setLoading(true);
  try {
    const data = await getMonitorUserPageData(
      pagination.current,
      pagination.pageSize,
      formModel.value.username || undefined,
      formModel.value.account || undefined
    );

    renderData.value = data.rows;
    pagination.total = data.total;
  } finally {
    setLoading(false);
  }
};

const search = () => {
  fetchData();
};

const [visible] = useTrigger();

fetchData();
watch(visible, () => {});
const reset = () => {
  formModel.value = generateFormModel();
};

const getUpsertForm = () => ({
  account: "",
  username: "",
  password: "",
});
const upsertForm = ref(getUpsertForm());
const upsertFormRef = ref();
const upsertType = ref<"c" | "u">("c");

const handleCompete = async () => {
  const validate = await upsertFormRef.value.validate();
  if (validate !== undefined) {
    return false;
  }
  const data = await (upsertType.value === "c"
    ? saveMonitorUser(upsertForm.value)
    : updateMonitorUser(upsertForm.value));

  console.log(data);
  Message.success(upsertType.value === "c" ? "创建成功" : "更新成功");

  await fetchData();
  return true;
};
const handleInsert = () => {
  upsertForm.value = getUpsertForm();
  visible.value = true;
  upsertType.value = "c";
};

const handleUpdate = (record: MonitorUser) => {
  upsertForm.value = getUpsertForm();
  visible.value = true;
  // @ts-ignore
  upsertForm.value = {
    ...record,
  };
  upsertType.value = "u";
};
const handleRemove = async (record: MonitorUser) => {
  const data = await removeMonitorUser(record.userId!);
  await fetchData();
  console.log(data);
};
</script>

<script lang="ts">
export default {
  name: "SearchTable",
};
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}

:deep(.arco-table-th) {
  &:last-child {
    .arco-table-th-item-title {
      margin-left: 16px;
    }
  }
}

.action-icon {
  margin-left: 12px;
  cursor: pointer;
}

.active {
  color: #0960bd;
  background-color: #e3f4fc;
}

.setting {
  display: flex;
  align-items: center;
  width: 200px;

  .title {
    margin-left: 12px;
    cursor: pointer;
  }
}
</style>

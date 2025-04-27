<template>
  <div class="container-form">
    <Breadcrumb :items="['考生管理', '考生账号管理']" />
    <a-card :title="'考生账号管理 - ' + examineeInfoName" class="general-card">
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
                <a-form-item :label="'账号'" field="account">
                  <a-input v-model="formModel.account" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item :label="'考试ID'" field="examId">
                  <a-input-number v-model="formModel.examId" />
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
              新建账号
            </a-button>
            <a-button @click="handleReturn">
              <template #icon>
                <icon-arrow-left />
              </template>
              返回考生信息
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
        row-key="accountId"
        @page-change="fetchData"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>

        <template #status="{ record }">
          <a-tag :color="record.status === 1 ? 'green' : 'red'">
            {{ record.status === 1 ? '启用' : '禁用' }}
          </a-tag>
        </template>

        <template #lastLoginTime="{ record }">
          {{ record.lastLoginTime ? dayjs(record.lastLoginTime).format("YYYY-MM-DD HH:mm:ss") : '未登录' }}
        </template>

        <template #createdAt="{ record }">
          {{ dayjs(record.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
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
            v-if="record.status === 1"
            size="small"
            style="margin-right: 10px"
            status="warning"
            type="outline"
            @click="handleToggleStatus(record, 0)"
          >
            禁用
          </a-button>
          <a-button
            v-else
            size="small"
            style="margin-right: 10px"
            status="success"
            type="outline"
            @click="handleToggleStatus(record, 1)"
          >
            启用
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
      :on-before-ok="handleComplete"
      :title="upsertType == 'c' ? '新增考生账号' : '修改考生账号'"
    >
      <a-form
        ref="upsertFormRef"
        :auto-label-width="true"
        :model="upsertForm"
        :size="'large'"
      >
        <a-form-item
          :rules="[{ required: true, message: '不能为空' }]"
          field="account"
          label="账号"
        >
          <a-input v-model="upsertForm.account"></a-input>
        </a-form-item>
        <a-form-item
          :rules="upsertType === 'c' ? [{ required: true, message: '不能为空' }] : []"
          field="password"
          label="密码"
        >
          <a-input-password v-model="upsertForm.password" :placeholder="upsertType === 'u' ? '不修改请留空' : ''"></a-input-password>
        </a-form-item>
        <a-form-item
          :rules="[{ required: true, message: '不能为空' }]"
          field="examId"
          label="考试ID"
        >
          <a-input-number v-model="upsertForm.examId"></a-input-number>
        </a-form-item>
        <a-form-item
          field="status"
          label="状态"
        >
          <a-radio-group v-model="upsertForm.status">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0">禁用</a-radio>
          </a-radio-group>
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
import { useTrigger } from "@/utils/trigger";
import { Message, Modal } from "@arco-design/web-vue";
import dayjs from "dayjs";
import { useRouter, useRoute } from "vue-router";
import { 
  ExamineeAccount, 
  getExamineeAccountPageData, 
  saveExamineeAccount, 
  updateExamineeAccount, 
  removeExamineeAccount 
} from "@/api/examinee-account";

const router = useRouter();
const route = useRoute();

const examineeInfoId = ref<number | null>(null);
const examineeInfoName = ref<string>('');

onMounted(() => {
  const id = route.query.examineeInfoId;
  const name = route.query.examineeInfoName;
  
  if (id && typeof id === 'string') {
    examineeInfoId.value = parseInt(id, 10);
  }
  
  if (name && typeof name === 'string') {
    examineeInfoName.value = name;
  }
  
  fetchData();
});

const generateFormModel = () => {
  return {
    account: "",
    examId: undefined as number | undefined,
  };
};

const { loading, setLoading } = useLoading(true);
const renderData = ref<Array<ExamineeAccount>>([]);
const formModel = ref(generateFormModel());

const pagination = reactive<Pagination>({
  current: 1,
  pageSize: 10,
});

const columns = computed<TableColumnData[]>(() => [
  {
    title: "序号",
    dataIndex: "accountId",
    slotName: "index",
    width: 60,
  },
  {
    title: "账号",
    dataIndex: "account",
    width: 120,
  },
  {
    title: "考试ID",
    dataIndex: "examId",
    width: 100,
  },
  {
    title: "状态",
    dataIndex: "status",
    slotName: "status",
    width: 80,
  },
  {
    title: "上次登录时间",
    dataIndex: "lastLoginTime",
    slotName: "lastLoginTime",
  },
  {
    title: "创建时间",
    dataIndex: "createdAt",
    slotName: "createdAt",
  },
  {
    title: "操作",
    align: "center",
    slotName: "operation",
    width: 240,
  },
]);

const fetchData = async (current = pagination.current) => {
  if (!examineeInfoId.value) return;
  
  setLoading(true);
  pagination.current = current;
  
  try {
    const data = await getExamineeAccountPageData(
      pagination.current,
      pagination.pageSize,
      formModel.value.account || undefined,
      formModel.value.examId,
      examineeInfoId.value
    );

    renderData.value = data.rows;
    pagination.total = data.total;
  } finally {
    setLoading(false);
  }
};

const search = () => {
  fetchData(1);
};

const [visible] = useTrigger();

const reset = () => {
  formModel.value = generateFormModel();
  search();
};

const getUpsertForm = (): ExamineeAccount => ({
  account: "",
  password: "",
  examId: undefined,
  status: 1,
  examineeInfoId: examineeInfoId.value || undefined
});

const upsertForm = ref<ExamineeAccount>(getUpsertForm());
const upsertFormRef = ref();
const upsertType = ref<"c" | "u">("c");

const handleComplete = async () => {
  const validate = await upsertFormRef.value.validate();
  if (validate !== undefined) {
    return false;
  }
  
  try {
    const data = await (upsertType.value === "c"
      ? saveExamineeAccount(upsertForm.value)
      : updateExamineeAccount(upsertForm.value));

    if (data) {
      Message.success(upsertType.value === "c" ? "创建成功" : "更新成功");
      await fetchData();
      return true;
    } else {
      Message.error(upsertType.value === "c" ? "创建失败" : "更新失败");
      return false;
    }
  } catch (error) {
    console.error(error);
    Message.error("操作失败");
    return false;
  }
};

const handleInsert = () => {
  upsertForm.value = getUpsertForm();
  visible.value = true;
  upsertType.value = "c";
};

const handleUpdate = (record: ExamineeAccount) => {
  upsertForm.value = getUpsertForm();
  visible.value = true;
  upsertForm.value = {
    ...record,
    password: "" // 清空密码字段
  };
  upsertType.value = "u";
};

const handleRemove = async (record: ExamineeAccount) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除账号 "${record.account}" 吗？删除后将无法恢复。`,
    okButtonProps: {
      status: 'danger'
    },
    onOk: async () => {
      try {
        const success = await removeExamineeAccount(record.accountId!);
        if (success) {
          Message.success("删除成功");
          await fetchData();
        } else {
          Message.error("删除失败");
        }
      } catch (error) {
        console.error(error);
        Message.error("删除失败");
      }
    }
  });
};

const handleToggleStatus = async (record: ExamineeAccount, status: number) => {
  try {
    const success = await updateExamineeAccount({
      accountId: record.accountId,
      status
    });
    
    if (success) {
      Message.success(status === 1 ? "已启用账号" : "已禁用账号");
      await fetchData();
    } else {
      Message.error("操作失败");
    }
  } catch (error) {
    console.error(error);
    Message.error("操作失败");
  }
};

const handleReturn = () => {
  router.push({
    name: "examineeInfo"
  });
};
</script>

<style lang="less" scoped>
.container-form {
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
</style> 
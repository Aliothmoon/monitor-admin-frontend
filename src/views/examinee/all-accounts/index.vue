<template>
  <div class="container-form">
    <Breadcrumb :items="['考生管理', '考生账号总览']" />
    <a-card :title="'考生账号总览'" class="general-card">
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
              <a-col :span="8">
                <a-form-item :label="'姓名'" field="name">
                  <a-input v-model="formModel.name" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item :label="'学号'" field="studentId">
                  <a-input v-model="formModel.studentId" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item :label="'学院'" field="college">
                  <a-input v-model="formModel.college" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item :label="'班级'" field="className">
                  <a-input v-model="formModel.className" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider direction="vertical" style="height: 120px" />
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

        <template #gender="{ record }">
          {{ record.gender === 1 ? '男' : '女' }}
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
            修改账号
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
      :title="'修改考生账号'"
    >
      <a-form
        ref="upsertFormRef"
        :auto-label-width="true"
        :model="upsertForm"
        :size="'large'"
      >
        <a-form-item
          field="examineeInfoId"
          label="考生信息ID"
        >
          <a-input-number v-model="upsertForm.examineeInfoId" disabled />
        </a-form-item>
        <a-form-item
          :rules="[{ required: true, message: '不能为空' }]"
          field="account"
          label="账号"
        >
          <a-input v-model="upsertForm.account"></a-input>
        </a-form-item>
        <a-form-item
          field="password"
          label="密码"
        >
          <a-input-password v-model="upsertForm.password" placeholder="不修改请留空"></a-input-password>
        </a-form-item>
        <a-form-item
          field="examId"
          label="考试ID"
        >
          <a-input-number v-model="upsertForm.examId" disabled></a-input-number>
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
import { computed, ref, reactive } from "vue";
import useLoading from "@/hooks/loading";
import { Pagination } from "@/types/global";
import type { TableColumnData } from "@arco-design/web-vue/es/table/interface";
import { useTrigger } from "@/utils/trigger";
import { Message, Modal } from "@arco-design/web-vue";
import dayjs from "dayjs";
import { 
  ExamineeAccountWithInfo, 
  getAllExamineeAccountsWithInfo, 
  updateExamineeAccount,
  removeExamineeAccount
} from "@/api/examinee-account";

const generateFormModel = () => {
  return {
    account: "",
    examId: undefined as number | undefined,
    name: "",
    studentId: "",
    college: "",
    className: ""
  };
};

const { loading, setLoading } = useLoading(true);
const renderData = ref<Array<ExamineeAccountWithInfo>>([]);
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
    width: 140,
  },
  {
    title: "考试ID",
    dataIndex: "examId",
    width: 80,
  },
  {
    title: "状态",
    dataIndex: "status",
    slotName: "status",
    width: 80,
  },
  {
    title: "姓名",
    dataIndex: "name",
    width: 100,
  },
  {
    title: "学号",
    dataIndex: "studentId",
    width: 120,
  },
  {
    title: "性别",
    dataIndex: "gender",
    slotName: "gender",
    width: 70,
  },
  {
    title: "学院",
    dataIndex: "college",
    tooltip: true,
    ellipsis: true,
    width: 100,
  },
  {
    title: "班级",
    dataIndex: "className",
    tooltip: true,
    ellipsis: true,
    width: 100,
  },
  {
    title: "上次登录时间",
    dataIndex: "lastLoginTime",
    slotName: "lastLoginTime",
    tooltip: true,
    ellipsis: true,
    width: 100,
  },
  {
    title: "创建时间",
    dataIndex: "createdAt",
    slotName: "createdAt",
    tooltip: true,
    ellipsis: true,
    width: 100,
  },
  {
    title: "操作",
    align: "center",
    slotName: "operation",
    width: 320,
    fixed: "right",
  },
]);

const fetchData = async (current = pagination.current) => {
  setLoading(true);
  pagination.current = current;
  
  try {
    const data = await getAllExamineeAccountsWithInfo(
      pagination.current,
      pagination.pageSize,
      formModel.value.account || undefined,
      formModel.value.examId,
      formModel.value.name || undefined,
      formModel.value.studentId || undefined,
      formModel.value.college || undefined,
      formModel.value.className || undefined
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

fetchData();

const reset = () => {
  formModel.value = generateFormModel();
  search();
};

// 修改接口定义，包含accountId
interface UpsertForm {
  accountId?: number;
  examineeInfoId?: number;
  account: string;
  password: string;
  examId?: number;
  status: number;
}

const getUpsertForm = (): UpsertForm => ({
  account: "",
  password: "",
  status: 1,
});

const upsertForm = ref<UpsertForm>(getUpsertForm());
const upsertFormRef = ref();
const upsertType = ref<"u">("u");

const handleComplete = async () => {
  const validate = await upsertFormRef.value.validate();
  if (validate !== undefined) {
    return false;
  }
  
  try {
    const success = await updateExamineeAccount(upsertForm.value);

    if (success) {
      Message.success("更新成功");
      await fetchData();
      return true;
    } else {
      Message.error("更新失败");
      return false;
    }
  } catch (error) {
    console.error(error);
    Message.error("操作失败");
    return false;
  }
};

const handleUpdate = (record: ExamineeAccountWithInfo) => {
  upsertForm.value = getUpsertForm();
  visible.value = true;
  upsertForm.value = {
    accountId: record.accountId,
    examineeInfoId: record.examineeInfoId,
    account: record.account,
    password: "", // 清空密码字段
    examId: record.examId,
    status: record.status || 1
  };
};

const handleRemove = async (record: ExamineeAccountWithInfo) => {
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

const handleToggleStatus = async (record: ExamineeAccountWithInfo, status: number) => {
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
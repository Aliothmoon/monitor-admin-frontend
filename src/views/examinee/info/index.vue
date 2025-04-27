<template>
  <div class="container-form">
    <Breadcrumb :items="['考生信息管理']" />
    <a-card :title="'考生信息管理'" class="general-card">
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
                <a-form-item :label="'姓名'" field="name">
                  <a-input v-model="formModel.name" />
                </a-form-item>
              </a-col>
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
            </a-row>
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item :label="'班级'" field="className">
                  <a-input v-model="formModel.className" />
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
        :bordered="false"
        :columns="columns"
        :data="renderData"
        :loading="loading"
        :pagination="pagination"
        :size="'medium'"
        row-key="examineeInfoId"
        @page-change="fetchData"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>

        <template #gender="{ record }">
          {{ record.gender === 1 ? '男' : '女' }}
        </template>

        <template #updatedAt="{ record }">
          {{ dayjs(record.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
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
            size="small"
            style="margin-right: 10px"
            type="primary"
            status="warning"
            @click="handleViewAccounts(record)"
          >
            查看账号
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
      :title="upsertType == 'c' ? '新增考生信息' : '修改考生信息'"
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
          label="姓名"
        >
          <a-input v-model="upsertForm.name"></a-input>
        </a-form-item>
        <a-form-item
          field="studentId"
          label="学号"
        >
          <a-input v-model="upsertForm.studentId"></a-input>
        </a-form-item>
        <a-form-item
          field="gender"
          label="性别"
        >
          <a-radio-group v-model="upsertForm.gender">
            <a-radio :value="1">男</a-radio>
            <a-radio :value="0">女</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          field="college"
          label="学院"
        >
          <a-input v-model="upsertForm.college"></a-input>
        </a-form-item>
        <a-form-item
          field="className"
          label="班级"
        >
          <a-input v-model="upsertForm.className"></a-input>
        </a-form-item>
        <a-form-item
          field="major"
          label="专业"
        >
          <a-input v-model="upsertForm.major"></a-input>
        </a-form-item>
        <a-form-item
          field="email"
          label="邮箱"
        >
          <a-input v-model="upsertForm.email"></a-input>
        </a-form-item>
        <a-form-item
          field="phone"
          label="手机号"
        >
          <a-input v-model="upsertForm.phone"></a-input>
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
import { useRouter } from "vue-router";
import { 
  ExamineeInfo, 
  getExamineeInfoPageData, 
  saveExamineeInfo, 
  updateExamineeInfo, 
  removeExamineeInfo 
} from "@/api/examinee-info";

const router = useRouter();

const generateFormModel = () => {
  return {
    name: "",
    studentId: "",
    college: "",
    className: ""
  };
};

const { loading, setLoading } = useLoading(true);
const renderData = ref<Array<ExamineeInfo>>([]);
const formModel = ref(generateFormModel());

const pagination = reactive<Pagination>({
  current: 1,
  pageSize: 10,
});

const columns = computed<TableColumnData[]>(() => [
  {
    title: "序号",
    dataIndex: "examineeInfoId",
    slotName: "index",
    width: 60,
  },
  {
    title: "学号",
    dataIndex: "studentId",
    width: 120,
  },
  {
    title: "姓名",
    dataIndex: "name",
    width: 100,
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
    tooltip:true,
    ellipsis: true,
  },
  {
    title: "班级",
    dataIndex: "className",
    tooltip:true,
    ellipsis: true,
  },
  {
    title: "专业",
    dataIndex: "major",
    tooltip:true,
    ellipsis: true,
  },
  {
    title: "创建时间",
    align: "center",
    slotName: "createdAt",
    tooltip:true,
    ellipsis: true,
  },
  {
    title: "操作",
    align: "center",
    slotName: "operation",
    width: 300,
  },
]);

const fetchData = async (current = pagination.current) => {
  setLoading(true);
  pagination.current = current;
  
  try {
    const data = await getExamineeInfoPageData(
      pagination.current,
      pagination.pageSize,
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

const getUpsertForm = (): ExamineeInfo => ({
  name: "",
  studentId: "",
  gender: 1,
  college: "",
  className: "",
  major: "",
  email: "",
  phone: "",
});

const upsertForm = ref<ExamineeInfo>(getUpsertForm());
const upsertFormRef = ref();
const upsertType = ref<"c" | "u">("c");

const handleComplete = async () => {
  const validate = await upsertFormRef.value.validate();
  if (validate !== undefined) {
    return false;
  }
  
  try {
    const data = await (upsertType.value === "c"
      ? saveExamineeInfo(upsertForm.value)
      : updateExamineeInfo(upsertForm.value));

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

const handleUpdate = (record: ExamineeInfo) => {
  upsertForm.value = getUpsertForm();
  visible.value = true;
  upsertForm.value = {
    ...record,
  };
  upsertType.value = "u";
};

const handleRemove = async (record: ExamineeInfo) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除考生 "${record.name}" 吗？删除后将无法恢复，且关联的账号也会被删除。`,
    okButtonProps: {
      status: 'danger'
    },
    onOk: async () => {
      try {
        const success = await removeExamineeInfo(record.examineeInfoId!);
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

const handleViewAccounts = (record: ExamineeInfo) => {
  router.push({
    name: "examineeAccount",
    query: {
      examineeInfoId: record.examineeInfoId?.toString(),
      examineeInfoName: record.name
    }
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
<template>
  <div class="container-form">
    <Breadcrumb :items="['考试管理']" direct />
    <a-card :title="'考试管理'">
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
                <a-form-item :label="'考试状态'" field="status">
                  <a-select
                    v-model="formModel.status"
                    allow-clear
                    placeholder="请选择考试状态"
                  >
                    <a-option :value="0" label="未开始" />
                    <a-option :value="1" label="进行中" />
                    <a-option :value="2" label="已结束" />
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item :label="'考试时间范围'" field="timeRange">
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
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="handleInsert">
              <template #icon>
                <icon-plus />
              </template>
              新建
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

        <template #startTime="{ record }">
          {{ dayjs(record.startTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>

        <template #endTime="{ record }">
          {{ dayjs(record.endTime).format("YYYY-MM-DD HH:mm:ss") }}
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
            v-if="record.status !== 1"
            size="small"
            status="danger"
            type="primary"
            @click="handleRemove(record)"
          >
            删除
          </a-button>
          <a-button
            v-else
            size="small"
            status="success"
            type="primary"
            @click="handleProctoring(record)"
          >
            监考
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
          label="考试名称"
        >
          <a-input v-model="upsertForm.name"></a-input>
        </a-form-item>
        <a-form-item field="description" label="考试描述">
          <a-textarea v-model="upsertForm.description"></a-textarea>
        </a-form-item>
        <a-form-item
          :rules="[{ required: true, message: '不能为空' }]"
          field="startTime"
          label="开始时间"
        >
          <a-date-picker
            v-model="upsertForm.startTime"
            format="YYYY-MM-DD HH:mm:ss"
            show-time
          />
        </a-form-item>
        <a-form-item
          :rules="[{ required: true, message: '不能为空' }]"
          field="endTime"
          label="结束时间"
        >
          <a-date-picker
            v-model="upsertForm.endTime"
            format="YYYY-MM-DD HH:mm:ss"
            show-time
          />
        </a-form-item>
        <a-form-item
          :rules="[{ required: true, message: '不能为空' }]"
          field="duration"
          label="考试时长(分钟)"
        >
          <a-input-number v-model="upsertForm.duration" :max="300" :min="1" />
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
import axios from "axios";
import { Message } from "@arco-design/web-vue";
import dayjs from "dayjs";
import { useRouter } from "vue-router";

// 导入考试相关API和类型
import {
  Exam,
  ExamStatus,
  getExamList,
  createExamInfo,
  updateExamInfo,
  deleteExamById,
} from "@/api/exam";


const generateFormModel = () => {
  return {
    keyword: "",
    status: undefined,
    timeRange: [],
  };
};

const { loading, setLoading } = useLoading(true);
const renderData = ref<Array<Exam>>([]);
const formModel = ref(generateFormModel());

const pagination = reactive<Pagination>({
  current: 1,
  pageSize: 10,
  total: 0,
});

const columns = computed<TableColumnData[]>(() => [
  {
    title: "序号",
    dataIndex: "id",
    width: 60,
    slotName: "index",
  },
  {
    title: "考试名称",
    ellipsis: true,
    tooltip: true,
    dataIndex: "name",
  },
  {
    title: "开始时间",
    dataIndex: "startTime",
    slotName: "startTime",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "结束时间",
    dataIndex: "endTime",
    slotName: "endTime",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "考试时长(分钟)",
    dataIndex: "duration",
  },
  {
    title: "状态",
    dataIndex: "status",
    render: ({ record }) => {
      const statusMap = ["未开始", "进行中", "已结束"];
      return statusMap[record.status];
    },
  },
  {
    title: "描述",
    ellipsis: true,
    tooltip: true,
    dataIndex: "description",
  },
  {
    title: "操作",
    align: "center",
    width: 300,
    slotName: "operation",
    fixed: "right",
  },
]);

// 获取考试列表数据
const fetchData = async (current = 1) => {
  setLoading(true);
  pagination.current = current;

  try {
    const { data, total } = await getExamList(
      current,
      pagination.pageSize,
      formModel.value.keyword,
      formModel.value.status,
      formModel.value.timeRange?.[0] ? formModel.value.timeRange[0] : undefined,
      formModel.value.timeRange?.[1] ? formModel.value.timeRange[1] : undefined
    );
    renderData.value = data;
    pagination.total = total;
  } catch (error) {
    console.error(error);
    Message.error("获取考试列表失败");
  } finally {
    setLoading(false);
  }
};

// 搜索
const search = () => {
  fetchData(1);
};

// 重置
const reset = () => {
  formModel.value = generateFormModel();
  fetchData(1);
};

// 新增/修改表单
const visible = ref(false);
const upsertType = ref("c"); // c: create, u: update
const upsertForm = ref<Partial<Exam>>({
  name: "",
  description: "",
  startTime: new Date(),
  endTime: new Date(),
  duration: 120,
});
const upsertFormRef = ref();

// 新增
const handleInsert = () => {
  upsertType.value = "c";
  upsertForm.value = {
    name: "",
    description: "",
    startTime: new Date(),
    endTime: new Date(),
    duration: 120,
  };
  visible.value = true;
};

// 修改
const handleUpdate = (record: Exam) => {
  upsertType.value = "u";
  upsertForm.value = { ...record };
  visible.value = true;
};

// 提交表单
const handleCompete = async () => {
  const valid = await upsertFormRef.value.validate();
  if (valid) return false;

  try {
    let result = false;
    if (upsertType.value === "c") {
      // 新增考试
      result = await createExamInfo({
        name: upsertForm.value.name!,
        description: upsertForm.value.description,
        startTime: upsertForm.value.startTime!,
        endTime: upsertForm.value.endTime!,
        duration: upsertForm.value.duration!,
      });
    } else {
      // 修改考试
      result = await updateExamInfo(upsertForm.value as Exam);
    }

    if (result) {
      await fetchData(pagination.current);
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    Message.error(upsertType.value === "c" ? "新增失败" : "修改失败");
    return false;
  }
};

// 删除
const handleRemove = async (record: Exam) => {
  try {
    const result = await deleteExamById(record.id);
    if (result) {
      fetchData(pagination.current);
    }
  } catch (error) {
    console.error(error);
    Message.error("删除失败");
  }
};

// 添加进入监考的处理函数
const handleProctoring = (record: Exam) => {
  console.log(`进入考试 ${record.id} (${record.name}) 的监考...`);
  router.push({ path: "/proctoring-view", query: { examId: record.id } });
  Message.info(`准备进入考试 ${record.name} 的监考页面`);
};

const router = useRouter();

onMounted(() => {
  fetchData(1);
});
</script>

<style lang="less" scoped>
.container-form {
  padding: 0 20px 20px 20px;
}

.general-card {
  margin-top: 16px;
}
</style>

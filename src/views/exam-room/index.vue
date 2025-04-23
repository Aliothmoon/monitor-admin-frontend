<script lang="ts" setup>
import { computed, ref, reactive, onMounted } from "vue";
import useLoading from "@/hooks/loading";
import { Pagination } from "@/types/global";
import type { TableColumnData } from "@arco-design/web-vue/es/table/interface";
import { Message } from "@arco-design/web-vue";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import { examList, proctorList, fetchData as fetchApiData } from "./index";

const router = useRouter();

const generateFormModel = () => {
  return {
    keyword: "",
  };
};

const { loading, setLoading } = useLoading(false);
const renderData = ref([]);
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
    title: "考场名称",
    ellipsis: true,
    tooltip: true,
    dataIndex: "roomName",
  },
  {
    title: "关联考试",
    ellipsis: true,
    tooltip: true,
    dataIndex: "examName",
    render: ({ record }) =>
      examList.value.find((e) => e.id === record.examId)?.name || record.examId,
  },
  {
    title: "监考老师",
    ellipsis: true,
    tooltip: true,
    dataIndex: "proctorName",
    render: ({ record }) =>
      proctorList.value.find((p) => p.id === record.proctorId)?.name ||
      record.proctorId,
  },
  {
    title: "考场地点",
    ellipsis: true,
    tooltip: true,
    dataIndex: "location",
  },
  {
    title: "开始时间",
    ellipsis: true,
    tooltip: true,
    dataIndex: "startTime",
    render: ({ record }) =>
      dayjs(record.startTime).format("YYYY-MM-DD HH:mm:ss"),
  },
  {
    title: "结束时间",
    ellipsis: true,
    tooltip: true,
    dataIndex: "endTime",
    render: ({ record }) => dayjs(record.endTime).format("YYYY-MM-DD HH:mm:ss"),
  },
  {
    title: "容纳人数",
    dataIndex: "capacity",
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
    title: "操作",
    align: "center",
    width: 300,
    slotName: "operation",
  },
]);

const loadData = async (
  page = pagination.current,
  pageSize = pagination.pageSize
) => {
  setLoading(true);
  try {
    const { list, total } = await fetchApiData(
      page,
      pageSize,
      formModel.value.keyword
    );
    renderData.value = list;
    pagination.current = page;
    pagination.pageSize = pageSize;
    pagination.total = total;

    renderData.value.forEach((room: any) => {
      room.examName = examList.value.find((e) => e.id === room.examId)?.name;
      room.proctorName = proctorList.value.find(
        (p) => p.id === room.proctorId
      )?.name;
    });
  } catch (err) {
    console.error(err);
    Message.error("获取考场列表失败");
    renderData.value = [];
    pagination.total = 0;
  } finally {
    setLoading(false);
  }
};

const search = () => {
  loadData(1);
};

const reset = () => {
  formModel.value = generateFormModel();
  loadData(1);
};

onMounted(() => {
  loadData();
});

const visible = ref(false);
const upsertType = ref<"c" | "u">("c");
const upsertFormRef = ref();

const generateUpsertForm = (record: any | undefined) => {
  if (record) {
    return {
      id: record.id,
      roomName: record.roomName,
      examId: record.examId,
      proctorId: record.proctorId,
      capacity: record.capacity,
      location: record.location,
      startTime: record.startTime,
      endTime: record.endTime,
    };
  }
  return {
    roomName: "",
    examId: undefined,
    proctorId: undefined,
    capacity: 30,
    location: "",
    startTime: undefined,
    endTime: undefined,
  };
};

const upsertForm = ref(generateUpsertForm(undefined));

const handleInsert = () => {
  upsertForm.value = generateUpsertForm(undefined);
  upsertType.value = "c";
  visible.value = true;
};

const handleUpdate = (record: any | undefined) => {
  upsertForm.value = generateUpsertForm(record);
  upsertType.value = "u";
  visible.value = true;
};

const handleProctoring = (record) => {
  console.log(`进入考场 ${record.id} (${record.roomName}) 的监考...`);
  router.push({ path: "/proctoring-view", query: { roomId: record.id } });
  Message.info(`准备进入考场 ${record.roomName} 的监考页面`);
};

const handleCompete = async () => {
  const valid = await upsertFormRef.value?.validate();
  if (valid) {
    return false;
  }

  try {
    setLoading(true);
    if (upsertType.value === "c") {
      console.log("模拟创建考场:", upsertForm.value);
      await new Promise((resolve) => setTimeout(resolve, 500));
      Message.success("创建成功");
    } else {
      console.log("模拟更新考场:", upsertForm.value);
      await new Promise((resolve) => setTimeout(resolve, 500));
      Message.success("修改成功");
    }
    await loadData();
  } catch (error) {
    console.error(error);
    Message.error(upsertType.value === "c" ? "创建失败" : "修改失败");
  } finally {
    setLoading(false);
  }
  return true;
};

const handleRemove = async (record) => {
  try {
    setLoading(true);
    console.log("模拟删除考场:", record.id);
    await new Promise((resolve) => setTimeout(resolve, 200));
    Message.success("删除成功");
    await loadData();
  } catch (error) {
    console.error(error);
    Message.error("删除失败");
  } finally {
    setLoading(false);
  }
};
</script>

<template>
  <div class="container-form">
    <Breadcrumb :items="['考场管理']" direct />
    <a-card :title="'考场管理'">
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
                    placeholder="搜索考场名称或关联考试"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider direction="vertical" style="height: 42px" />
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
        @page-change="loadData"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>

        <template #operation="{ record }">
          <a-button
            :disabled="record.status !== 1"
            size="small"
            status="success"
            style="margin-right: 10px"
            type="primary"
            @click="handleProctoring(record)"
          >
            进入监考
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
      :title="upsertType == 'c' ? '新增考场' : '修改考场'"
    >
      <a-form
        ref="upsertFormRef"
        :auto-label-width="true"
        :model="upsertForm"
        :size="'large'"
      >
        <a-form-item
          :rules="[{ required: true, message: '不能为空' }]"
          field="roomName"
          label="考场名称"
        >
          <a-input v-model="upsertForm.roomName"></a-input>
        </a-form-item>
        <a-form-item
          :rules="[{ required: true, message: '不能为空' }]"
          field="examId"
          label="关联考试"
        >
          <a-select v-model="upsertForm.examId" placeholder="请选择关联考试">
            <a-option
              v-for="exam in examList"
              :key="exam.id"
              :label="exam.name"
              :value="exam.id"
            ></a-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :rules="[{ required: true, message: '不能为空' }]"
          field="proctorId"
          label="监考老师"
        >
          <a-select v-model="upsertForm.proctorId" placeholder="请选择监考老师">
            <a-option
              v-for="proctor in proctorList"
              :key="proctor.id"
              :label="proctor.name"
              :value="proctor.id"
            ></a-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :rules="[{ required: true, message: '不能为空' }]"
          field="capacity"
          label="容纳人数"
        >
          <a-input-number v-model="upsertForm.capacity" :min="1" />
        </a-form-item>
        <a-form-item field="location" label="考场地点">
          <a-input v-model="upsertForm.location"></a-input>
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
      </a-form>
    </a-modal>
  </div>
</template>

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

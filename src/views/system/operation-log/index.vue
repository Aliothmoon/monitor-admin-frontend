<template>
  <div class="container-form">
    <Breadcrumb :items="['系统管理', '操作日志']" />
    <a-card :title="'操作日志'" class="general-card">
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
                <a-form-item :label="'用户名'" field="username">
                  <a-input v-model="formModel.username" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="'操作类型'" field="operation">
                  <a-input v-model="formModel.operation" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="'请求路径'" field="path">
                  <a-input v-model="formModel.path" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="'IP地址'" field="ip">
                  <a-input v-model="formModel.ip" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="'开始时间'" field="startTime">
                  <a-date-picker
                      v-model="formModel.startTime"
                      show-time
                      style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="'结束时间'" field="endTime">
                  <a-date-picker
                      v-model="formModel.endTime"
                      show-time
                      style="width: 100%"
                  />
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
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button status="danger" @click="handleCleanLog">
              <template #icon>
                <icon-delete />
              </template>
              清空30天前日志
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
        row-key="logId"
        @page-change="fetchData"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>

        <template #status="{ record }">
          <a-tag :color="record.status === 200 ? 'green' : 'red'">
            {{ record.status }}
          </a-tag>
        </template>

        <template #operationTime="{ record }">
          {{ formatDateTime(record.operationTime) }}
        </template>

        <template #duration="{ record }">
          {{ record.duration }} ms
        </template>

        <template #operation="{ record }">
          <a-button size="small" @click="handleViewDetail(record)">
            详情
          </a-button>
        </template>
      </a-table>
    </a-card>
    <a-modal
      v-model:visible="visible"
      :title="'操作日志详情'"
      width="700px"
      @cancel="visible = false"
    >
      <a-descriptions
        :column="{ xs: 1, sm: 2, md: 2 }"
        :data="detailData"
        :label-style="{ 'font-weight': 'bold' }"
        layout="horizontal"
        size="large"
        title="基本信息"
        bordered
      />
      <a-descriptions
        :column="1"
        :data="detailParamsData"
        :label-style="{ 'font-weight': 'bold' }"
        layout="horizontal"
        size="large"
        title="请求参数"
        bordered
      />
      <a-descriptions
        v-if="currentDetail.errorMsg"
        :column="1"
        :data="detailErrorData"
        :label-style="{ 'font-weight': 'bold' }"
        layout="horizontal"
        size="large"
        title="错误信息"
        bordered
      />
      <template #footer>
        <a-button @click="visible = false">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive } from "vue";
import useLoading from "@/hooks/loading";
import { Pagination } from "@/types/global";
import type { TableColumnData } from "@arco-design/web-vue/es/table/interface";
import { Message, Modal } from "@arco-design/web-vue";
import dayjs from "dayjs";
import { 
  OperationLog, 
  getOperationLogPageData,
  cleanLogBeforeDays
} from "@/api/operation-log";

// 格式化日期时间
const formatDateTime = (dateTime?: string) => {
  if (!dateTime) return '';
  return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss');
};

// 将日期对象转换为字符串
const dateToString = (date?: Date) => {
  if (!date) return undefined;
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};

// 检查字符串是否为JSON格式
const isJsonString = (str?: string) => {
  if (!str) return false;
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

// 美化JSON字符串
const prettyJson = (str?: string) => {
  if (!str) return '';
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch (e) {
    return str;
  }
};

const generateFormModel = () => {
  return {
    username: "",
    operation: "",
    path: "",
    ip: "",
    startTime: undefined as Date | undefined,
    endTime: undefined as Date | undefined,
  };
};

const { loading, setLoading } = useLoading(true);
const renderData = ref<Array<OperationLog>>([]);
const formModel = ref(generateFormModel());
const visible = ref(false);
const currentDetail = ref<OperationLog>({});

const pagination = reactive<Pagination>({
  current: 1,
  pageSize: 10,
});

const columns = computed<TableColumnData[]>(() => [
  {
    title: "序号",
    dataIndex: "logId",
    slotName: "index",
    width: 60,
  },
  {
    title: "用户名",
    dataIndex: "username",
    width: 120,
  },
  {
    title: "操作类型",
    dataIndex: "operation",
    width: 100,
  },
  {
    title: "请求路径",
    dataIndex: "path",
    width: 200,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "IP地址",
    dataIndex: "ip",
    width: 120,
  },
  {
    title: "状态",
    dataIndex: "status",
    slotName: "status",
    width: 80,
  },
  {
    title: "操作时间",
    dataIndex: "operationTime",
    slotName: "operationTime",
    width: 180,
  },
  {
    title: "耗时",
    dataIndex: "duration",
    slotName: "duration",
    width: 100,
  },
  {
    title: "操作",
    dataIndex: "operations",
    slotName: "operation",
    width: 80,
  },
]);

const fetchData = async (current = pagination.current) => {
  setLoading(true);
  pagination.current = current;
  
  try {
    const data = await getOperationLogPageData(
      pagination.current,
      pagination.pageSize,
      formModel.value.username || undefined,
      formModel.value.operation || undefined,
      formModel.value.path || undefined,
      formModel.value.ip || undefined,
      dateToString(formModel.value.startTime),
      dateToString(formModel.value.endTime)
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

fetchData();

const reset = () => {
  formModel.value = generateFormModel();
  search();
};

// 清空30天前日志
const handleCleanLog = () => {
  Modal.confirm({
    title: '确认清空',
    content: '确定要清空30天前的操作日志吗？清空后将无法恢复。',
    onOk: async () => {
      try {
        const success = await cleanLogBeforeDays(30);
        if (success) {
          Message.success('清空成功');
          fetchData();
        } else {
          Message.error('清空失败');
        }
      } catch (error) {
        console.error(error);
        Message.error('清空失败');
      }
    },
  });
};

// 详情数据
const detailData = computed(() => [
  {
    label: '日志ID',
    value: currentDetail.value.logId,
  },
  {
    label: '用户ID',
    value: currentDetail.value.userId,
  },
  {
    label: '用户名',
    value: currentDetail.value.username,
  },
  {
    label: '操作类型',
    value: currentDetail.value.operation,
  },
  {
    label: '请求方法',
    value: currentDetail.value.method,
  },
  {
    label: '请求路径',
    value: currentDetail.value.path,
  },
  {
    label: 'IP地址',
    value: currentDetail.value.ip,
  },
  {
    label: '浏览器',
    value: currentDetail.value.browser,
  },
  {
    label: '操作系统',
    value: currentDetail.value.os,
  },
  {
    label: '状态码',
    value: currentDetail.value.status,
  },
  {
    label: '操作时间',
    value: formatDateTime(currentDetail.value.operationTime),
  },
  {
    label: '耗时',
    value: `${currentDetail.value.duration} ms`,
  },
]);

const detailParamsData = computed(() => [
  {
    label: '请求参数',
    value: isJsonString(currentDetail.value.params) 
      ? prettyJson(currentDetail.value.params)
      : currentDetail.value.params || '无',
  },
]);

const detailErrorData = computed(() => [
  {
    label: '错误信息',
    value: currentDetail.value.errorMsg,
  },
]);

// 查看日志详情
const handleViewDetail = (record: OperationLog) => {
  currentDetail.value = record;
  visible.value = true;
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

:deep(.arco-descriptions-item-label) {
  padding: a-spacing(2);
  font-weight: bold;
}

:deep(.arco-descriptions-item-value) {
  padding: a-spacing(2);
  white-space: pre-wrap;
  word-break: break-all;
}
</style> 
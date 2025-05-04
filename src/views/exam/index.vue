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
            <a-button @click="handleImportOpen">
              <template #icon>
                <icon-upload />
              </template>
              导入考生
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
      width="650px"
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

        <!-- 新增可疑进程选择 -->
        <a-form-item field="suspiciousProcessIds" label="可疑进程">
          <div class="select-wrapper">
            <a-select
              v-model="upsertForm.suspiciousProcessIds"
              placeholder="请选择可疑进程"
              allow-clear
              multiple
              style="width: calc(100% - 80px)"
            >
              <a-option
                v-for="item in processOptions"
                :key="item.id"
                :value="item.id"
                :label="item.processName"
              />
            </a-select>
            <a-button
              :type="'primary'"
              size="medium"
              status="normal"
              @click="handleSelectAllProcesses"
              style="margin-left: 8px"
            >
              {{ isAllProcessesSelected ? "清除" : "全选" }}
            </a-button>
          </div>
        </a-form-item>

        <!-- 新增域名黑名单选择 -->
        <a-form-item field="blacklistDomainIds" label="域名黑名单">
          <div class="select-wrapper">
            <a-select
              v-model="upsertForm.blacklistDomainIds"
              placeholder="请选择域名黑名单"
              allow-clear
              multiple
              style="width: calc(100% - 80px)"
            >
              <a-option
                v-for="item in domainOptions"
                :key="item.id"
                :value="item.id"
                :label="item.domain"
              />
            </a-select>
            <a-button
              :type="'primary'"
              status="normal"
              size="medium"
              @click="handleSelectAllDomains"
              style="margin-left: 8px"
            >
              {{ isAllDomainsSelected ? "清除" : "全选" }}
            </a-button>
          </div>
        </a-form-item>

        <!-- 新增风险图片模板选择 -->
        <a-form-item field="riskImageIds" label="风险图片模板">
          <div class="select-wrapper">
            <a-select
              v-model="upsertForm.riskImageIds"
              placeholder="请选择风险图片模板"
              allow-clear
              multiple
              style="width: calc(100% - 80px)"
            >
              <a-option
                v-for="item in imageOptions"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </a-select>
            <a-button
              :type="'primary'"
              size="medium"
              status="normal"
              @click="handleSelectAllImages"
              style="margin-left: 8px"
            >
              {{ isAllImagesSelected ? "清除" : "全选" }}
            </a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 导入考生信息弹窗 -->
    <a-modal
      v-model:visible="importVisible"
      :title="'导入考生信息'"
      @before-ok="handleImportExaminees"
    >
      <a-form>
        <a-form-item field="examId" label="考试">
          <a-select v-model="importForm.examId" placeholder="请选择考试">
            <a-option
              v-for="exam in renderData"
              :key="exam.id"
              :value="exam.id"
              :label="exam.name"
            />
          </a-select>
        </a-form-item>
        <a-form-item field="file" label="考生Excel文件">
          <a-upload
            :accept="'.xlsx,.xls'"
            :action="'/api/exam/examinees/import'"
            :custom-request="customUploadRequest"
            :limit="1"
            :show-file-list="true"
          >
            <template #upload-button>
              <a-button>选择文件</a-button>
            </template>
          </a-upload>
          <div class="upload-tip">
            上传Excel文件，包含考生学院、班级、姓名等信息
          </div>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="downloadTemplate">下载模板</a-button>
        </a-form-item>
      </a-form>
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
import { useRouter } from "vue-router";

// 导入考试相关API和类型
// 导入新的API
import {
  createExamInfo,
  deleteExamById,
  downloadExamineeTemplate,
  Exam,
  getBlacklistDomainList,
  getExamList,
  getRiskImageTemplateList,
  getSuspiciousProcessList,
  importExaminees,
  updateExamInfo,
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

// 可疑进程、域名黑名单、风险图片模板选项
const processOptions = ref([]);
const domainOptions = ref([]);
const imageOptions = ref([]);

// 全选状态计算属性
const isAllProcessesSelected = computed(() => {
  return (
    processOptions.value.length > 0 &&
    upsertForm.value.suspiciousProcessIds?.length ===
      processOptions.value.length
  );
});

const isAllDomainsSelected = computed(() => {
  return (
    domainOptions.value.length > 0 &&
    upsertForm.value.blacklistDomainIds?.length === domainOptions.value.length
  );
});

const isAllImagesSelected = computed(() => {
  return (
    imageOptions.value.length > 0 &&
    upsertForm.value.riskImageIds?.length === imageOptions.value.length
  );
});

// 全选/取消全选处理函数
const handleSelectAllProcesses = () => {
  if (isAllProcessesSelected.value) {
    // 当前是全选状态，取消全选
    upsertForm.value.suspiciousProcessIds = [];
  } else {
    // 当前非全选状态，设置全选
    upsertForm.value.suspiciousProcessIds = processOptions.value.map(
      (item) => item.id
    );
  }
};

const handleSelectAllDomains = () => {
  if (isAllDomainsSelected.value) {
    // 当前是全选状态，取消全选
    upsertForm.value.blacklistDomainIds = [];
  } else {
    // 当前非全选状态，设置全选
    upsertForm.value.blacklistDomainIds = domainOptions.value.map(
      (item) => item.id
    );
  }
};

const handleSelectAllImages = () => {
  if (isAllImagesSelected.value) {
    // 当前是全选状态，取消全选
    upsertForm.value.riskImageIds = [];
  } else {
    // 当前非全选状态，设置全选
    upsertForm.value.riskImageIds = imageOptions.value.map((item) => item.id);
  }
};

// 获取选项数据
const fetchOptions = async () => {
  try {
    const [processes, domains, images] = await Promise.all([
      getSuspiciousProcessList(),
      getBlacklistDomainList(),
      getRiskImageTemplateList(),
    ]);

    processOptions.value = processes;
    domainOptions.value = domains;
    imageOptions.value = images;
  } catch (error) {
    console.error(error);
    Message.error("获取选项数据失败");
  }
};

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
  suspiciousProcessIds: [],
  blacklistDomainIds: [],
  riskImageIds: [],
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
    suspiciousProcessIds: [],
    blacklistDomainIds: [],
    riskImageIds: [],
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
        suspiciousProcessIds: upsertForm.value.suspiciousProcessIds || [],
        blacklistDomainIds: upsertForm.value.blacklistDomainIds || [],
        riskImageIds: upsertForm.value.riskImageIds || [],
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

// 导入考生信息
const importVisible = ref(false);
const importForm = reactive({
  examId: undefined,
  file: null,
});

// 打开导入考生对话框
const handleImportOpen = () => {
  importVisible.value = true;
};

// 自定义上传请求
const customUploadRequest = (options) => {
  const { file, onSuccess, onError } = options;
  importForm.file = file;

  // 仅保存文件引用，不立即上传
  onSuccess();
};

// 提交导入
const handleImportExaminees = async () => {
  if (!importForm.examId) {
    Message.error("请选择考试");
    return false;
  }

  if (!importForm.file) {
    Message.error("请选择文件");
    return false;
  }

  try {
    const formData = new FormData();
    formData.append("examId", importForm.examId);
    formData.append("file", importForm.file);

    const result = await importExaminees(formData);
    if (result) {
      Message.success("导入成功");
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    Message.error("导入失败");
    return false;
  }
};

// 下载模板
const downloadTemplate = () => {
  downloadExamineeTemplate();
};

const router = useRouter();

onMounted(() => {
  fetchData(1);
  fetchOptions();
});
</script>

<style lang="less" scoped>
.container-form {
  padding: 0 20px 20px 20px;
}

.general-card {
  margin-top: 16px;
}

.upload-tip {
  margin-top: 8px;
  color: #666;
  font-size: 12px;
}

.select-wrapper {
  display: flex;
  width: 100%;
  align-items: center;
}
</style>

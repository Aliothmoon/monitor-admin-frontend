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
          <a-space>
            <a-button size="small" type="primary" @click="handleUpdate(record)">
              修改
            </a-button>
            <a-button
              size="small"
              type="outline"
              @click="handleManageExaminees(record)"
            >
              管理考生
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
          </a-space>
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
          :rules="[
            { required: true, message: '不能为空' },
            {
              validator: (value, cb) => {
                if (
                  upsertForm.startTime &&
                  value &&
                  dayjs(value).isBefore(dayjs(upsertForm.startTime))
                ) {
                  cb('结束时间必须晚于开始时间');
                }
                cb();
              },
            },
          ]"
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

        <!-- 添加考试地点字段 -->
        <a-form-item
          :rules="[{ required: true, message: '不能为空' }]"
          field="location"
          label="考试地点"
        >
          <a-input v-model="upsertForm.location" placeholder="请输入考试地点" />
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


    <!-- 考生名单管理模态框 -->
    <a-modal
      v-model:visible="examineeVisible"
      :title="`考生名单管理 - ${currentExam?.name || ''}`"
      width="1200px"
      :footer="false"
    >
      <div style="max-height: 70vh; overflow-y: auto">
        <a-row style="margin-bottom: 16px">
          <a-col :span="24">
            <a-space>
              <a-button type="primary" @click="handleAddExaminee">
                <template #icon>
                  <icon-plus />
                </template>
                添加考生
              </a-button>
              <a-input
                v-model="examineeSearchKeyword"
                placeholder="搜索考生姓名/学号"
                style="width: 240px"
              >
                <template #suffix>
                  <icon-search />
                </template>
              </a-input>
              <a-button status="success" @click="handleExportExaminees">
                <template #icon>
                  <icon-download />
                </template>
                导出名单
              </a-button>
            </a-space>
          </a-col>
        </a-row>

        <a-table
          :loading="examineeLoading"
          :pagination="examineePagination"
          :data="filteredExaminees"
          :columns="examineeColumns"
          row-key="id"
          :scroll="{ y: '50vh' }"
          @page-change="handleExamineePageChange"
        >
          <template #index="{ rowIndex }">
            {{
              rowIndex +
              1 +
              (examineePagination.current - 1) * examineePagination.pageSize
            }}
          </template>
          <template #operation="{ record }">
            <a-space>
              <a-button
                size="small"
                type="primary"
                @click="handleEditExaminee(record)"
              >
                编辑
              </a-button>
              <a-button
                size="small"
                status="danger"
                @click="handleDeleteExaminee(record)"
              >
                删除
              </a-button>
            </a-space>
          </template>
        </a-table>
      </div>
    </a-modal>

    <!-- 考生信息编辑模态框 -->
    <a-modal
      v-model:visible="examineeEditVisible"
      :title="examineeEditType === 'add' ? '添加考生' : '编辑考生信息'"
      @before-ok="handleExamineeEditSubmit"
    >
      <a-form
        ref="examineeFormRef"
        :model="examineeForm"
        :rules="examineeRules"
        :label-col-props="{ span: 6 }"
        :wrapper-col-props="{ span: 18 }"
      >
        <a-form-item
          label="姓名"
          field="name"
          :rules="[{ required: true, message: '请输入姓名' }]"
        >
          <a-input v-model="examineeForm.name" placeholder="请输入姓名" />
        </a-form-item>
        <a-form-item
          label="学号"
          field="studentId"
          :rules="[{ required: true, message: '请输入学号' }]"
        >
          <a-input v-model="examineeForm.studentId" placeholder="请输入学号" />
        </a-form-item>
        <a-form-item label="学院" field="college">
          <a-input v-model="examineeForm.college" placeholder="请输入学院" />
        </a-form-item>
        <a-form-item label="班级" field="className">
          <a-input v-model="examineeForm.className" placeholder="请输入班级" />
        </a-form-item>
        <a-form-item
          label="账号"
          field="account"
          :rules="[{ required: true, message: '请输入账号' }]"
        >
          <a-input
            v-model="examineeForm.account"
            placeholder="请输入账号，不填则默认使用学号"
          />
        </a-form-item>
        <a-form-item
          label="密码"
          field="password"
          :rules="[
            { required: examineeEditType === 'add', message: '请输入密码' },
          ]"
        >
          <a-input-password
            v-model="examineeForm.password"
            placeholder="请输入密码"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import useLoading from "@/hooks/loading";
import { Pagination } from "@/types/global";
import type { TableColumnData } from "@arco-design/web-vue/es/table/interface";
import { Message, Modal } from "@arco-design/web-vue";
import dayjs from "dayjs";
import { useRouter } from "vue-router";

// 导入考试相关API和类型
// 导入新的API
import {
  addExamineeToExam,
  createExamInfo,
  deleteExamById,
  downloadExamineeTemplate,
  Exam,
  exportExaminees,
  getBlacklistDomainList,
  getExamExaminees,
  getExamList,
  getRiskImageTemplateList,
  getSuspiciousProcessList,
  importExaminees,
  removeExamineeFromExam,
  updateExamExamineeAccount,
  updateExamInfo,
} from "@/api/exam";

// 引入考生信息和账号相关API
import { ExamineeAccountWithInfo } from "@/api/examinee-account";
import { ExamineeInfo, saveExamineeInfo } from "@/api/examinee-info";
import { RequestOption } from "@arco-design/web-vue/es/upload/interfaces";

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
    title: "考试地点",
    dataIndex: "location",
    ellipsis: true,
    tooltip: true,
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
  location: "",
  suspiciousProcessIds: [],
  blacklistDomainIds: [],
  riskImageIds: [],
});
const upsertFormRef = ref();

// 监听时间变化，自动计算时长
let timeUpdateLock = false; // 避免循环更新的锁
let durationUpdateLock = false; // 避免循环更新的锁

watch(
  () => [upsertForm.value.startTime, upsertForm.value.endTime],
  ([newStartTime, newEndTime]) => {
    if (timeUpdateLock) return; // 如果处于锁定状态，跳过处理

    if (newStartTime && newEndTime) {
      // 计算时间差（分钟）
      const startTime = dayjs(newStartTime);
      const endTime = dayjs(newEndTime);
      const diffMinutes = endTime.diff(startTime, "minute");

      // 如果时间差有效（大于0），则更新duration
      if (diffMinutes > 0) {
        durationUpdateLock = true; // 锁定duration的更新监听
        upsertForm.value.duration = diffMinutes;
        // 使用setTimeout解锁，确保DOM更新完成
        setTimeout(() => {
          durationUpdateLock = false;
        }, 0);
      }
    }
  }
);

// 监听时长变化，自动调整结束时间
watch(
  () => upsertForm.value.duration,
  (newDuration) => {
    if (durationUpdateLock) return; // 如果处于锁定状态，跳过处理

    if (newDuration && upsertForm.value.startTime) {
      // 基于开始时间和新时长计算结束时间
      timeUpdateLock = true; // 锁定时间更新监听
      const startTime = dayjs(upsertForm.value.startTime);
      upsertForm.value.endTime = startTime.add(newDuration, "minute").toDate();
      // 使用setTimeout解锁，确保DOM更新完成
      setTimeout(() => {
        timeUpdateLock = false;
      }, 0);
    }
  }
);

// 新增
const handleInsert = () => {
  upsertType.value = "c";
  upsertForm.value = {
    name: "",
    description: "",
    startTime: new Date(),
    endTime: new Date(),
    duration: 120,
    location: "",
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
        location: upsertForm.value.location!,
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
      await fetchData(pagination.current);
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






// 下载模板
const downloadTemplate = () => {
  downloadExamineeTemplate();
};

// 考生管理相关
const examineeVisible = ref(false);
const currentExam = ref<Exam | null>(null);
const examinees = ref<ExamineeAccountWithInfo[]>([]);
const examineeLoading = ref(false);
const examineeSearchKeyword = ref("");

// 考生筛选
const filteredExaminees = computed(() => {
  if (!examineeSearchKeyword.value) {
    return examinees.value;
  }

  const keyword = examineeSearchKeyword.value.toLowerCase();
  return examinees.value.filter(
    (item) =>
      (item.name && item.name.toLowerCase().includes(keyword)) ||
      (item.studentId && item.studentId.toLowerCase().includes(keyword))
  );
});

// 考生分页
const examineePagination = reactive<Pagination>({
  current: 1,
  pageSize: 10,
  total: 0,
});

// 考生表格列
const examineeColumns = computed<TableColumnData[]>(() => [
  {
    title: "序号",
    dataIndex: "id",
    width: 70,
    slotName: "index",
    fixed: "left",
  },
  {
    title: "姓名",
    dataIndex: "name",
    width: 120,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "学号",
    dataIndex: "studentId",
    width: 140,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "学院",
    dataIndex: "college",
    width: 180,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "班级",
    dataIndex: "className",
    width: 180,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "考试账号",
    dataIndex: "account",
    width: 140,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "操作",
    width: 160,
    slotName: "operation",
    fixed: "right",
  },
]);

// 打开考生管理模态框
const handleManageExaminees = async (record: Exam) => {
  currentExam.value = record;
  examineeVisible.value = true;
  examineeSearchKeyword.value = "";
  examineePagination.current = 1;
  await fetchExaminees();
};

// 获取考生列表
const fetchExaminees = async () => {
  if (!currentExam.value) return;

  examineeLoading.value = true;
  try {
    // 使用正确的API调用获取考试的考生列表
    const { data, total } = await getExamExaminees(
      currentExam.value.id,
      examineePagination.current,
      examineePagination.pageSize
    );
    examinees.value = data || [];
    examineePagination.total = total;
  } catch (error) {
    console.error(error);
    Message.error("获取考生列表失败");
  } finally {
    examineeLoading.value = false;
  }
};

// 考生分页变化
const handleExamineePageChange = (page: number) => {
  examineePagination.current = page;
  fetchExaminees();
};

// 考生编辑相关
const examineeEditVisible = ref(false);
const examineeEditType = ref<"add" | "edit">("add");
const examineeForm = ref({
  id: undefined,
  name: "",
  studentId: "",
  college: "",
  className: "",
  account: "",
  password: "",
  examId: undefined,
});

// 监听学号变化，当账号为空时自动填充
watch(
  () => examineeForm.value.studentId,
  (newStudentId) => {
    if (
      newStudentId &&
      !examineeForm.value.account &&
      examineeEditType.value === "add"
    ) {
      examineeForm.value.account = newStudentId;
    }
  }
);

const examineeFormRef = ref();
const examineeRules = {
  name: [{ required: true, message: "请输入考生姓名" }],
  studentId: [{ required: true, message: "请输入学号" }],
  account: [{ required: true, message: "请输入账号" }],
  password: [{ required: true, message: "请输入密码" }],
};

// 添加考生
const handleAddExaminee = () => {
  examineeEditType.value = "add";
  examineeForm.value = {
    id: undefined,
    name: "",
    studentId: "",
    college: "",
    className: "",
    account: "",
    password: "",
    examId: currentExam.value?.id,
  };
  examineeEditVisible.value = true;
};

// 编辑考生
const handleEditExaminee = (record: any) => {
  examineeEditType.value = "edit";
  examineeForm.value = {
    ...record,
    password: "", // 编辑时不回显密码
  };
  examineeEditVisible.value = true;
};

// 提交考生表单
const handleExamineeEditSubmit = async () => {
  const valid = await examineeFormRef.value.validate();
  if (valid) return false;

  try {
    // 如果账号为空，默认使用学号作为账号
    if (!examineeForm.value.account) {
      examineeForm.value.account = examineeForm.value.studentId;
    }

    // 如果密码为空且是添加模式，生成一个6位随机密码
    if (!examineeForm.value.password && examineeEditType.value === "add") {
      examineeForm.value.password = Math.random().toString(36).slice(-6);
    }

    if (examineeEditType.value === "add") {
      // 先保存考生信息
      const examineeInfoData: Partial<ExamineeInfo> = {
        name: examineeForm.value.name,
        studentId: examineeForm.value.studentId,
        college: examineeForm.value.college,
        className: examineeForm.value.className,
      };

      try {
        // 保存考生信息并获取ID
        const result = await saveExamineeInfo(examineeInfoData as ExamineeInfo);

        if (result) {
          // result是examineeInfoId
          // 类型转换为number，解决类型错误
          const examineeInfoId = Number(result);

          // 尝试添加考生到考试，可能会因为重复添加失败
          const addResult = await addExamineeToExam(
            currentExam.value!.id,
            examineeInfoId
          );

          if (!addResult) {
            // 如果添加失败，可能是考生已经在这个考试中了
            // 获取当前考试的考生列表，检查是否已存在
            const { data } = await getExamExaminees(
              currentExam.value!.id,
              1,
              1000, // 获取足够多的记录以便查找
              examineeForm.value.studentId
            );

            const existingExaminee = data.find(
              (e) => e.studentId === examineeForm.value.studentId
            );

            if (existingExaminee) {
              // 如果已存在，则更新账号信息
              await updateExamExamineeAccount({
                id: existingExaminee.id,
                account: examineeForm.value.account,
                password: examineeForm.value.password || undefined,
              });

              Message.success("考生已存在，已更新账号信息");
            } else {
              Message.error("添加考生失败");
              return false;
            }
          } else {
            // 添加成功，更新考生账号信息
            await updateExamExamineeAccount({
              examineeInfoId,
              examId: currentExam.value!.id,
              account: examineeForm.value.account,
              password: examineeForm.value.password,
            });

            Message.success("添加考生成功");
          }
        } else {
          Message.error("添加考生失败");
          return false;
        }
      } catch (err) {
        console.error(err);
        Message.error("保存考生信息失败");
        return false;
      }
    } else {
      // 更新考生账号信息
      await updateExamExamineeAccount({
        id: examineeForm.value.id,
        account: examineeForm.value.account,
        password: examineeForm.value.password || undefined,
      });
      Message.success("更新考生成功");
    }

    await fetchExaminees();
    return true;
  } catch (error) {
    console.error(error);
    Message.error(
      examineeEditType.value === "add" ? "添加考生失败" : "更新考生失败"
    );
    return false;
  }
};

// 删除考生
const handleDeleteExaminee = async (record: any) => {
  try {
    // 显示删除确认对话框
    const confirmed = await Modal.confirm({
      title: "删除确认",
      content: `确定要删除考生 ${record.name || ""} (${
        record.studentId || ""
      }) 吗？`,
    });

    if (!confirmed) return;

    const result = await removeExamineeFromExam(
      currentExam.value.id,
      record.id
    );
    if (result) {
      Message.success("删除考生成功");
      await fetchExaminees();
    } else {
      Message.error("删除考生失败");
    }
  } catch (error) {
    console.error(error);
    Message.error("删除考生失败");
  }
};

// 导出考生名单
const handleExportExaminees = async () => {
  if (!currentExam.value) return;

  try {
    const result = await exportExaminees(currentExam.value.id);
    if (result) {
      Message.success("考生名单导出成功");
    }
  } catch (error) {
    console.error(error);
    Message.error("导出考生名单失败");
  }
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

import { Message } from "@arco-design/web-vue";
import {
  getSuspiciousProcessList as fetchSuspiciousProcessList,
  getSuspiciousProcessById,
  getSuspiciousProcessByRiskLevel,
  addSuspiciousProcess,
  updateSuspiciousProcess,
  deleteSuspiciousProcess,
  SuspiciousProcessVO,
  SuspiciousProcessQueryParams
} from "@/api/exam-config";

// 使用后端的数据结构定义
export type SuspiciousProcess = SuspiciousProcessVO;

// 风险等级选项
export const riskLevelOptions = [
  { label: "低风险", value: 1 },
  { label: "中风险", value: 2 },
  { label: "高风险", value: 3 },
];

// 获取风险等级文本
export const getRiskLevelText = (level: number): string => {
  const option = riskLevelOptions.find(opt => opt.value === level);
  return option ? option.label : "未知";
};

// 获取可疑进程列表
export const getSuspiciousProcessList = async (
  current = 1,
  pageSize = 10,
  processName = "",
  riskLevel = undefined,
) => {
  try {
    const params: SuspiciousProcessQueryParams = {
      pageNum: current,
      pageSize: pageSize,
      processName: processName || undefined,
      riskLevel: riskLevel,
    };
    
    const response = await fetchSuspiciousProcessList(params);
    const { data } = response;

    console.log(data)
    if (data.code === 0) {
      return {
        data: data.data.records || [],
        total: data.data.totalRow || 0
      };
    } else {
      Message.error(data.msg || "获取可疑进程列表失败");
      return { data: [], total: 0 };
    }
  } catch (error) {
    console.error(error);
    Message.error("获取可疑进程列表失败");
    return {
      data: [],
      total: 0,
    };
  }
};

// 根据风险等级获取可疑进程列表
export const getSuspiciousProcessesByRiskLevel = async (riskLevel: number) => {
  try {
    const response = await getSuspiciousProcessByRiskLevel(riskLevel);
    const { data } = response;
    
    if (data.code === 0 && data.data) {
      return data.data;
    } else {
      Message.error(data.msg || "获取特定风险等级的可疑进程失败");
      return [];
    }
  } catch (error) {
    console.error(error);
    Message.error("获取特定风险等级的可疑进程失败");
    return [];
  }
};

// 获取可疑进程详情
export const getSuspiciousProcess = async (id: number) => {
  try {
    const response = await getSuspiciousProcessById(id);
    const { data } = response;
    
    if (data.code === 0 && data.data) {
      return data.data;
    } else {
      Message.error(data.msg || "获取可疑进程详情失败");
      return null;
    }
  } catch (error) {
    console.error(error);
    Message.error("获取可疑进程详情失败");
    return null;
  }
};

// 新增可疑进程
export const createSuspiciousProcess = async (processData: SuspiciousProcessVO) => {
  try {
    const response = await addSuspiciousProcess(processData);
    const { data } = response;
    
    if (data.code === 0 && data.data) {
      Message.success("新增成功");
      return true;
    } else {
      Message.error(data.msg || "新增失败");
      return false;
    }
  } catch (error) {
    console.error(error);
    Message.error("新增失败");
    return false;
  }
};

// 修改可疑进程
export const updateSuspiciousProcessData = async (processData: SuspiciousProcessVO) => {
  try {
    const response = await updateSuspiciousProcess(processData);
    const { data } = response;
    
    if (data.code === 0 && data.data) {
      Message.success("修改成功");
      return true;
    } else {
      Message.error(data.msg || "修改失败");
      return false;
    }
  } catch (error) {
    console.error(error);
    Message.error("修改失败");
    return false;
  }
};

// 删除可疑进程
export const deleteSuspiciousProcessData = async (id: number) => {
  try {
    const response = await deleteSuspiciousProcess(id);
    const { data } = response;
    
    if (data.code === 0 && data.data) {
      Message.success("删除成功");
      return true;
    } else {
      Message.error(data.msg || "删除失败");
      return false;
    }
  } catch (error) {
    console.error(error);
    Message.error("删除失败");
    return false;
  }
};

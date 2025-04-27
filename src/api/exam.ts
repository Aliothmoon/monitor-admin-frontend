import axios from "axios";
import { Message } from "@arco-design/web-vue";

// 考试状态枚举
export enum ExamStatus {
  NOT_STARTED = 0,
  ONGOING = 1,
  ENDED = 2,
}

// 定义考试数据接口
export interface Exam {
  id: number;
  name: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  status: ExamStatus;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: number;
  updatedBy?: number;
}

// 查询参数
export interface ExamQueryParams {
  pageNum: number;
  pageSize: number;
  keyword?: string;
  status?: number;
  startTime?: Date;
  endTime?: Date;
}

// API接口
export const fetchExamList = (params: ExamQueryParams) => {
  return axios.post("/exam/page", params);
};

export const fetchExamById = (id: number) => {
  return axios.get(`/exam/${id}`);
};

export const createExam = (data: any) => {
  return axios.post("/exam", data);
};

export const updateExam = (data: any) => {
  return axios.put("/exam", data);
};

export const deleteExam = (id: number) => {
  return axios.delete(`/exam/${id}`);
};

// 获取考试列表
export const getExamList = async (
  current = 1,
  pageSize = 10,
  keyword?: string,
  status?: number,
  startTime?: Date,
  endTime?: Date
) => {
  try {
    const params: ExamQueryParams = {
      pageNum: current,
      pageSize,
      keyword: keyword || undefined,
      status: status !== undefined ? status : undefined,
      startTime: startTime,
      endTime: endTime,
    };

    const response = await fetchExamList(params);
    const { data } = response;

    if (data.code === 0) {
      return {
        data: data.data.records || [],
        total: data.data.totalRow || 0,
      };
    } else {
      Message.error(data.msg || "获取考试列表失败");
      return { data: [], total: 0 };
    }
  } catch (error) {
    console.error(error);
    Message.error("获取考试列表失败");
    return {
      data: [],
      total: 0,
    };
  }
};

// 创建考试
export const createExamInfo = async (examData: Partial<Exam>) => {
  try {
    const response = await createExam({
      ...examData,
      startTime: examData.startTime,
      endTime: examData.endTime,
    });

    const { data } = response;

    if (data.code === 0) {
      Message.success("创建成功");
      return true;
    } else {
      Message.error(data.msg || "创建失败");
      return false;
    }
  } catch (error) {
    console.error(error);
    Message.error("创建失败");
    return false;
  }
};

// 更新考试
export const updateExamInfo = async (
  examData: Partial<Exam> & { id: number }
) => {
  try {
    const response = await updateExam({
      ...examData,
      startTime: examData.startTime,
      endTime: examData.endTime,
    });

    const { data } = response;

    if (data.code === 0) {
      Message.success("更新成功");
      return true;
    } else {
      Message.error(data.msg || "更新失败");
      return false;
    }
  } catch (error) {
    console.error(error);
    Message.error("更新失败");
    return false;
  }
};

// 删除考试
export const deleteExamById = async (id: number) => {
  try {
    const response = await deleteExam(id);
    const { data } = response;

    if (data.code === 0) {
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

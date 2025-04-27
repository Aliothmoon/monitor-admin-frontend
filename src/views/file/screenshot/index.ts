import { Message } from "@arco-design/web-vue";
import axios from "axios";
import dayjs from "dayjs";

// 定义截图数据接口
export interface Screenshot {
  id: number;
  examId: number;
  examName: string;
  studentId: number;
  studentName: string;
  captureTime: Date;
  imageUrl: string;
  fileSize: number; // 单位KB
  riskLevel: number; // 风险等级：0-低风险, 1-中风险, 2-高风险
  remark?: string;
}

// 查询参数
export interface ScreenshotQueryParams {
  pageNum: number;
  pageSize: number;
  keyword?: string;
  riskLevel?: number;
  startTime?: Date;
  endTime?: Date;
  examId?: number;
  studentId?: number;
}

// API接口
export const fetchScreenshotList = (params: ScreenshotQueryParams) => {
  return axios.post("/file/screenshot/page", params);
};

export const fetchScreenshotById = (id: number) => {
  return axios.get(`/file/screenshot/${id}`);
};

export const updateScreenshot = (data: any) => {
  return axios.put("/file/screenshot", data);
};

export const deleteScreenshot = (id: number) => {
  return axios.delete(`/file/screenshot/${id}`);
};

// 获取截图列表
export const getScreenshotList = async (
  current = 1,
  pageSize = 10,
  keyword = "",
  riskLevel?: number,
  startTime?: Date,
  endTime?: Date,
  examId?: number,
  studentId?: number
) => {
  try {
    const params: ScreenshotQueryParams = {
      pageNum: current,
      pageSize: pageSize,
      keyword: keyword || undefined,
      riskLevel: riskLevel,
      startTime: startTime,
      endTime: endTime,
      examId: examId,
      studentId: studentId
    };

    const response = await fetchScreenshotList(params);
    const { data } = response;

    if (data.code === 0) {
      return {
        data: data.data.records || [],
        total: data.data.totalRow || 0
      };
    } else {
      Message.error(data.msg || "获取截图列表失败");
      return { data: [], total: 0 };
    }
  } catch (error) {
    console.error(error);
    Message.error("获取截图列表失败");
    return {
      data: [],
      total: 0,
    };
  }
};

// 更新截图信息（风险等级和备注）
export const updateScreenshotInfo = async (
  recordData: Partial<Screenshot> & { id: number }
) => {
  try {
    const response = await updateScreenshot({
      id: recordData.id,
      riskLevel: recordData.riskLevel,
      remark: recordData.remark
    });
    
    const { data } = response;
    
    if (data.code === 0 && data.data) {
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

// 删除截图
export const deleteScreenshotById = async (id: number) => {
  try {
    const response = await deleteScreenshot(id);
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

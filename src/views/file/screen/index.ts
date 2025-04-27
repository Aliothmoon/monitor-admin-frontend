import { Message } from "@arco-design/web-vue";
import axios from "axios";
import dayjs from "dayjs";

// 定义录屏数据接口
export interface ScreenRecord {
  id: number;
  examId: number;
  examName: string;
  studentId: number;
  studentName: string;
  startTime: Date;
  endTime: Date;
  duration: number; // 时长，单位：秒
  videoUrl: string;
  fileSize: number; // 单位KB
  riskLevel: number; // 风险等级：0-低风险, 1-中风险, 2-高风险
  remark?: string;
}

// 查询参数
export interface ScreenRecordQueryParams {
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
export const fetchScreenRecordList = (params: ScreenRecordQueryParams) => {
  return axios.post("/file/screen-record/page", params);
};

export const fetchScreenRecordById = (id: number) => {
  return axios.get(`/file/screen-record/${id}`);
};

export const updateScreenRecord = (data: any) => {
  return axios.put("/file/screen-record", data);
};

export const deleteScreenRecord = (id: number) => {
  return axios.delete(`/file/screen-record/${id}`);
};

// 获取录屏列表
export const getScreenRecordList = async (
  current = 1,
  pageSize = 10,
  keyword = "",
  riskLevel?: number,
  startDate?: Date,
  endDate?: Date,
  examId?: number,
  studentId?: number
) => {
  try {
    const params: ScreenRecordQueryParams = {
      pageNum: current,
      pageSize: pageSize,
      keyword: keyword || undefined,
      riskLevel: riskLevel,
      startTime: startDate,
      endTime: endDate,
      examId: examId,
      studentId: studentId
    };

    const response = await fetchScreenRecordList(params);
    const { data } = response;

    if (data.code === 0) {
      return {
        data: data.data.records || [],
        total: data.data.totalRow || 0
      };
    } else {
      Message.error(data.msg || "获取录屏列表失败");
      return { data: [], total: 0 };
    }
  } catch (error) {
    console.error(error);
    Message.error("获取录屏列表失败");
    return {
      data: [],
      total: 0,
    };
  }
};

// 更新录屏备注和风险等级
export const updateScreenRecordInfo = async (
  recordData: Partial<ScreenRecord> & { id: number }
) => {
  try {
    const response = await updateScreenRecord({
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

// 删除录屏
export const deleteScreenRecordById = async (id: number) => {
  try {
    const response = await deleteScreenRecord(id);
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

import axios from 'axios';
import { TableDataInfo } from './types';

/**
 * 操作日志接口类型
 */
export interface OperationLog {
  logId?: number;
  userId?: number;
  username?: string;
  operation?: string;
  method?: string;
  params?: string;
  path?: string;
  ip?: string;
  browser?: string;
  os?: string;
  status?: number;
  errorMsg?: string;
  operationTime?: string;
  duration?: number;
}

/**
 * 获取操作日志分页数据
 * @param pageNum 页码
 * @param pageSize 每页大小
 * @param username 用户名（可选）
 * @param operation 操作类型（可选）
 * @param path 请求路径（可选）
 * @param ip IP地址（可选）
 * @param startTime 开始时间（可选）
 * @param endTime 结束时间（可选）
 * @returns 操作日志分页数据
 */
export function getOperationLogPageData(
  pageNum: number,
  pageSize: number,
  username?: string,
  operation?: string,
  path?: string,
  ip?: string,
  startTime?: string,
  endTime?: string
): Promise<TableDataInfo<OperationLog>> {
  return axios.get('/system/operationLog/getOperationLogPageData', {
    params: {
      pageNum,
      pageSize,
      username,
      operation,
      path,
      ip,
      startTime,
      endTime
    }
  }).then(res => res.data.data);
}

/**
 * 清空指定天数之前的日志
 * @param days 天数
 * @returns 操作结果
 */
export function cleanLogBeforeDays(days: number): Promise<boolean> {
  return axios.delete(`/system/operationLog/cleanLogBeforeDays/${days}`).then(res => res.data.data);
}

/**
 * 记录操作日志
 * @param data 操作日志
 * @returns 操作结果
 */
export function recordLog(data: OperationLog): Promise<boolean> {
  return axios.post('/system/operationLog/recordLog', data).then(res => res.data.data);
} 
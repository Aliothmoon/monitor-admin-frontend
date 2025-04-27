import axios from 'axios';
import { TableDataInfo } from './types';

/**
 * 考生信息接口类型
 */
export interface ExamineeInfo {
  examineeInfoId?: number;
  studentId?: string;
  name?: string;
  gender?: number;
  college?: string;
  className?: string;
  major?: string;
  email?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

/**
 * 获取考生信息分页数据
 * @param pageNum 页码
 * @param pageSize 每页大小
 * @param name 姓名（可选）
 * @param studentId 学号（可选）
 * @param college 学院（可选）
 * @param className 班级（可选）
 * @returns 考生信息分页数据
 */
export function getExamineeInfoPageData(
  pageNum: number,
  pageSize: number,
  name?: string,
  studentId?: string,
  college?: string,
  className?: string
): Promise<TableDataInfo<ExamineeInfo>> {
  return axios.get('/examinee/info/getExamineeInfoPageData', {
    params: {
      pageNum,
      pageSize,
      name,
      studentId,
      college,
      className
    }
  }).then(res => res.data);
}

/**
 * 保存考生信息
 * @param data 考生信息
 * @returns 保存结果
 */
export function saveExamineeInfo(data: ExamineeInfo): Promise<boolean> {
  return axios.post('/examinee/info/saveExamineeInfo', data).then(res => res.data.data);
}

/**
 * 更新考生信息
 * @param data 考生信息
 * @returns 更新结果
 */
export function updateExamineeInfo(data: ExamineeInfo): Promise<boolean> {
  return axios.put('/examinee/info/updateExamineeInfo', data).then(res => res.data.data);
}

/**
 * 删除考生信息
 * @param examineeInfoId 考生信息ID
 * @returns 删除结果
 */
export function removeExamineeInfo(examineeInfoId: number): Promise<boolean> {
  return axios.delete(`/examinee/info/removeExamineeInfo/${examineeInfoId}`).then(res => res.data.data);
}

/**
 * 根据ID获取考生信息
 * @param examineeInfoId 考生信息ID
 * @returns 考生信息
 */
export function getExamineeInfo(examineeInfoId: number): Promise<ExamineeInfo> {
  return axios.get(`/examinee/info/getExamineeInfo/${examineeInfoId}`).then(res => res.data.data);
} 
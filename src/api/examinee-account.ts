import axios from 'axios';
import { TableDataInfo } from './types';

/**
 * 考生账号接口类型
 */
export interface ExamineeAccount {
  accountId?: number;
  examineeInfoId?: number;
  examId?: number;
  account?: string;
  password?: string;
  status?: number;
  lastLoginTime?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

/**
 * 考生账号与考生信息关联的综合数据接口类型
 */
export interface ExamineeAccountWithInfo extends ExamineeAccount {
  // 考生信息字段
  studentId?: string;
  name?: string;
  gender?: number;
  college?: string;
  className?: string;
  major?: string;
  email?: string;
  phone?: string;
}

/**
 * 获取考生账号分页数据
 * @param pageNum 页码
 * @param pageSize 每页大小
 * @param account 账号（可选）
 * @param examId 考试ID（可选）
 * @param examineeInfoId 考生信息ID（可选）
 * @returns 考生账号分页数据
 */
export function getExamineeAccountPageData(
  pageNum: number,
  pageSize: number,
  account?: string,
  examId?: number,
  examineeInfoId?: number
): Promise<TableDataInfo<ExamineeAccount>> {
  return axios.get('/examinee/account/getExamineeAccountPageData', {
    params: {
      pageNum,
      pageSize,
      account,
      examId,
      examineeInfoId
    }
  }).then(res => res.data);
}

/**
 * 获取考生账号与考生信息关联的综合数据分页列表
 * @param pageNum 页码
 * @param pageSize 每页大小
 * @param account 账号（可选）
 * @param examId 考试ID（可选）
 * @param name 考生姓名（可选）
 * @param studentId 学号（可选）
 * @param college 学院（可选）
 * @param className 班级（可选）
 * @returns 考生账号与考生信息的综合数据分页信息
 */
export function getAllExamineeAccountsWithInfo(
  pageNum: number,
  pageSize: number,
  account?: string,
  examId?: number,
  name?: string,
  studentId?: string,
  college?: string,
  className?: string
): Promise<TableDataInfo<ExamineeAccountWithInfo>> {
  return axios.get('/examinee/account/getAllAccountsWithInfo', {
    params: {
      pageNum,
      pageSize,
      account,
      examId,
      name,
      studentId,
      college,
      className
    }
  }).then(res => res.data);
}

/**
 * 保存考生账号
 * @param data 考生账号
 * @returns 保存结果
 */
export function saveExamineeAccount(data: ExamineeAccount): Promise<boolean> {
  return axios.post('/examinee/account/saveExamineeAccount', data).then(res => res.data.data);
}

/**
 * 更新考生账号
 * @param data 考生账号
 * @returns 更新结果
 */
export function updateExamineeAccount(data: ExamineeAccount): Promise<boolean> {
  return axios.put('/examinee/account/updateExamineeAccount', data).then(res => res.data.data);
}

/**
 * 删除考生账号
 * @param accountId 考生账号ID
 * @returns 删除结果
 */
export function removeExamineeAccount(accountId: number): Promise<boolean> {
  return axios.delete(`/examinee/account/removeExamineeAccount/${accountId}`).then(res => res.data.data);
}

/**
 * 根据ID获取考生账号
 * @param accountId 考生账号ID
 * @returns 考生账号
 */
export function getExamineeAccount(accountId: number): Promise<ExamineeAccount> {
  return axios.get(`/examinee/account/getExamineeAccount/${accountId}`).then(res => res.data.data);
}

/**
 * 根据考生信息ID获取所有账号
 * @param examineeInfoId 考生信息ID
 * @returns 账号列表
 */
export function getAccountsByExamineeInfoId(examineeInfoId: number): Promise<ExamineeAccount[]> {
  return axios.get(`/examinee/account/getByExamineeInfoId/${examineeInfoId}`).then(res => res.data.data);
}

/**
 * 根据考试ID获取所有账号
 * @param examId 考试ID
 * @returns 账号列表
 */
export function getAccountsByExamId(examId: number): Promise<ExamineeAccount[]> {
  return axios.get(`/examinee/account/getByExamId/${examId}`).then(res => res.data.data);
} 
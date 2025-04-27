import axios from 'axios';

export interface SuspiciousProcessVO {
  id?: number;
  processName: string;
  description: string;
  riskLevel: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SuspiciousProcessQueryParams {
  processName?: string;
  riskLevel?: number;
  pageNum: number;
  pageSize: number;
}

/**
 * 分页查询可疑进程名单
 * @param params 查询参数
 * @returns 分页结果
 */
export function getSuspiciousProcessList(params: SuspiciousProcessQueryParams) {
  return axios.post('/exam/suspicious-process/page', params);
}

/**
 * 根据ID获取可疑进程详情
 * @param id 进程ID
 * @returns 进程详情
 */
export function getSuspiciousProcessById(id: number) {
  return axios.get(`/exam/suspicious-process/${id}`);
}

/**
 * 根据风险等级获取可疑进程列表
 * @param riskLevel 风险等级
 * @returns 进程列表
 */
export function getSuspiciousProcessByRiskLevel(riskLevel: number) {
  return axios.get(`/exam/suspicious-process/list/risk-level/${riskLevel}`);
}

/**
 * 添加可疑进程
 * @param data 进程信息
 * @returns 添加结果
 */
export function addSuspiciousProcess(data: SuspiciousProcessVO) {
  return axios.post('/exam/suspicious-process', data);
}

/**
 * 更新可疑进程
 * @param data 进程信息
 * @returns 更新结果
 */
export function updateSuspiciousProcess(data: SuspiciousProcessVO) {
  return axios.put('/exam/suspicious-process', data);
}

/**
 * 删除可疑进程
 * @param id 进程ID
 * @returns 删除结果
 */
export function deleteSuspiciousProcess(id: number) {
  return axios.delete(`/exam/suspicious-process/${id}`);
}

export function getProcessByRiskLevel(level: string) {
  return axios.get(`/exam/suspicious-process/list/risk-level/${level}`);
}

// 域名黑名单相关接口类型
export interface DomainBlacklistVO {
  id?: number;
  domain?: string;
  description?: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DomainBlacklistQueryParams {
  domain?: string;
  category?: string;
  pageNum: number;
  pageSize: number;
}

/**
 * 分页查询域名黑名单
 * @param params 查询参数
 * @returns 分页结果
 */
export function pageDomainBlacklist(params: DomainBlacklistQueryParams) {
  return axios.post('/exam/domain-blacklist/page', params);
}

/**
 * 根据ID获取域名黑名单详情
 * @param id 域名ID
 * @returns 域名详情
 */
export function getDomainBlacklistById(id: number) {
  return axios.get(`/exam/domain-blacklist/${id}`);
}

/**
 * 根据分类获取域名黑名单列表
 * @param category 分类
 * @returns 域名列表
 */
export function getDomainBlacklistByCategory(category: string) {
  return axios.get(`/exam/domain-blacklist/list/category/${category}`);
}

/**
 * 添加域名黑名单
 * @param data 域名信息
 * @returns 添加结果
 */
export function addDomainBlacklist(data: DomainBlacklistVO) {
  return axios.post('/exam/domain-blacklist', data);
}

/**
 * 更新域名黑名单
 * @param data 域名信息
 * @returns 更新结果
 */
export function updateDomainBlacklist(data: DomainBlacklistVO & { id: number }) {
  return axios.put('/exam/domain-blacklist', data);
}

/**
 * 删除域名黑名单
 * @param id 域名ID
 * @returns 删除结果
 */
export function deleteDomainBlacklist(id: number) {
  return axios.delete(`/exam/domain-blacklist/${id}`);
}

// 风险图片模板相关接口类型
export interface RiskImageTemplateVO {
  id?: number;
  name: string;
  description?: string;
  category: string;
  imageUrl: string;
  similarity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RiskImageTemplateQueryParams {
  keyword?: string;
  category?: string;
  pageNum: number;
  pageSize: number;
}

/**
 * 分页查询风险图片模板
 * @param params 查询参数
 * @returns 分页结果
 */
export function pageRiskImageTemplate(params: RiskImageTemplateQueryParams) {
  return axios.post('/exam/risk-image-template/page', params);
}

/**
 * 根据ID获取风险图片模板详情
 * @param id 模板ID
 * @returns 模板详情
 */
export function getRiskImageTemplateById(id: number) {
  return axios.get(`/exam/risk-image-template/${id}`);
}

/**
 * 根据分类获取风险图片模板列表
 * @param category 分类
 * @returns 模板列表
 */
export function getRiskImageTemplateByCategory(category: string) {
  return axios.get(`/exam/risk-image-template/list/category/${category}`);
}

/**
 * 根据关键词搜索风险图片模板列表
 * @param keyword 关键词
 * @returns 模板列表
 */
export function getRiskImageTemplateByKeyword(keyword: string) {
  return axios.get(`/exam/risk-image-template/list/keyword/${keyword}`);
}

/**
 * 添加风险图片模板
 * @param data 模板信息
 * @returns 添加结果
 */
export function addRiskImageTemplate(data: RiskImageTemplateVO) {
  return axios.post('/exam/risk-image-template', data);
}

/**
 * 更新风险图片模板
 * @param data 模板信息
 * @returns 更新结果
 */
export function updateRiskImageTemplate(data: RiskImageTemplateVO & { id: number }) {
  return axios.put('/exam/risk-image-template', data);
}

/**
 * 删除风险图片模板
 * @param id 模板ID
 * @returns 删除结果
 */
export function deleteRiskImageTemplate(id: number) {
  return axios.delete(`/exam/risk-image-template/${id}`);
}
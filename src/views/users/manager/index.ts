import axios from "axios";

import { MonitorUser } from "@/api/code/models/monitor-user";
import { TableDataInfo } from "@/api/types";

/**
 * 获取监考员分页数据
 * @param pageNum 当前页码
 * @param pageSize 每页数量
 * @param username 用户名（可选筛选条件）
 * @param account 账户（可选筛选条件）
 */
export const getMonitorUserPageData = async (
  pageNum: number,
  pageSize: number,
  username?: string,
  account?: string
): Promise<TableDataInfo<MonitorUser>> => {
  const params: any = {
    pageNum,
    pageSize,
  };

  if (username) {
    params.username = username;
  }

  if (account) {
    params.account = account;
  }

  return (await axios.post<TableDataInfo<MonitorUser>>(
    "/api/monitorUser/getPageData",
    params
  )) as unknown as TableDataInfo<MonitorUser>;
};

/**
 * 保存新监考员
 * @param monitorUser 监考员信息
 */
export const saveMonitorUser = async (
  monitorUser: Partial<MonitorUser>
): Promise<any> => {
  return await axios.post("/api/monitorUser/save", monitorUser);
};

/**
 * 更新监考员信息
 * @param monitorUser 监考员信息
 */
export const updateMonitorUser = async (
  monitorUser: Partial<MonitorUser>
): Promise<any> => {
  return await axios.put("/api/monitorUser/update", monitorUser);
};

/**
 * 删除监考员
 * @param userId 监考员ID
 */
export const removeMonitorUser = async (userId: number): Promise<any> => {
  return await axios.delete(`/api/monitorUser/remove/${userId}`);
};

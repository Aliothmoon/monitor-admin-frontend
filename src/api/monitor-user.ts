import axios from "axios";
import { MonitorUser } from "./code/models/monitor-user";
import { TableDataInfo } from "./types";

/**
 * 获取监考员分页数据
 * @param pageNum 页码
 * @param pageSize 每页大小
 * @param username 用户名（可选）
 * @param account 账号（可选）
 * @returns 监考员分页数据
 */
export async function getMonitorUserPageData(
  pageNum: number,
  pageSize: number,
  username?: string,
  account?: string
): Promise<TableDataInfo<MonitorUser>> {
  return axios
    .get("/monitorUser/getMonitorUserPageData", {
      params: {
        pageNum,
        pageSize,
        username,
        account,
      },
    })
    .then((res) => res.data);
}

/**
 * 保存监考员信息
 * @param data 监考员信息
 * @returns 保存结果
 */
export async function saveMonitorUser(data: MonitorUser): Promise<boolean> {
  return axios
    .post("/monitorUser/saveMonitorUser", data)
    .then((res) => res.data);
}

/**
 * 更新监考员信息
 * @param data 监考员信息
 * @returns 更新结果
 */
export async function updateMonitorUser(data: MonitorUser): Promise<boolean> {
  return axios
    .put("/monitorUser/updateMonitorUser", data)
    .then((res) => res.data);
}

/**
 * 删除监考员信息
 * @param userId 监考员ID
 * @returns 删除结果
 */
export async function removeMonitorUser(userId: number): Promise<boolean> {
  return axios
    .delete(`/monitorUser/removeMonitorUser/${userId}`)
    .then((res) => res.data);
}

import { MonitorUser } from "@/api/code/models/monitor-user";

export interface TableDataInfo<T> {
  code: number;
  /**
   * 总记录数
   * @type {number}
   * @memberof TableDataInfoMonitorUser
   */
  total: number;
  /**
   * 列表数据
   * @type {Array<MonitorUser>}
   * @memberof TableDataInfoMonitorUser
   */
  rows: Array<T>;
  /**
   * 页数
   * @type {number}
   * @memberof TableDataInfoMonitorUser
   */
  pages: number;
}

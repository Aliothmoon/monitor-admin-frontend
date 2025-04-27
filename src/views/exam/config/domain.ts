import { Message } from "@arco-design/web-vue";
import {
  pageDomainBlacklist,
  getDomainBlacklistById,
  getDomainBlacklistByCategory,
  addDomainBlacklist,
  updateDomainBlacklist as updateDomainBlacklistApi,
  deleteDomainBlacklist as deleteDomain,
} from "@/api/exam";

// 定义域名黑名单数据接口
export interface DomainBlacklist {
  id: number;
  domain: string;
  description?: string;
  category: string; // 分类：社交媒体、视频网站、搜索引擎等
  createdAt: string;
  updatedAt: string;
}

// 获取域名黑名单列表
export const getDomainBlacklistList = async (
  current = 1,
  pageSize = 10,
  keyword = "",
  category = ""
) => {
  try {
    const params = {
      pageNum: current,
      pageSize: pageSize,
      domain: keyword, // 使用keyword作为domain搜索
      category: category || undefined,
    };

    const res = await pageDomainBlacklist(params);

    if (res.data.code === 0) {
      return {
        data: res.data.data.records || [],
        total: res.data.data.totalRow || 0,
      };
    } else {
      Message.error(res.data.msg || "获取域名黑名单列表失败");
      return {
        data: [],
        total: 0,
      };
    }
  } catch (error) {
    console.error(error);
    Message.error("获取域名黑名单列表失败");
    return {
      data: [],
      total: 0,
    };
  }
};

// 新增域名黑名单
export const createDomainBlacklist = async (
  domainData: Omit<DomainBlacklist, "id" | "createdAt" | "updatedAt">
) => {
  try {
    const res = await addDomainBlacklist(domainData);

    if (res.data.code === 0) {
      Message.success("新增成功");
      return true;
    } else {
      Message.error("新增失败");
      return false;
    }
  } catch (error) {
    console.error(error);
    Message.error("新增失败");
    return false;
  }
};

// 修改域名黑名单
export const updateDomainBlacklist = async (
  domainData: Partial<DomainBlacklist> & { id: number }
) => {
  try {
    //@ts-ignore
    const res = await updateDomainBlacklistApi(domainData);

    if (res.data.code === 0) {
      Message.success("修改成功");
      return true;
    } else {
      Message.error("修改失败");
      return false;
    }
  } catch (error) {
    console.error(error);
    Message.error("修改失败");
    return false;
  }
};

// 删除域名黑名单
export const deleteDomainBlacklist = async (id: number) => {
  try {
    const res = await deleteDomain(id);

    if (res.data.code === 0) {
      Message.success("删除成功");
      return true;
    } else {
      Message.error("删除失败");
      return false;
    }
  } catch (error) {
    console.error(error);
    Message.error("删除失败");
    return false;
  }
};

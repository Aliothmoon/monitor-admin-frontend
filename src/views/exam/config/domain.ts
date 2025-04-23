import { Message } from "@arco-design/web-vue";

// 定义域名黑名单数据接口
export interface DomainBlacklist {
  id: number;
  domain: string;
  description?: string;
  category: string;  // 分类：社交媒体、视频网站、搜索引擎等
  createdAt: Date;
  updatedAt: Date;
}

// 模拟数据
const mockDomainBlacklist: DomainBlacklist[] = [
  {
    id: 1,
    domain: "*.facebook.com",
    description: "Facebook社交媒体网站",
    category: "社交媒体",
    createdAt: new Date("2023-10-10"),
    updatedAt: new Date("2023-10-10")
  },
  {
    id: 2,
    domain: "*.youtube.com",
    description: "YouTube视频网站",
    category: "视频网站",
    createdAt: new Date("2023-10-12"),
    updatedAt: new Date("2023-10-12")
  },
  {
    id: 3,
    domain: "*.baidu.com",
    description: "百度搜索引擎",
    category: "搜索引擎",
    createdAt: new Date("2023-10-15"),
    updatedAt: new Date("2023-10-20")
  },
  {
    id: 4,
    domain: "*.qq.com",
    description: "腾讯QQ相关网站",
    category: "社交媒体",
    createdAt: new Date("2023-11-01"),
    updatedAt: new Date("2023-11-01")
  },
  {
    id: 5,
    domain: "*.bilibili.com",
    description: "哔哩哔哩视频网站",
    category: "视频网站",
    createdAt: new Date("2023-11-10"),
    updatedAt: new Date("2023-11-10")
  }
];

// 获取域名黑名单列表
export const getDomainBlacklistList = async (
  current = 1,
  pageSize = 10,
  keyword = "",
  category = ""
) => {
  try {
    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 筛选数据
    let filteredData = [...mockDomainBlacklist];

    // 关键词搜索（域名和描述）
    if (keyword) {
      filteredData = filteredData.filter(
        (item) =>
          item.domain.includes(keyword) ||
          (item.description && item.description.includes(keyword))
      );
    }

    // 分类筛选
    if (category) {
      filteredData = filteredData.filter((item) => item.category === category);
    }

    // 模拟分页数据
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    const data = filteredData.slice(start, end);

    return {
      data,
      total: filteredData.length,
    };
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
    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 模拟新增
    const now = new Date();
    const newDomain: DomainBlacklist = {
      id: mockDomainBlacklist.length + 1,
      ...domainData,
      createdAt: now,
      updatedAt: now,
    };
    mockDomainBlacklist.push(newDomain);
    Message.success("新增成功");
    return true;
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
    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 模拟修改
    const index = mockDomainBlacklist.findIndex((item) => item.id === domainData.id);
    if (index !== -1) {
      mockDomainBlacklist[index] = {
        ...mockDomainBlacklist[index],
        ...domainData,
        updatedAt: new Date(),
      } as DomainBlacklist;
      Message.success("修改成功");
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    Message.error("修改失败");
    return false;
  }
};

// 删除域名黑名单
export const deleteDomainBlacklist = async (id: number) => {
  try {
    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 模拟删除
    const index = mockDomainBlacklist.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockDomainBlacklist.splice(index, 1);
      Message.success("删除成功");
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    Message.error("删除失败");
    return false;
  }
}; 
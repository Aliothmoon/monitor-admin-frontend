import { Message } from "@arco-design/web-vue";

// 定义可疑进程数据接口
export interface SuspiciousProcess {
  id: number;
  name: string;
  description?: string;
  processName: string;
  processPath?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 模拟数据
const mockSuspiciousProcesses: SuspiciousProcess[] = [
  {
    id: 1,
    name: "远程控制软件",
    description: "常见的远程控制软件，可能被用于作弊",
    processName: "TeamViewer.exe",
    processPath: "C:\\Program Files\\TeamViewer\\TeamViewer.exe",
    createdAt: new Date("2023-10-15"),
    updatedAt: new Date("2023-10-15")
  },
  {
    id: 2,
    name: "屏幕共享工具",
    description: "可用于分享屏幕给他人",
    processName: "AnyDesk.exe",
    processPath: "C:\\Program Files\\AnyDesk\\AnyDesk.exe",
    createdAt: new Date("2023-10-20"),
    updatedAt: new Date("2023-10-20")
  },
  {
    id: 3,
    name: "虚拟机软件",
    description: "可能用于运行其他操作系统",
    processName: "vmware.exe",
    processPath: "C:\\Program Files\\VMware\\VMware Workstation\\vmware.exe",
    createdAt: new Date("2023-11-05"),
    updatedAt: new Date("2023-11-10")
  },
  {
    id: 4,
    name: "代理软件",
    description: "可能用于绕过网络限制",
    processName: "v2ray.exe",
    processPath: null,
    createdAt: new Date("2023-11-15"),
    updatedAt: new Date("2023-11-15")
  },
  {
    id: 5,
    name: "网络抓包工具",
    description: "可用于分析网络流量",
    processName: "Wireshark.exe",
    processPath: "C:\\Program Files\\Wireshark\\Wireshark.exe",
    createdAt: new Date("2023-12-01"),
    updatedAt: new Date("2023-12-01")
  }
];

// 获取可疑进程列表
export const getSuspiciousProcessList = async (
  current = 1,
  pageSize = 10,
  keyword = ""
) => {
  try {
    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 筛选数据
    let filteredData = [...mockSuspiciousProcesses];

    // 关键词搜索（名称、描述和进程名）
    if (keyword) {
      filteredData = filteredData.filter(
        (item) =>
          item.name.includes(keyword) ||
          (item.description && item.description.includes(keyword)) ||
          item.processName.includes(keyword)
      );
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
    Message.error("获取可疑进程列表失败");
    return {
      data: [],
      total: 0,
    };
  }
};

// 新增可疑进程
export const createSuspiciousProcess = async (
  processData: Omit<SuspiciousProcess, "id" | "createdAt" | "updatedAt">
) => {
  try {
    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 模拟新增
    const now = new Date();
    const newProcess: SuspiciousProcess = {
      id: mockSuspiciousProcesses.length + 1,
      ...processData,
      createdAt: now,
      updatedAt: now,
    };
    mockSuspiciousProcesses.push(newProcess);
    Message.success("新增成功");
    return true;
  } catch (error) {
    console.error(error);
    Message.error("新增失败");
    return false;
  }
};

// 修改可疑进程
export const updateSuspiciousProcess = async (
  processData: Partial<SuspiciousProcess> & { id: number }
) => {
  try {
    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 模拟修改
    const index = mockSuspiciousProcesses.findIndex((item) => item.id === processData.id);
    if (index !== -1) {
      mockSuspiciousProcesses[index] = {
        ...mockSuspiciousProcesses[index],
        ...processData,
        updatedAt: new Date(),
      } as SuspiciousProcess;
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

// 删除可疑进程
export const deleteSuspiciousProcess = async (id: number) => {
  try {
    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 模拟删除
    const index = mockSuspiciousProcesses.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockSuspiciousProcesses.splice(index, 1);
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
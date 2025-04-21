// 考生类型定义
export interface Candidate {
  id: number;
  name: string;
  examId: string;
  status: "online" | "offline" | "warning" | "danger";
  screenshot: string;
  streamUrl: string;
  lastActivity: string;
  riskLevel: "none" | "low" | "medium" | "high";
  riskDescription?: string;
}

// 模拟考生数据
const mockCandidates: Candidate[] = Array.from({ length: 18 }, (_, index) => {
  return {
    id: index + 1,
    name: `考生${index + 1}`,
    examId: `EXAM-${2023001 + index}`,
    status: ["online", "online", "online", "offline", "warning", "danger"][
      Math.floor(Math.random() * 6)
    ] as "online" | "offline" | "warning" | "danger",
    screenshot: `https://picsum.photos/400/300?random=${index}`,
    streamUrl: "https://example.com/stream",
    lastActivity: new Date().toLocaleTimeString(),
    riskLevel: ["none", "none", "low", "medium", "high"][
      Math.floor(Math.random() * 5)
    ] as "none" | "low" | "medium" | "high",
    riskDescription: ["", "", "疑似查看手机", "与他人交谈", "离开考位"][
      Math.floor(Math.random() * 5)
    ],
  };
});

// 获取考生监控数据
export const getCandidateList = async (
  current = 1,
  pageSize = 10,
  keyword = ""
) => {
  try {
    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 筛选数据
    let filteredData = [
      ...mockCandidates,
      ...mockCandidates,
      ...mockCandidates,
      ...mockCandidates,
    ];

    // 关键词搜索（姓名和考号）
    if (keyword) {
      filteredData = filteredData.filter(
        (item) => item.name.includes(keyword) || item.examId.includes(keyword)
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
    return {
      data: [],
      total: 0,
    };
  }
};

// 获取状态颜色
export const getStatusColor = (status: Candidate["status"]) => {
  const statusMap = {
    online: "green",
    offline: "gray",
    warning: "orange",
    danger: "red",
  };
  return statusMap[status];
};

// 获取状态文本
export const getStatusText = (status: Candidate["status"]) => {
  const statusMap = {
    online: "在线",
    offline: "离线",
    warning: "异常",
    danger: "风险",
  };
  return statusMap[status];
};

// 获取风险级别颜色
export const getRiskLevelColor = (level: Candidate["riskLevel"]) => {
  const levelMap = {
    none: "",
    low: "blue",
    medium: "orange",
    high: "red",
  };
  return levelMap[level];
};

// 获取风险级别文本
export const getRiskLevelText = (level: Candidate["riskLevel"]) => {
  const levelMap = {
    none: "无风险",
    low: "低风险",
    medium: "中风险",
    high: "高风险",
  };
  return levelMap[level];
};

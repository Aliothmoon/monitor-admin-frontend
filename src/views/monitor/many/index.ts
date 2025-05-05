import axios from 'axios';

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
  accountId?: number; // 考生账号ID
  studentId?: string; // 学号
}

// 模拟考生数据
const mockCandidates: Candidate[] = Array.from({ length: 18 }, (_, index) => {
  return {
    id: index + 1,
    name: `考生${index + 1}`,
    examId: `EXAM-${2023001 + index}`,
    status: "danger" as "online" | "offline" | "warning" | "danger",
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

// 从考试ID获取考生监控数据
export const getExamCandidateList = async (
  examId: number,
  current = 1,
  pageSize = 24,
  keyword = ""
) => {
  try {
    // 先获取考试的考生列表
    const response = await axios.get('/exam/examinees', {
      params: {
        examId,
        pageNum: current,
        pageSize,
        name: keyword || undefined,
        studentId: keyword || undefined,
      }
    });

    if (response.data.code === 0) {
      const examinees = response.data.data.records || [];
      const total = response.data.data.totalRow || 0;

      // 将考生信息转换为监控数据格式
      const monitorData = examinees.map((examinee: any) => ({
        id: examinee.examineeInfoId,
        accountId: examinee.accountId || examinee.id,
        name: examinee.name || '未知姓名',
        examId: examinee.studentId || '未知学号',
        studentId: examinee.studentId,
        status: examinee.status === 1 ? "online" : "offline",
        screenshot: "", // 先初始化为空，稍后获取最新截图
        streamUrl: "https://example.com/stream",
        lastActivity: new Date().toLocaleTimeString(),
        riskLevel: "none",
        riskDescription: "",
      }));

      // 为每个考生获取最新截图
      const screenshotPromises = monitorData.map(async (candidate) => {
        try {
          const screenshotResponse = await axios.get("/monitor/data/latest-screenshot", {
            params: {
              accountId: candidate.accountId,
              examId: examId,
            },
          });

          if (screenshotResponse.data.code === 0 && screenshotResponse.data.data) {
            candidate.screenshot = screenshotResponse.data.data.url;
            // 如果有风险警告，更新风险状态
            if (screenshotResponse.data.data.hasWarning) {
              candidate.riskLevel = "medium";
              candidate.riskDescription = screenshotResponse.data.data.analysis || "屏幕异常";
              candidate.status = "warning";
            }
          }
        } catch (error) {
          console.error(`获取考生${candidate.name}的截图失败:`, error);
        }
        return candidate;
      });

      // 等待所有截图请求完成
      await Promise.all(screenshotPromises);

      return {
        data: monitorData,
        total,
      };
    }

    return {
      data: [],
      total: 0,
    };
  } catch (error) {
    console.error("获取考试考生数据失败:", error);
    return {
      data: [],
      total: 0,
    };
  }
};

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

import { Message } from "@arco-design/web-vue";

// 定义截图数据接口
export interface Screenshot {
  id: number;
  examId: number;
  examName: string;
  studentId: number;
  studentName: string;
  captureTime: Date;
  imageUrl: string;
  riskLevel: number; // 风险等级：0-低风险, 1-中风险, 2-高风险
  remark?: string;
}

// 模拟数据
const mockScreenshots: Screenshot[] = [
  {
    id: 1,
    examId: 3,
    examName: "数据库设计与优化",
    studentId: 1001,
    studentName: "张三",
    captureTime: new Date("2024-01-10 10:15:30"),
    imageUrl: "https://picsum.photos/seed/screenshot1/800/600",
    riskLevel: 2,
    remark: "发现使用搜索引擎搜索答案"
  },
  {
    id: 2,
    examId: 3,
    examName: "数据库设计与优化",
    studentId: 1002,
    studentName: "李四",
    captureTime: new Date("2024-01-10 10:20:45"),
    imageUrl: "https://picsum.photos/seed/screenshot2/800/600",
    riskLevel: 1,
    remark: "可能在查看参考资料"
  },
  {
    id: 3,
    examId: 3,
    examName: "数据库设计与优化",
    studentId: 1003,
    studentName: "王五",
    captureTime: new Date("2024-01-10 10:30:20"),
    imageUrl: "https://picsum.photos/seed/screenshot3/800/600",
    riskLevel: 0,
    remark: "正常"
  },
  {
    id: 4,
    examId: 2,
    examName: "前端开发技能评估",
    studentId: 1001,
    studentName: "张三",
    captureTime: new Date("2023-12-15 14:25:12"),
    imageUrl: "https://picsum.photos/seed/screenshot4/800/600",
    riskLevel: 2,
    remark: "使用ChatGPT生成答案"
  },
  {
    id: 5,
    examId: 2,
    examName: "前端开发技能评估",
    studentId: 1004,
    studentName: "赵六",
    captureTime: new Date("2023-12-15 14:40:37"),
    imageUrl: "https://picsum.photos/seed/screenshot5/800/600",
    riskLevel: 0,
    remark: "正常"
  }
];

// 获取截图列表
export const getScreenshotList = async (
  current = 1,
  pageSize = 10,
  examId?: number,
  studentId?: number,
  keyword = "",
  riskLevel?: number,
  startDate?: Date,
  endDate?: Date
) => {
  try {
    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 筛选数据
    let filteredData = [...mockScreenshots];

    // 按考试ID筛选
    if (examId !== undefined) {
      filteredData = filteredData.filter((item) => item.examId === examId);
    }

    // 按学生ID筛选
    if (studentId !== undefined) {
      filteredData = filteredData.filter((item) => item.studentId === studentId);
    }

    // 关键词搜索（考试名称、学生姓名、备注）
    if (keyword) {
      filteredData = filteredData.filter(
        (item) =>
          item.examName.includes(keyword) ||
          item.studentName.includes(keyword) ||
          (item.remark && item.remark.includes(keyword))
      );
    }

    // 按风险等级筛选
    if (riskLevel !== undefined) {
      filteredData = filteredData.filter((item) => item.riskLevel === riskLevel);
    }

    // 按时间范围筛选
    if (startDate) {
      filteredData = filteredData.filter(
        (item) => new Date(item.captureTime) >= new Date(startDate)
      );
    }

    if (endDate) {
      filteredData = filteredData.filter(
        (item) => new Date(item.captureTime) <= new Date(endDate)
      );
    }

    // 按捕获时间倒序排序
    filteredData.sort((a, b) => {
      return new Date(b.captureTime).getTime() - new Date(a.captureTime).getTime();
    });

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
    Message.error("获取截图列表失败");
    return {
      data: [],
      total: 0,
    };
  }
};

// 更新截图备注和风险等级
export const updateScreenshot = async (
  screenshotData: Partial<Screenshot> & { id: number }
) => {
  try {
    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 模拟修改
    const index = mockScreenshots.findIndex((item) => item.id === screenshotData.id);
    if (index !== -1) {
      mockScreenshots[index] = {
        ...mockScreenshots[index],
        ...screenshotData,
      };
      Message.success("更新成功");
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    Message.error("更新失败");
    return false;
  }
};

// 删除截图
export const deleteScreenshot = async (id: number) => {
  try {
    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 模拟删除
    const index = mockScreenshots.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockScreenshots.splice(index, 1);
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
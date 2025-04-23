import { Message } from "@arco-design/web-vue";

// 定义录屏数据接口
export interface ScreenRecord {
  id: number;
  examId: number;
  examName: string;
  studentId: number;
  studentName: string;
  startTime: Date;
  endTime: Date;
  duration: number; // 时长，单位：秒
  videoUrl: string;
  fileSize: number; // 单位KB
  riskLevel: number; // 风险等级：0-低风险, 1-中风险, 2-高风险
  remark?: string;
}

// 模拟数据
const mockScreenRecords: ScreenRecord[] = [
  {
    id: 1,
    examId: 3,
    examName: "数据库设计与优化",
    studentId: 1001,
    studentName: "张三",
    startTime: new Date("2024-01-10 10:00:00"),
    endTime: new Date("2024-01-10 10:30:00"),
    duration: 1800,
    videoUrl: "https://example.com/videos/record_1.mp4",
    fileSize: 25600,
    riskLevel: 2,
    remark: "多次切换窗口，疑似查看参考资料"
  },
  {
    id: 2,
    examId: 3,
    examName: "数据库设计与优化",
    studentId: 1002,
    studentName: "李四",
    startTime: new Date("2024-01-10 10:00:00"),
    endTime: new Date("2024-01-10 10:30:00"),
    duration: 1800,
    videoUrl: "https://example.com/videos/record_2.mp4",
    fileSize: 24800,
    riskLevel: 0,
    remark: "考试期间表现正常"
  },
  {
    id: 3,
    examId: 3,
    examName: "数据库设计与优化",
    studentId: 1003,
    studentName: "王五",
    startTime: new Date("2024-01-10 10:00:00"),
    endTime: new Date("2024-01-10 10:30:00"),
    duration: 1800,
    videoUrl: "https://example.com/videos/record_3.mp4",
    fileSize: 26200,
    riskLevel: 1,
    remark: "偶尔低头，可能在查看纸质资料"
  },
  {
    id: 4,
    examId: 2,
    examName: "前端开发技能评估",
    studentId: 1004,
    studentName: "赵六",
    startTime: new Date("2023-12-15 14:00:00"),
    endTime: new Date("2023-12-15 16:00:00"),
    duration: 7200,
    videoUrl: "https://example.com/videos/record_4.mp4",
    fileSize: 102400,
    riskLevel: 0,
    remark: "考试期间表现正常"
  },
  {
    id: 5,
    examId: 2,
    examName: "前端开发技能评估",
    studentId: 1001,
    studentName: "张三",
    startTime: new Date("2023-12-15 14:00:00"),
    endTime: new Date("2023-12-15 16:00:00"),
    duration: 7200,
    videoUrl: "https://example.com/videos/record_5.mp4",
    fileSize: 98560,
    riskLevel: 2,
    remark: "发现使用第二台电脑搜索答案"
  }
];

// 获取录屏列表
export const getScreenRecordList = async (
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
    let filteredData = [...mockScreenRecords];

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
        (item) => new Date(item.startTime) >= new Date(startDate)
      );
    }

    if (endDate) {
      filteredData = filteredData.filter(
        (item) => new Date(item.endTime) <= new Date(endDate)
      );
    }

    // 按开始时间倒序排序
    filteredData.sort((a, b) => {
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
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
    Message.error("获取录屏列表失败");
    return {
      data: [],
      total: 0,
    };
  }
};

// 更新录屏备注和风险等级
export const updateScreenRecord = async (
  recordData: Partial<ScreenRecord> & { id: number }
) => {
  try {
    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 模拟修改
    const index = mockScreenRecords.findIndex((item) => item.id === recordData.id);
    if (index !== -1) {
      mockScreenRecords[index] = {
        ...mockScreenRecords[index],
        ...recordData,
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

// 删除录屏
export const deleteScreenRecord = async (id: number) => {
  try {
    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 模拟删除
    const index = mockScreenRecords.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockScreenRecords.splice(index, 1);
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
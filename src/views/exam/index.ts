import { Message } from "@arco-design/web-vue";

// 定义考试数据接口
export interface Exam {
  id: number;
  name: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  status: number; // 0: 未开始, 1: 进行中, 2: 已结束
}

// 模拟数据
const mockExams: Exam[] = [
  {
    id: 1,
    name: "2023年度Java开发工程师考试",
    description: "测试Java基础知识和框架应用能力",
    startTime: new Date("2023-12-01 09:00:00"),
    endTime: new Date("2023-12-01 11:00:00"),
    duration: 120,
    status: 2,
  },
  {
    id: 2,
    name: "前端开发技能评估",
    description: "HTML, CSS, JavaScript和主流框架考核",
    startTime: new Date("2023-12-15 14:00:00"),
    endTime: new Date("2023-12-15 16:00:00"),
    duration: 120,
    status: 2,
  },
  {
    id: 3,
    name: "数据库设计与优化",
    description: "关系型数据库设计原则和性能优化",
    startTime: new Date("2024-01-10 10:00:00"),
    endTime: new Date("2024-01-10 12:00:00"),
    duration: 120,
    status: 1,
  },
  {
    id: 4,
    name: "软件工程方法论",
    description: "软件开发生命周期和项目管理",
    startTime: new Date("2024-02-01 09:00:00"),
    endTime: new Date("2024-02-01 11:30:00"),
    duration: 150,
    status: 0,
  },
  {
    id: 5,
    name: "网络安全基础知识",
    description: "网络协议和常见安全威胁防范",
    startTime: new Date("2024-02-15 13:00:00"),
    endTime: new Date("2024-02-15 15:00:00"),
    duration: 120,
    status: 0,
  },
];

// 获取考试列表
export const getExamList = async (
  current = 1, 
  pageSize = 10, 
  keyword = "", 
  status?: number,
  startDate?: Date,
  endDate?: Date
) => {
  try {
    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 筛选数据
    let filteredData = [...mockExams];
    
    // 关键词搜索（名称和描述）
    if (keyword) {
      filteredData = filteredData.filter(item => 
        item.name.includes(keyword) || 
        (item.description && item.description.includes(keyword))
      );
    }
    
    // 状态筛选
    if (status !== undefined) {
      filteredData = filteredData.filter(item => item.status === status);
    }
    
    // 时间范围筛选
    if (startDate) {
      filteredData = filteredData.filter(item => new Date(item.startTime) >= new Date(startDate));
    }
    
    if (endDate) {
      filteredData = filteredData.filter(item => new Date(item.endTime) <= new Date(endDate));
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
    Message.error("获取考试列表失败");
    return {
      data: [],
      total: 0,
    };
  }
};

// 新增考试
export const createExam = async (examData: Omit<Exam, "id" | "status">) => {
  try {
    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 模拟新增
    const newExam: Exam = {
      id: mockExams.length + 1,
      ...examData,
      status: 0,
    };
    mockExams.push(newExam);
    Message.success("新增成功");
    return true;
  } catch (error) {
    console.error(error);
    Message.error("新增失败");
    return false;
  }
};

// 修改考试
export const updateExam = async (examData: Partial<Exam> & { id: number }) => {
  try {
    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 模拟修改
    const index = mockExams.findIndex((item) => item.id === examData.id);
    if (index !== -1) {
      mockExams[index] = { ...mockExams[index], ...examData } as Exam;
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

// 删除考试
export const deleteExam = async (id: number) => {
  try {
    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 模拟删除
    const index = mockExams.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockExams.splice(index, 1);
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
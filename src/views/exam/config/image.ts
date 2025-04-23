import { Message } from "@arco-design/web-vue";

// 定义风险图片模板数据接口
export interface RiskImageTemplate {
  id: number;
  name: string;
  description?: string;
  category: string; // 分类：答案、小抄、公式等
  imageUrl: string;
  similarity: number; // 相似度阈值，0-100
  createdAt: Date;
  updatedAt: Date;
}

// 模拟数据
const mockRiskImageTemplates: RiskImageTemplate[] = [
  {
    id: 1,
    name: "数学公式模板",
    description: "常见数学公式的参考模板",
    category: "公式",
    imageUrl: "https://picsum.photos/seed/math123/500/300",
    similarity: 85,
    createdAt: new Date("2023-09-15"),
    updatedAt: new Date("2023-09-15"),
  },
  {
    id: 2,
    name: "物理公式模板",
    description: "常见物理公式的参考模板",
    category: "公式",
    imageUrl: "https://picsum.photos/seed/physics456/500/300",
    similarity: 90,
    createdAt: new Date("2023-09-20"),
    updatedAt: new Date("2023-09-20"),
  },
  {
    id: 3,
    name: "英语翻译模板",
    description: "英语翻译的参考答案模板",
    category: "答案",
    imageUrl: "https://picsum.photos/seed/english789/500/300",
    similarity: 75,
    createdAt: new Date("2023-10-05"),
    updatedAt: new Date("2023-10-10"),
  },
  {
    id: 4,
    name: "化学元素周期表",
    description: "化学元素周期表模板",
    category: "参考表",
    imageUrl: "https://picsum.photos/seed/chemistry101/500/300",
    similarity: 95,
    createdAt: new Date("2023-10-15"),
    updatedAt: new Date("2023-10-15"),
  },
  {
    id: 5,
    name: "计算机算法模板",
    description: "常见算法的伪代码参考模板",
    category: "小抄",
    imageUrl: "https://picsum.photos/seed/algorithm202/500/300",
    similarity: 80,
    createdAt: new Date("2023-11-01"),
    updatedAt: new Date("2023-11-01"),
  },
];

// 获取风险图片模板列表
export const getRiskImageTemplateList = async (
  current = 1,
  pageSize = 10,
  keyword = "",
  category = ""
) => {
  try {
    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 筛选数据
    let filteredData = [...mockRiskImageTemplates];

    // 关键词搜索（名称和描述）
    if (keyword) {
      filteredData = filteredData.filter(
        (item) =>
          item.name.includes(keyword) ||
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
    Message.error("获取风险图片模板列表失败");
    return {
      data: [],
      total: 0,
    };
  }
};

// 新增风险图片模板
export const createRiskImageTemplate = async (
  templateData: Omit<RiskImageTemplate, "id" | "createdAt" | "updatedAt">
) => {
  try {
    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 模拟新增
    const now = new Date();
    const newTemplate: RiskImageTemplate = {
      id: mockRiskImageTemplates.length + 1,
      ...templateData,
      createdAt: now,
      updatedAt: now,
    };
    mockRiskImageTemplates.push(newTemplate);
    Message.success("新增成功");
    return true;
  } catch (error) {
    console.error(error);
    Message.error("新增失败");
    return false;
  }
};

// 修改风险图片模板
export const updateRiskImageTemplate = async (
  templateData: Partial<RiskImageTemplate> & { id: number }
) => {
  try {
    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 模拟修改
    const index = mockRiskImageTemplates.findIndex(
      (item) => item.id === templateData.id
    );
    if (index !== -1) {
      mockRiskImageTemplates[index] = {
        ...mockRiskImageTemplates[index],
        ...templateData,
        updatedAt: new Date(),
      } as RiskImageTemplate;
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

// 删除风险图片模板
export const deleteRiskImageTemplate = async (id: number) => {
  try {
    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 模拟删除
    const index = mockRiskImageTemplates.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockRiskImageTemplates.splice(index, 1);
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

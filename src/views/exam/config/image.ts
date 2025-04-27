import { Message } from "@arco-design/web-vue";
import {
  pageRiskImageTemplate,
  getRiskImageTemplateById,
  getRiskImageTemplateByCategory,
  getRiskImageTemplateByKeyword,
  addRiskImageTemplate,
  updateRiskImageTemplate as updateRiskImageTemplateApi,
  deleteRiskImageTemplate as deleteRiskImageApi,
  RiskImageTemplateVO
} from "@/api/exam-config";

// 定义风险图片模板数据接口
export interface RiskImageTemplate {
  id: number;
  name: string;
  description?: string;
  category: string; // 分类：答案、小抄、公式等
  imageUrl: string;
  similarity: number; // 相似度阈值，0-100
  createdAt: string;
  updatedAt: string;
}

// 获取风险图片模板列表
export const getRiskImageTemplateList = async (
  current = 1,
  pageSize = 10,
  keyword = "",
  category = ""
) => {
  try {
    const params = {
      pageNum: current,
      pageSize: pageSize,
      keyword: keyword || undefined,
      category: category || undefined
    };

    const res = await pageRiskImageTemplate(params);
    
    if (res.data.code === 0) {
      return {
        data: res.data.data.records || [],
        total: res.data.data.totalRow || 0
      };
    } else {
      Message.error(res.data.msg || "获取风险图片模板列表失败");
      return {
        data: [],
        total: 0
      };
    }
  } catch (error) {
    console.error(error);
    Message.error("获取风险图片模板列表失败");
    return {
      data: [],
      total: 0
    };
  }
};

// 新增风险图片模板
export const createRiskImageTemplate = async (
  templateData: Omit<RiskImageTemplate, "id" | "createdAt" | "updatedAt">
) => {
  try {
    const res = await addRiskImageTemplate(templateData);

    if (res.data.code === 0) {
      Message.success("新增成功");
      return true;
    } else {
      Message.error(res.data.msg || "新增失败");
      return false;
    }
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
    // 确保必填字段存在
    if (!templateData.name || !templateData.category || !templateData.imageUrl || templateData.similarity === undefined) {
      Message.error("修改失败：缺少必要的字段");
      return false;
    }
    
    const templateToUpdate: RiskImageTemplateVO & { id: number } = {
      id: templateData.id,
      name: templateData.name,
      description: templateData.description,
      category: templateData.category,
      imageUrl: templateData.imageUrl,
      similarity: templateData.similarity
    };
    
    const res = await updateRiskImageTemplateApi(templateToUpdate);

    if (res.data.code === 0) {
      Message.success("修改成功");
      return true;
    } else {
      Message.error(res.data.msg || "修改失败");
      return false;
    }
  } catch (error) {
    console.error(error);
    Message.error("修改失败");
    return false;
  }
};

// 删除风险图片模板
export const deleteRiskImageTemplate = async (id: number) => {
  try {
    const res = await deleteRiskImageApi(id);

    if (res.data.code === 0) {
      Message.success("删除成功");
      return true;
    } else {
      Message.error(res.data.msg || "删除失败");
      return false;
    }
  } catch (error) {
    console.error(error);
    Message.error("删除失败");
    return false;
  }
};

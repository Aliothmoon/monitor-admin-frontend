import type { DescData } from "@arco-design/web-vue/es/descriptions/interface";
import { UserState } from "@/store/modules/user/types";

// 监考员信息面板显示数据
export const createProctorPanelData = (userStore: UserState): DescData[] => [
  {
    label: "用户名",
    value: userStore.username,
  },
  {
    label: "角色",
    value: "监考员",
  },
  {
    label: "状态",
    value: "在线",
  },
  {
    label: "手机号码",
    value: userStore.phone,
  },
];

// 学院选项
export const collegeOptions = [
  {
    label: "计算机学院",
    value: "computer",
  },
  {
    label: "数学学院",
    value: "math",
  },
  {
    label: "物理学院",
    value: "physics",
  },
  {
    label: "化学学院",
    value: "chemistry",
  },
  {
    label: "生物学院",
    value: "biology",
  },
  {
    label: "经济学院",
    value: "economics",
  },
  {
    label: "法学院",
    value: "law",
  },
  {
    label: "文学院",
    value: "literature",
  },
];

// 监考员表单默认值
export interface ProctorInfoModel {
  email: string;
  nickname: string;
  college: string;
  department: string;
  title: string;
  phone: string;
  employeeId: string;
  profile: string;
}

// 表单字段配置
export const formFields = {
  email: {
    label: "邮箱",
    placeholder: "请输入邮箱地址，如xxx@qq.com",
    required: true,
    errorMessage: "请输入邮箱",
  },
  nickname: {
    label: "昵称",
    placeholder: "请输入您的昵称",
    required: true,
    errorMessage: "请输入昵称",
  },
  college: {
    label: "所在学院",
    placeholder: "请选择所在学院",
    required: true,
    errorMessage: "请选择所在学院",
  },
  department: {
    label: "所在系/部门",
    placeholder: "请输入所在系或部门",
    required: false,
  },
  title: {
    label: "职称/职位",
    placeholder: "请选择您的职称或职位",
    required: false,
  },
  phone: {
    label: "联系电话",
    placeholder: "请输入您的联系电话",
    required: true,
    errorMessage: "请输入联系电话",
  },
  employeeId: {
    label: "工号",
    placeholder: "请输入您的教职工工号",
    required: true,
    errorMessage: "请输入工号",
  },
  profile: {
    label: "个人简介",
    placeholder: "请输入您的个人简介，最多不超过200字。",
    required: false,
    maxLength: 200,
    errorMessage: "最多不超过200字",
  },
};

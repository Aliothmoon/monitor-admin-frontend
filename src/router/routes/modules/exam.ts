import { AppRouteRecordRaw } from "@/router/routes/types";
import { DEFAULT_LAYOUT } from "@/router/routes/base";

const EXAMS: AppRouteRecordRaw = {
  path: "/exam",
  name: "exam",
  component: DEFAULT_LAYOUT,
  meta: {
    menuName: "考试管理",
    icon: "icon-user-group",
    order: 1,
    single: false,
  },
  children: [
    {
      path: "manage",
      name: "exam-manage",
      component: () => import("@/views/exam/index.vue"),
      meta: {
        menuName: "考试管理",
        roles: ["*"],
      },
    },
    {
      path: "config",
      name: "exam-config",
      component: () => import("@/views/exam/config/index.vue"),
      meta: {
        menuName: "可疑进程黑名单",
        roles: ["*"],
      },
    },
    {
      path: "domain",
      name: "exam-domain",
      component: () => import("@/views/exam/config/domain.vue"),
      meta: {
        menuName: "访问域名黑名单",
        roles: ["*"],
      },
    },
    {
      path: "image",
      name: "exam-image",
      component: () => import("@/views/exam/config/image.vue"),
      meta: {
        menuName: "风险图片模板",
        roles: ["*"],
      },
    },
  ],
};

export default EXAMS;

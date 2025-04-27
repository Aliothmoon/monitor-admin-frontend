import { AppRouteRecordRaw } from "@/router/routes/types";
import { DEFAULT_LAYOUT } from "@/router/routes/base";

const OPERATION_LOG: AppRouteRecordRaw = {
  path: "/system",
  name: "system",
  component: DEFAULT_LAYOUT,
  meta: {
    menuName: "系统管理",
    icon: "icon-settings",
    order: 9,
    requiresAuth: true,
  },
  children: [
    {
      path: "operation-log",
      name: "operationLog",
      component: () => import("@/views/system/operation-log/index.vue"),
      meta: {
        menuName: "操作日志",
        requiresAuth: true,
        roles: ["*"],
      },
    },
  ],
};

export default OPERATION_LOG; 
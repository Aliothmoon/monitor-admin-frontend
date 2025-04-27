import { AppRouteRecordRaw } from "@/router/routes/types";
import { DEFAULT_LAYOUT } from "@/router/routes/base";

const MONITOR_SETTING: AppRouteRecordRaw = {
  path: "/monitor-setting",
  name: "monitor-setting",
  component: DEFAULT_LAYOUT,
  meta: {
    menuName: "监考设置",
    icon: "icon-computer",
    order: 2,
    requiresAuth: false,
  },
  children: [
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

export default MONITOR_SETTING;

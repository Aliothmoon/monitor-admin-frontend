import { AppRouteRecordRaw } from "@/router/routes/types";
import { DEFAULT_LAYOUT } from "@/router/routes/base";

const EXAM_ROOM: AppRouteRecordRaw = {
  path: "/monitor",
  name: "online-monitor",
  component: DEFAULT_LAYOUT,
  meta: {
    menuName: "考场监控",
    icon: "icon-computer",
    order: 1,
    requiresAuth: false,
  },
  children: [
    {
      path: "watch",
      name: "online-monitor-watch",
      component: () => import("@/views/monitor/single/index.vue"),
      meta: {
        hideInMenu: true,
        menuName: "单人监控",
        roles: ["*"],
      },
    },
    {
      path: "manage",
      name: "online-monitor-manage",
      component: () => import("@/views/monitor/many/index.vue"),
      meta: {
        menuName: "多人监控",
        roles: ["*"],
      },
    },
  ],
};

export default EXAM_ROOM;

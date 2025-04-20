import { AppRouteRecordRaw } from "@/router/routes/types";
import { DEFAULT_LAYOUT } from "@/router/routes/base";
const EXAM_ROOM: AppRouteRecordRaw = {
  path: "/monitor",
  name: "online-monitor",
  component: DEFAULT_LAYOUT,
  meta: {
    menuName: "考场管理",
    icon: "icon-computer",
    order: 1,
    single: true,
    requiresAuth: false
  },
  children: [
    {
      path: "manage",
      name: "online-monitor-manage",
      component: () => import("@/views/exam-room/index.vue"),
      meta: {
        menuName:"考场管理",
        roles: ["*"],
      },
    },
  ],
};

export default EXAM_ROOM;
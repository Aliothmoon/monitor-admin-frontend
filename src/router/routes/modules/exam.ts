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
    single: true,
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
      path: "manage",
      name: "exam-room-manage",
      component: () => import("@/views/exam-room/index.vue"),
      meta: {
        menuName: "考场管理",
        roles: ["*"],
        hideInMenu: true,
      },
    },
  ],
};

export default EXAMS;

import { AppRouteRecordRaw } from "@/router/routes/types";
import { DEFAULT_LAYOUT } from "@/router/routes/base";

const EXAMS: AppRouteRecordRaw = {
  path: "/exam",
  name: "exam",
  component: DEFAULT_LAYOUT,
  meta: {
    menuName: "考试管理",
    icon: "icon-user",
    requiresAuth: true,
    order: 1,
  },
  children: [
    {
      path: "manage",
      name: "exam-manage",
      component: () => import("@/views/users/manager/index.vue"),
      meta: {
        locale: "manager.candidates",
        requiresAuth: true,
        roles: ["*"],
      },
    },
  ],
};

export default EXAMS;

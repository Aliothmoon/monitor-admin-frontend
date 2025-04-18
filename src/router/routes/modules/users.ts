import { AppRouteRecordRaw } from "@/router/routes/types";
import { DEFAULT_LAYOUT } from "@/router/routes/base";

const USERS: AppRouteRecordRaw = {
  path: "/users",
  name: "users",
  component: DEFAULT_LAYOUT,
  meta: {
    menuName: "用户管理",
    icon: "icon-user",
    requiresAuth: true,
    order: 1,
  },
  children: [
    {
      path: "manage",
      name: "manage",
      component: () => import("@/views/users/manager/index.vue"),
      meta: {
        locale: "manager.candidates",
        requiresAuth: true,
        roles: ["*"],
      },
    },
    {
      path: "candidate",
      name: "candidate",
      component: () => import("@/views/users/candidate/index.vue"),
      meta: {
        locale: "menu.user.setting",
        requiresAuth: true,
        roles: ["*"],
      },
    },
  ],
};

export default USERS;

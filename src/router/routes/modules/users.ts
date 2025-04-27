import { AppRouteRecordRaw } from "@/router/routes/types";
import { DEFAULT_LAYOUT } from "@/router/routes/base";

const USERS: AppRouteRecordRaw = {
  path: "/users",
  name: "users",
  component: DEFAULT_LAYOUT,
  meta: {
    menuName: "账号管理",
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
        menuName: "监考员账号管理",
        requiresAuth: true,
        roles: ["*"],
      },
    },
    {
      path: "candidate-accounts",
      name: "examineeAllAccounts",
      component: () => import("@/views/examinee/all-accounts/index.vue"),
      meta: {
        menuName: "考生账号管理",
        roles: ["*"],
      },
    },
  ],
};

export default USERS;

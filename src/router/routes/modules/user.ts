import { DEFAULT_LAYOUT } from "../base";
import { AppRouteRecordRaw } from "../types";

const USER: AppRouteRecordRaw = {
  path: "/personal",
  name: "personal",
  component: DEFAULT_LAYOUT,
  meta: {
    locale: "menu.user",
    icon: "icon-user",
    requiresAuth: true,
    order: 7,
    single: true,
  },
  children: [
    {
      path: "setting",
      name: "Setting",
      component: () => import("@/views/user/setting/index.vue"),
      meta: {
        locale: "menu.user.setting",
        requiresAuth: true,
        roles: ["*"],
      },
    },
  ],
};

export default USER;

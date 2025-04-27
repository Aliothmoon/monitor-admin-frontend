import { AppRouteRecordRaw } from "@/router/routes/types";
import { DEFAULT_LAYOUT } from "@/router/routes/base";

const EXAMINEE: AppRouteRecordRaw = {
  path: "/examinee",
  name: "examinee",
  component: DEFAULT_LAYOUT,
  meta: {
    menuName: "考生信息管理",
    icon: "icon-user-group",
    order: 1,
    single: true,
  },
  children: [
    {
      path: "info",
      name: "examineeInfo",
      component: () => import("@/views/examinee/info/index.vue"),
      meta: {
        menuName: "考生信息管理",
        roles: ["*"],
      },
    },
    {
      path: "account",
      name: "examineeAccount",
      component: () => import("@/views/examinee/account/index.vue"),
      meta: {
        menuName: "考生账号管理",
        roles: ["*"],
        hideInMenu: true, // 不在菜单中显示
      },
    },
  ],
};

export default EXAMINEE; 
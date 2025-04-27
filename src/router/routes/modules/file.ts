import { AppRouteRecordRaw } from "@/router/routes/types";
import { DEFAULT_LAYOUT } from "@/router/routes/base";

const FILES: AppRouteRecordRaw = {
  path: "/file",
  name: "file",
  component: DEFAULT_LAYOUT,
  meta: {
    menuName: "文件管理",
    icon: "icon-file",
    order: 2,
    single: false,
  },
  children: [
    {
      path: "screenshot",
      name: "file-screenshot",
      component: () => import("@/views/file/screenshot/index.vue"),
      meta: {
        menuName: "截屏管理",
        roles: ["*"],
      },
    },
    {
      path: "screen",
      name: "file-screen",
      component: () => import("@/views/file/screen/index.vue"),
      meta: {
        menuName: "录屏管理",
        roles: ["*"],
      },
    },
  ],
};

export default FILES;

import { createRouter, createWebHashHistory } from "vue-router";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css";

import { appRoutes } from "./routes";
import { REDIRECT_MAIN, NOT_FOUND_ROUTE } from "./routes/base";
import createRouteGuard from "./guard";

// 导入操作日志路由
import OPERATION_LOG from './routes/modules/operation-log';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const router = createRouter({
  history: createWebHashHistory(""),
  routes: [
    {
      path: "/",
      redirect: "login",
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/login/index.vue"),
      meta: {
        requiresAuth: false,
      },
    },
    ...appRoutes,
    OPERATION_LOG,
    REDIRECT_MAIN,
    NOT_FOUND_ROUTE,
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

createRouteGuard(router);

export default router;

import axios from "axios";
import { Message, Modal } from "@arco-design/web-vue";
import { useUserStore } from "@/store";
import { getToken } from "@/utils/auth";
import {
  ErrorCode,
  ErrorMessages,
  SPECIAL_ERROR_CODES,
  getErrorMessage,
} from "./error-code";
import router from "@/router";

export interface HttpResponse<T = unknown> {
  status: number;
  msg: string;
  code: number;
  data: T;
}

// 设置基础URL
axios.defaults.baseURL = "/api";

// 设置超时时间
axios.defaults.timeout = 30000;

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 添加token
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 添加时间戳，防止缓存
    if (config.method?.toUpperCase() === "GET") {
      config.params = {
        ...config.params,
        _t: new Date().getTime(),
      };
    }

    return config;
  },
  (error) => {
    Message.error({
      content: "请求配置错误",
      duration: 3 * 1000,
    });
    return Promise.reject(error);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    const res = response.data;

    // 处理文件下载等特殊情况
    const contentType = response.headers["content-type"];
    if (contentType && contentType.includes("application/octet-stream")) {
      return response;
    }

    // 如果返回码不是0，判断为错误
    if (res.code !== ErrorCode.OK) {
      // 使用错误码映射获取错误信息
      const errorMessage = getErrorMessage(res.code) || res.msg;
      // 根据错误码类型处理不同错误情况
      switch (res.code) {
        // 权限相关错误
        case ErrorCode.NO_AUTHORITY:
          if (!["/api/user/info", "/api/user/logout"].includes(res.code)) {
            Modal.error({
              title: "登录状态失效",
              content: "您的登录状态已失效，请重新登录",
              okText: "重新登录",
            });
          }
          break;

        // 默认错误处理
        default:
          console.log(response.data);
          Message.error({
            content: ErrorMessages[res.code] || res.msg,
            duration: 5 * 1000,
          });
          break;
      }

      return Promise.reject(new Error(errorMessage));
    }
    return response;
  },
  (error) => {
    // 处理网络错误等其他错误
    if (error.response) {
      // 服务器返回了错误状态码
      const status = error.response.status;
      let errorMsg = "";

      switch (status) {
        case 400:
          errorMsg = "请求错误";
          break;
        case 401:
          errorMsg = "未授权，请重新登录";
          // 跳转到登录页或显示登录弹窗
          Modal.error({
            title: "登录状态失效",
            content: "您的登录状态已失效，请重新登录",
            okText: "重新登录",
            async onOk() {
              await router.push("/login");
            },
          });
          break;
        case 403:
          errorMsg = "拒绝访问";
          break;
        case 404:
          errorMsg = "请求地址出错";
          break;
        case 408:
          errorMsg = "请求超时";
          break;
        case 500:
          errorMsg = "服务器内部错误";
          break;
        case 501:
          errorMsg = "服务未实现";
          break;
        case 502:
          errorMsg = "网关错误";
          break;
        case 503:
          errorMsg = "服务不可用";
          break;
        case 504:
          errorMsg = "网关超时";
          break;
        default:
          errorMsg = `未知错误(${status})`;
      }

      Message.error({
        content: ErrorMessages[error.response.data?.code] || errorMsg,
        duration: 5 * 1000,
      });
    } else if (error.message.includes("timeout")) {
      // 请求超时
      Message.error({
        content: "请求超时，请稍后重试",
        duration: 5 * 1000,
      });
    } else {
      // 其他错误
      Message.error({
        content: "网络连接错误",
        duration: 5 * 1000,
      });
    }

    return Promise.reject(error);
  }
);

import axios from 'axios';
import { recordLog } from '@/api/operation-log';
import { useUserStore } from '@/store';
import { useRouter } from 'vue-router';

// 页面操作类型枚举
export enum OperationType {
  LOGIN = '登录',
  LOGOUT = '退出登录',
  CREATE = '新增',
  UPDATE = '修改',
  DELETE = '删除',
  QUERY = '查询',
  IMPORT = '导入',
  EXPORT = '导出',
  UPLOAD = '上传',
  DOWNLOAD = '下载',
  OTHER = '其他'
}

// 操作日志记录器
export class OperationLogger {
  private static instance: OperationLogger;
  private userStore = useUserStore();
  private router = useRouter();

  private constructor() {
    // 私有构造函数，确保单例
  }

  // 获取单例实例
  public static getInstance(): OperationLogger {
    if (!OperationLogger.instance) {
      OperationLogger.instance = new OperationLogger();
    }
    return OperationLogger.instance;
  }

  // 获取浏览器信息
  private getBrowserInfo(): string {
    const userAgent = navigator.userAgent;
    let browser = "Unknown";
    
    if (userAgent.indexOf("Firefox") > -1) {
      browser = "Firefox";
    } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
      browser = "Opera";
    } else if (userAgent.indexOf("Trident") > -1) {
      browser = "Internet Explorer";
    } else if (userAgent.indexOf("Edge") > -1) {
      browser = "Edge";
    } else if (userAgent.indexOf("Chrome") > -1) {
      browser = "Chrome";
    } else if (userAgent.indexOf("Safari") > -1) {
      browser = "Safari";
    }
    
    return browser;
  }
  
  // 获取操作系统信息
  private getOsInfo(): string {
    const userAgent = navigator.userAgent;
    let os = "Unknown";
    
    if (userAgent.indexOf("Win") > -1) {
      os = "Windows";
    } else if (userAgent.indexOf("Mac") > -1) {
      os = "MacOS";
    } else if (userAgent.indexOf("X11") > -1) {
      os = "UNIX";
    } else if (userAgent.indexOf("Linux") > -1) {
      os = "Linux";
    } else if (userAgent.indexOf("Android") > -1) {
      os = "Android";
    } else if (/iPhone|iPad|iPod/.test(userAgent)) {
      os = "iOS";
    }
    
    return os;
  }

  // 记录操作日志
  public logOperation(operation: string, params?: any, status = 200, errorMsg?: string) {
    const startTime = Date.now();
    const userInfo = this.userStore.userInfo;
    const routeInfo = this.router.currentRoute.value;
    
    // 构建日志数据
    const logData = {
      operation,
      method: routeInfo.fullPath,
      params: params ? JSON.stringify(params) : '',
      path: routeInfo.path,
      ip: '', // 前端无法直接获取真实IP，由后端填充
      browser: this.getBrowserInfo(),
      os: this.getOsInfo(),
      status,
      errorMsg: errorMsg || '',
      duration: Date.now() - startTime
    };
    
    // 异步记录日志，不阻塞主流程
    recordLog(logData).catch(error => {
      console.error('记录操作日志失败:', error);
    });
  }
}

// 创建axios拦截器，自动记录API请求
export function setupLogInterceptors() {
  const logger = OperationLogger.getInstance();
  
  // 请求拦截器
  axios.interceptors.request.use(
    config => {
      // 标记请求开始时间
      config.headers['X-Request-Start-Time'] = Date.now().toString();
      return config;
    }, 
    error => {
      return Promise.reject(error);
    }
  );
  
  // 响应拦截器
  axios.interceptors.response.use(
    response => {
      try {
        const startTime = parseInt(response.config.headers['X-Request-Start-Time'] || '0');
        if (startTime > 0 && shouldLogOperation(response.config.url || '')) {
          // 自动识别操作类型
          const operation = detectOperationType(response.config.method || '', response.config.url || '');
          
          // 记录成功的操作日志
          logger.logOperation(
            operation,
            response.config.data,
            response.status,
            ''
          );
        }
      } catch (e) {
        console.error('记录操作日志时出错', e);
      }
      return response;
    },
    error => {
      try {
        if (error.config) {
          const startTime = parseInt(error.config.headers['X-Request-Start-Time'] || '0');
          if (startTime > 0 && shouldLogOperation(error.config.url || '')) {
            // 自动识别操作类型
            const operation = detectOperationType(error.config.method || '', error.config.url || '');
            
            // 记录失败的操作日志
            logger.logOperation(
              operation,
              error.config.data,
              error.response?.status || 500,
              error.message || '未知错误'
            );
          }
        }
      } catch (e) {
        console.error('记录错误日志时出错', e);
      }
      return Promise.reject(error);
    }
  );
}

// 判断是否应该记录该操作
function shouldLogOperation(url: string): boolean {
  // 排除不需要记录日志的API，比如获取验证码、心跳检测等
  const excludePatterns = [
    '/system/operationLog', // 避免循环记录
    '/captcha',
    '/heartbeat',
    '/static'
  ];
  
  return !excludePatterns.some(pattern => url.includes(pattern));
}

// 根据HTTP方法和URL检测操作类型
function detectOperationType(method: string, url: string): string {
  const lowerMethod = method.toLowerCase();
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('login')) {
    return OperationType.LOGIN;
  } else if (lowerUrl.includes('logout')) {
    return OperationType.LOGOUT;
  } else if (lowerMethod === 'post' && !lowerUrl.includes('query') && !lowerUrl.includes('search')) {
    return OperationType.CREATE;
  } else if (lowerMethod === 'put' || lowerUrl.includes('update')) {
    return OperationType.UPDATE;
  } else if (lowerMethod === 'delete' || lowerUrl.includes('delete') || lowerUrl.includes('remove')) {
    return OperationType.DELETE;
  } else if (lowerMethod === 'get' || lowerUrl.includes('query') || lowerUrl.includes('search') || lowerUrl.includes('list')) {
    return OperationType.QUERY;
  } else if (lowerUrl.includes('import')) {
    return OperationType.IMPORT;
  } else if (lowerUrl.includes('export')) {
    return OperationType.EXPORT;
  } else if (lowerUrl.includes('upload')) {
    return OperationType.UPLOAD;
  } else if (lowerUrl.includes('download')) {
    return OperationType.DOWNLOAD;
  } else {
    return OperationType.OTHER;
  }
} 
/**
 * 错误码定义
 * 对应后端 ErrorCode 枚举
 */
export enum ErrorCode {
  OK = 0,
  UNEXPECTED = 1,
  
  // 权限相关错误码 (1000+)
  NO_AUTHORITY = 1001,
  
  // 用户相关错误码 (2000+)
  ERROR_PWD = 2001,
  USER_NOT_EXIST = 2002
}

/**
 * 错误码对应的错误信息
 */
export const ErrorMessages: Record<number, string> = {
  [ErrorCode.OK]: "操作成功",

  // 权限相关错误信息
  [ErrorCode.NO_AUTHORITY]: "您没有权限进行此操作，请先登录",
  
  // 用户相关错误信息
  [ErrorCode.ERROR_PWD]: "密码错误，请重新输入",
  [ErrorCode.USER_NOT_EXIST]: "用户不存在"
};

/**
 * 根据错误码获取错误信息
 * @param code 错误码
 * @returns 对应的错误信息，如果没有定义则返回"未知错误"
 */
export function getErrorMessage(code: number): string {
  return ErrorMessages[code] || `未知错误(${code})`;
}

/**
 * 需要特殊处理的错误码（如需要登出等）
 */
export const SPECIAL_ERROR_CODES = [
  ErrorCode.NO_AUTHORITY
]; 
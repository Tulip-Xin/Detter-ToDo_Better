/**
 * 错误类型枚举
 */
export enum ErrorType {
  DATABASE_ERROR = 'DATABASE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * 应用错误类
 */
export class AppError extends Error {
  type: ErrorType;
  details?: any;
  timestamp: Date;

  constructor(type: ErrorType, message: string, details?: any) {
    super(message);
    this.type = type;
    this.details = details;
    this.timestamp = new Date();
    this.name = 'AppError';

    // 维护正确的堆栈跟踪
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  /**
   * 获取用户友好的错误消息
   */
  getUserMessage(): string {
    switch (this.type) {
      case ErrorType.DATABASE_ERROR:
        return '数据操作失败，请稍后重试';
      case ErrorType.NETWORK_ERROR:
        return '网络连接失败，请检查网络设置';
      case ErrorType.VALIDATION_ERROR:
        return this.message || '输入数据不正确';
      case ErrorType.PERMISSION_ERROR:
        return '缺少必要权限，请在设置中授予权限';
      case ErrorType.UNKNOWN_ERROR:
      default:
        return '出现了一些问题，请稍后重试';
    }
  }

  /**
   * 转换为日志格式
   */
  toLogFormat(): string {
    return JSON.stringify({
      type: this.type,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    }, null, 2);
  }
}

/**
 * 错误日志记录器
 */
class ErrorLogger {
  private logs: AppError[] = [];
  private maxLogs = 100;

  /**
   * 记录错误
   */
  log(error: AppError): void {
    this.logs.push(error);

    // 保持日志数量在限制内
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // 在开发环境打印错误
    if (__DEV__) {
      console.error('[AppError]', error.toLogFormat());
    }
  }

  /**
   * 获取所有日志
   */
  getLogs(): AppError[] {
    return [...this.logs];
  }

  /**
   * 清除日志
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * 导出日志为字符串
   */
  exportLogs(): string {
    return JSON.stringify(
      this.logs.map(log => ({
        type: log.type,
        message: log.message,
        details: log.details,
        timestamp: log.timestamp.toISOString(),
      })),
      null,
      2
    );
  }
}

export const errorLogger = new ErrorLogger();

/**
 * 错误处理工具函数
 */
export const handleError = (error: unknown): AppError => {
  // 如果已经是 AppError，直接返回
  if (error instanceof AppError) {
    errorLogger.log(error);
    return error;
  }

  // 如果是普通 Error
  if (error instanceof Error) {
    const appError = new AppError(
      ErrorType.UNKNOWN_ERROR,
      error.message,
      { originalError: error.name }
    );
    errorLogger.log(appError);
    return appError;
  }

  // 其他类型的错误
  const appError = new AppError(
    ErrorType.UNKNOWN_ERROR,
    '未知错误',
    { originalError: error }
  );
  errorLogger.log(appError);
  return appError;
};

/**
 * 创建特定类型的错误
 */
export const createDatabaseError = (message: string, details?: any): AppError => {
  return new AppError(ErrorType.DATABASE_ERROR, message, details);
};

export const createValidationError = (message: string, details?: any): AppError => {
  return new AppError(ErrorType.VALIDATION_ERROR, message, details);
};

export const createPermissionError = (message: string, details?: any): AppError => {
  return new AppError(ErrorType.PERMISSION_ERROR, message, details);
};

export const createNetworkError = (message: string, details?: any): AppError => {
  return new AppError(ErrorType.NETWORK_ERROR, message, details);
};

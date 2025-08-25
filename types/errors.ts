// 错误严重程度
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// 错误分类
export enum ErrorCategory {
  NETWORK = 'network',
  STREAM = 'stream',
  VALIDATION = 'validation',
  RUNTIME = 'runtime',
  UNKNOWN = 'unknown',
}

// 错误代码
export enum ErrorCode {
  // 网络错误
  NETWORK_CONNECTION_FAILED = 'NETWORK_CONNECTION_FAILED',
  NETWORK_TIMEOUT = 'NETWORK_TIMEOUT',
  NETWORK_CORS_ERROR = 'NETWORK_CORS_ERROR',
  
  // 流式处理错误
  STREAM_CONNECTION_FAILED = 'STREAM_CONNECTION_FAILED',
  STREAM_PARSE_ERROR = 'STREAM_PARSE_ERROR',
  STREAM_INTERRUPTED = 'STREAM_INTERRUPTED',
  STREAM_TIMEOUT = 'STREAM_TIMEOUT',
  
  // 验证错误
  VALIDATION_INVALID_DATA = 'VALIDATION_INVALID_DATA',
  VALIDATION_MISSING_REQUIRED = 'VALIDATION_MISSING_REQUIRED',
  
  // 运行时错误
  RUNTIME_UNEXPECTED = 'RUNTIME_UNEXPECTED',
  RUNTIME_MEMORY_ERROR = 'RUNTIME_MEMORY_ERROR',
  
  // 未知错误
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// 错误详情接口
export interface ErrorDetails {
  code: ErrorCode
  category: ErrorCategory
  severity: ErrorSeverity
  message: string
  userMessage: string
  timestamp: Date
  context?: Record<string, unknown>
  originalError?: Error
  retryable: boolean
  retryCount?: number
  maxRetries?: number
}

// 错误处理结果
export interface ErrorHandlingResult {
  handled: boolean
  shouldRetry: boolean
  shouldShowUser: boolean
  userMessage: string
  logMessage: string
}

// 错误恢复建议
export interface ErrorRecoverySuggestion {
  action: string
  description: string
  priority: 'low' | 'medium' | 'high'
}

// 扩展的日志条目类型
export interface ExtendedLogEntry {
  id: string
  timestamp: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  errorDetails?: ErrorDetails
  retryable?: boolean
  suggestions?: ErrorRecoverySuggestion[]
}

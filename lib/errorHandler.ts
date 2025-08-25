import {
  ErrorCode,
  ErrorCategory,
  ErrorSeverity,
  type ErrorDetails,
  type ErrorHandlingResult,
  type ErrorRecoverySuggestion,
} from '../types/errors'

// 错误映射配置
const ERROR_CONFIG = {
  [ErrorCode.NETWORK_CONNECTION_FAILED]: {
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.HIGH,
    userMessage: '网络连接失败，请检查网络设置',
    retryable: true,
    maxRetries: 3,
  },
  [ErrorCode.NETWORK_TIMEOUT]: {
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.MEDIUM,
    userMessage: '网络请求超时，请稍后重试',
    retryable: true,
    maxRetries: 2,
  },
  [ErrorCode.NETWORK_CORS_ERROR]: {
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.HIGH,
    userMessage: '跨域请求错误，请联系管理员',
    retryable: false,
  },
  [ErrorCode.STREAM_CONNECTION_FAILED]: {
    category: ErrorCategory.STREAM,
    severity: ErrorSeverity.HIGH,
    userMessage: '流式连接失败，请刷新页面重试',
    retryable: true,
    maxRetries: 3,
  },
  [ErrorCode.STREAM_PARSE_ERROR]: {
    category: ErrorCategory.STREAM,
    severity: ErrorSeverity.MEDIUM,
    userMessage: '数据解析错误，请重试',
    retryable: true,
    maxRetries: 2,
  },
  [ErrorCode.STREAM_INTERRUPTED]: {
    category: ErrorCategory.STREAM,
    severity: ErrorSeverity.MEDIUM,
    userMessage: '流式连接中断，正在尝试重连',
    retryable: true,
    maxRetries: 5,
  },
  [ErrorCode.STREAM_TIMEOUT]: {
    category: ErrorCategory.STREAM,
    severity: ErrorSeverity.MEDIUM,
    userMessage: '流式处理超时，请重试',
    retryable: true,
    maxRetries: 2,
  },
  [ErrorCode.VALIDATION_INVALID_DATA]: {
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.LOW,
    userMessage: '数据格式错误',
    retryable: false,
  },
  [ErrorCode.VALIDATION_MISSING_REQUIRED]: {
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.MEDIUM,
    userMessage: '缺少必要参数',
    retryable: false,
  },
  [ErrorCode.RUNTIME_UNEXPECTED]: {
    category: ErrorCategory.RUNTIME,
    severity: ErrorSeverity.CRITICAL,
    userMessage: '发生未知错误，请刷新页面',
    retryable: false,
  },
  [ErrorCode.RUNTIME_MEMORY_ERROR]: {
    category: ErrorCategory.RUNTIME,
    severity: ErrorSeverity.CRITICAL,
    userMessage: '内存不足，请关闭其他应用后重试',
    retryable: false,
  },
  [ErrorCode.UNKNOWN_ERROR]: {
    category: ErrorCategory.UNKNOWN,
    severity: ErrorSeverity.HIGH,
    userMessage: '发生未知错误，请重试',
    retryable: true,
    maxRetries: 1,
  },
} as const

// 错误分类器
export class ErrorClassifier {
  static classify(error: unknown): ErrorCode {
    if (error instanceof Error) {
      const message = error.message.toLowerCase()
      const name = error.name.toLowerCase()

      // 网络错误
      if (message.includes('fetch') || message.includes('network') || name.includes('network')) {
        if (message.includes('timeout') || message.includes('timed out')) {
          return ErrorCode.NETWORK_TIMEOUT
        }
        if (message.includes('cors') || message.includes('cross-origin')) {
          return ErrorCode.NETWORK_CORS_ERROR
        }
        return ErrorCode.NETWORK_CONNECTION_FAILED
      }

      // 流式处理错误
      if (message.includes('stream') || message.includes('eventsource') || name.includes('stream')) {
        if (message.includes('parse') || message.includes('json')) {
          return ErrorCode.STREAM_PARSE_ERROR
        }
        if (message.includes('interrupt') || message.includes('close')) {
          return ErrorCode.STREAM_INTERRUPTED
        }
        if (message.includes('timeout')) {
          return ErrorCode.STREAM_TIMEOUT
        }
        return ErrorCode.STREAM_CONNECTION_FAILED
      }

      // 验证错误
      if (message.includes('validation') || message.includes('invalid') || name.includes('validation')) {
        if (message.includes('required') || message.includes('missing')) {
          return ErrorCode.VALIDATION_MISSING_REQUIRED
        }
        return ErrorCode.VALIDATION_INVALID_DATA
      }

      // 运行时错误
      if (name.includes('memory') || message.includes('memory')) {
        return ErrorCode.RUNTIME_MEMORY_ERROR
      }
      if (name.includes('type') || name.includes('reference')) {
        return ErrorCode.RUNTIME_UNEXPECTED
      }
    }

    return ErrorCode.UNKNOWN_ERROR
  }
}

// 错误处理器
export class ErrorHandler {
  static createErrorDetails(
    error: unknown,
    context?: Record<string, unknown>
  ): ErrorDetails {
    const code = ErrorClassifier.classify(error)
    const config = ERROR_CONFIG[code]
    const originalError = error instanceof Error ? error : new Error(String(error))

    return {
      code,
      category: config.category,
      severity: config.severity,
      message: originalError.message,
      userMessage: config.userMessage,
      timestamp: new Date(),
      context,
      originalError,
      retryable: config.retryable,
      maxRetries: config.maxRetries,
    }
  }

  static handleError(
    error: unknown,
    context?: Record<string, unknown>,
    retryCount: number = 0
  ): ErrorHandlingResult {
    const errorDetails = this.createErrorDetails(error, context)
    errorDetails.retryCount = retryCount

    const config = ERROR_CONFIG[errorDetails.code]
    const shouldRetry = config.retryable && retryCount < (config.maxRetries || 0)
    const shouldShowUser = errorDetails.severity >= ErrorSeverity.MEDIUM

    return {
      handled: true,
      shouldRetry,
      shouldShowUser,
      userMessage: errorDetails.userMessage,
      logMessage: `[${errorDetails.code}] ${errorDetails.message}`,
    }
  }

  static getRecoverySuggestions(errorDetails: ErrorDetails): ErrorRecoverySuggestion[] {
    const suggestions: ErrorRecoverySuggestion[] = []

    switch (errorDetails.code) {
      case ErrorCode.NETWORK_CONNECTION_FAILED:
        suggestions.push(
          {
            action: '检查网络连接',
            description: '确保设备已连接到互联网',
            priority: 'high',
          },
          {
            action: '刷新页面',
            description: '重新加载页面以建立新的连接',
            priority: 'medium',
          }
        )
        break

      case ErrorCode.STREAM_CONNECTION_FAILED:
        suggestions.push(
          {
            action: '刷新页面',
            description: '重新建立流式连接',
            priority: 'high',
          },
          {
            action: '检查浏览器设置',
            description: '确保浏览器允许服务器发送事件',
            priority: 'medium',
          }
        )
        break

      case ErrorCode.RUNTIME_MEMORY_ERROR:
        suggestions.push(
          {
            action: '关闭其他应用',
            description: '释放系统内存',
            priority: 'high',
          },
          {
            action: '重启浏览器',
            description: '清理浏览器内存缓存',
            priority: 'medium',
          }
        )
        break

      case ErrorCode.UNKNOWN_ERROR:
        suggestions.push(
          {
            action: '刷新页面',
            description: '重新初始化应用状态',
            priority: 'high',
          },
          {
            action: '联系支持',
            description: '如果问题持续存在，请联系技术支持',
            priority: 'low',
          }
        )
        break
    }

    return suggestions
  }

  static formatErrorForLog(errorDetails: ErrorDetails): string {
    const parts = [
      `[${errorDetails.code}]`,
      errorDetails.message,
    ]

    if (errorDetails.context) {
      parts.push(`Context: ${JSON.stringify(errorDetails.context)}`)
    }

    if (errorDetails.retryCount !== undefined) {
      parts.push(`Retry: ${errorDetails.retryCount}/${errorDetails.maxRetries || 0}`)
    }

    return parts.join(' | ')
  }
}

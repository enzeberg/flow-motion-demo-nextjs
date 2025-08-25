import { useCallback, useRef } from 'react'
import { toast } from 'sonner'
import { ErrorHandler } from '../lib/errorHandler'
import { type ErrorDetails, type ErrorRecoverySuggestion } from '../types/errors'

interface UseErrorHandlerOptions {
  onError?: (errorDetails: ErrorDetails) => void
  onRetry?: (errorDetails: ErrorDetails) => void
  showToast?: boolean
  maxRetries?: number
}

export const useErrorHandler = (options: UseErrorHandlerOptions = {}) => {
  const {
    onError,
    onRetry,
    showToast = true,
    maxRetries = 3,
  } = options

  const retryCounts = useRef<Map<string, number>>(new Map())

  const handleError = useCallback(
    (error: unknown, context?: Record<string, unknown>) => {
      const errorDetails = ErrorHandler.createErrorDetails(error, context)
      const currentRetryCount = retryCounts.current.get(errorDetails.code) || 0
      
      errorDetails.retryCount = currentRetryCount
      errorDetails.maxRetries = maxRetries

      const result = ErrorHandler.handleError(error, context, currentRetryCount)

      // 记录错误
      console.error(ErrorHandler.formatErrorForLog(errorDetails))

      // 调用自定义错误处理
      if (onError) {
        onError(errorDetails)
      }

      // 显示用户友好的错误消息
      if (result.shouldShowUser && showToast) {
        toast.error(result.userMessage, {
          duration: errorDetails.severity === 'critical' ? 8000 : 5000,
        })
      }

      return {
        errorDetails,
        result,
        shouldRetry: result.shouldRetry,
        suggestions: ErrorHandler.getRecoverySuggestions(errorDetails),
      }
    },
    [onError, showToast, maxRetries]
  )

  const retryOperation = useCallback(
    async (
      operation: () => Promise<void>,
      errorDetails: ErrorDetails,
      context?: Record<string, unknown>
    ) => {
      const currentRetryCount = retryCounts.current.get(errorDetails.code) || 0
      const newRetryCount = currentRetryCount + 1

      if (newRetryCount > (errorDetails.maxRetries || maxRetries)) {
        console.warn(`Max retries exceeded for ${errorDetails.code}`)
        return false
      }

      // 更新重试计数
      retryCounts.current.set(errorDetails.code, newRetryCount)

      // 显示重试消息
      if (showToast) {
        toast.info(`正在重试... (${newRetryCount}/${errorDetails.maxRetries || maxRetries})`)
      }

      try {
        // 等待一段时间后重试
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, newRetryCount) * 1000))
        
        await operation()
        
        // 成功后清除重试计数
        retryCounts.current.delete(errorDetails.code)
        
        if (onRetry) {
          onRetry(errorDetails)
        }
        
        return true
      } catch (retryError) {
        // 重试失败，递归处理错误
        return handleError(retryError, context)
      }
    },
    [maxRetries, showToast, onRetry]
  )

  const clearRetryCount = useCallback((errorCode?: string) => {
    if (errorCode) {
      retryCounts.current.delete(errorCode)
    } else {
      retryCounts.current.clear()
    }
  }, [])

  const getRetryCount = useCallback((errorCode: string) => {
    return retryCounts.current.get(errorCode) || 0
  }, [])

  return {
    handleError,
    retryOperation,
    clearRetryCount,
    getRetryCount,
  }
}

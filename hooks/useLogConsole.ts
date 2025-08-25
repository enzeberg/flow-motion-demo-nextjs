import { useState, useCallback } from 'react'
import type { LogEntry } from '../components/LogConsole'
import type { ExtendedLogEntry, ErrorDetails, ErrorRecoverySuggestion } from '../types/errors'

export const useLogConsole = (maxLogs: number = 100) => {
  const [logs, setLogs] = useState<ExtendedLogEntry[]>([])

  const addLog = useCallback(
    (message: string, type: LogEntry['type'] = 'info', errorDetails?: ErrorDetails, suggestions?: ErrorRecoverySuggestion[]) => {
      const newLog: ExtendedLogEntry = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toLocaleTimeString('zh-CN', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        message,
        type,
        errorDetails,
        retryable: errorDetails?.retryable,
        suggestions,
      }

      setLogs((prevLogs) => {
        const updatedLogs = [...prevLogs, newLog]
        // 保持最大日志数量限制
        if (updatedLogs.length > maxLogs) {
          return updatedLogs.slice(-maxLogs)
        }
        return updatedLogs
      })
    },
    [maxLogs]
  )

  const clearLogs = useCallback(() => {
    setLogs([])
  }, [])

  const addInfoLog = useCallback(
    (message: string) => {
      addLog(message, 'info')
    },
    [addLog]
  )

  const addSuccessLog = useCallback(
    (message: string) => {
      addLog(message, 'success')
    },
    [addLog]
  )

  const addWarningLog = useCallback(
    (message: string) => {
      addLog(message, 'warning')
    },
    [addLog]
  )

  const addErrorLog = useCallback(
    (message: string, errorDetails?: ErrorDetails, suggestions?: ErrorRecoverySuggestion[]) => {
      addLog(message, 'error', errorDetails, suggestions)
    },
    [addLog]
  )

  return {
    logs,
    addLog,
    addInfoLog,
    addSuccessLog,
    addWarningLog,
    addErrorLog,
    clearLogs,
  }
}

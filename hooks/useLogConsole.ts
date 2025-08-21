import { useState, useCallback } from 'react'
import type { LogEntry } from '../components/LogConsole'

export const useLogConsole = (maxLogs: number = 100) => {
  const [logs, setLogs] = useState<LogEntry[]>([])

  const addLog = useCallback(
    (message: string, type: LogEntry['type'] = 'info') => {
      const newLog: LogEntry = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toLocaleTimeString('zh-CN', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        message,
        type,
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
    (message: string) => {
      addLog(message, 'error')
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

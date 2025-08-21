import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from 'lucide-react'

export interface LogEntry {
  id: string
  timestamp: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

interface LogConsoleProps {
  logs: LogEntry[]
  maxHeight?: number
  autoScroll?: boolean
}

function LogConsole({
  logs,
  maxHeight = 200,
  autoScroll = true,
}: LogConsoleProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs, autoScroll])

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Info className="w-4 h-4 text-blue-500" />
    }
  }

  const getLogColorClass = (type: LogEntry['type']) => {
    switch (type) {
      case 'info':
        return 'text-blue-600 border-blue-200'
      case 'success':
        return 'text-green-600 border-green-200'
      case 'warning':
        return 'text-yellow-600 border-yellow-200'
      case 'error':
        return 'text-red-600 border-red-200'
      default:
        return 'text-blue-600 border-blue-200'
    }
  }

  return (
    <Card className="m-4 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">执行日志</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div
          ref={scrollRef}
          className="bg-muted/30 rounded p-2 font-mono text-xs leading-relaxed overflow-y-auto"
          style={{ maxHeight: `${maxHeight}px` }}
        >
          <AnimatePresence>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start mb-1 p-2 rounded bg-background border ${getLogColorClass(log.type)}`}
              >
                <div className="mr-2 mt-0.5">
                  {getLogIcon(log.type)}
                </div>
                <div className="flex-1">
                  <span className="text-muted-foreground mr-2 text-xs">
                    [{log.timestamp}]
                  </span>
                  <span className={getLogColorClass(log.type).split(' ')[0]}>
                    {log.message}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {logs.length === 0 && (
            <div className="text-center text-muted-foreground py-5">
              暂无日志记录
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default LogConsole
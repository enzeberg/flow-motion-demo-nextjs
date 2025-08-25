import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Wifi, Settings } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ErrorRecoverySuggestion } from '../types/errors'

interface ErrorRecoveryPanelProps {
  suggestions: ErrorRecoverySuggestion[]
  onRetry?: () => void
  onRefresh?: () => void
  visible: boolean
}

export default function ErrorRecoveryPanel({
  suggestions,
  onRetry,
  onRefresh,
  visible,
}: ErrorRecoveryPanelProps) {
  const [expanded, setExpanded] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-4 h-4" />
      case 'medium':
        return <Settings className="w-4 h-4" />
      case 'low':
        return <Wifi className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  if (!visible || suggestions.length === 0) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="m-4 border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              错误恢复建议
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="space-y-2">
              {suggestions.slice(0, expanded ? undefined : 2).map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-2 rounded border ${getPriorityColor(suggestion.priority)}`}
                >
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">
                      {getPriorityIcon(suggestion.priority)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {suggestion.action}
                      </div>
                      <div className="text-xs opacity-80 mt-1">
                        {suggestion.description}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {suggestions.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpanded(!expanded)}
                  className="w-full text-xs"
                >
                  {expanded ? '收起' : `显示更多 (${suggestions.length - 2})`}
                </Button>
              )}
            </div>

            <div className="flex gap-2 mt-3 pt-3 border-t border-orange-200">
              {onRetry && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onRetry}
                  className="flex-1"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  重试
                </Button>
              )}
              {onRefresh && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onRefresh}
                  className="flex-1"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  刷新页面
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

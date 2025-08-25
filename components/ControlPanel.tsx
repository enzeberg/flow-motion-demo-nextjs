import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { RotateCcw, Square } from 'lucide-react'
import { motion } from 'framer-motion'

interface ControlPanelProps {
  isStreaming: boolean
  streamStatus: string
  onStop: () => void
  onRestart: () => void
}

export default function ControlPanel({
  isStreaming,
  streamStatus,
  onStop,
  onRestart,
}: ControlPanelProps) {
  return (
    <Card className="m-4 mb-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-lg font-semibold mb-2">动态流程图演示</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>状态:</span>
              <motion.span
                key={streamStatus}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`font-medium ${
                  isStreaming ? 'text-blue-600' : 'text-foreground'
                }`}
              >
                {streamStatus}
              </motion.span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onStop}
              disabled={!isStreaming}
            >
              <Square className="w-4 h-4 mr-2" />
              停止
            </Button>
            <Button size="sm" onClick={onRestart} disabled={isStreaming}>
              <RotateCcw className="w-4 h-4 mr-2" />
              重新开始
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

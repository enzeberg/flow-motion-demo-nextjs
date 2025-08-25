import { useCallback, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import { FlowEventStreamService } from '../services/flowEventStream'
import { type StreamEvent } from '../types/flow'

interface UseFlowControllerProps {
  isStreaming: boolean
  setIsStreaming: (streaming: boolean) => void
  setStreamStatus: (status: string) => void
  handleStreamEvent: (event: StreamEvent) => void
  addInfoLog: (message: string) => void
  addErrorLog: (message: string) => void
  addWarningLog: (message: string) => void
  clearLogs: () => void
  setNodes: (nodes: any[]) => void
  setEdges: (edges: any[]) => void
  setCurrentNodeId: (id: string | null) => void
}

export const useFlowController = ({
  isStreaming,
  setIsStreaming,
  setStreamStatus,
  handleStreamEvent,
  addInfoLog,
  addErrorLog,
  addWarningLog,
  clearLogs,
  setNodes,
  setEdges,
  setCurrentNodeId,
}: UseFlowControllerProps) => {
  const streamServiceRef = useRef<FlowEventStreamService>(
    new FlowEventStreamService()
  )

  // 开始流式处理
  const startStream = useCallback(async () => {
    if (isStreaming) return

    setIsStreaming(true)
    setStreamStatus('正在启动...')
    addInfoLog('🚀 开始启动流程处理...')

    try {
      await streamServiceRef.current.createEventStream(handleStreamEvent)
    } catch (error) {
      console.error('Stream error:', error)
      toast.error('流式处理出错')
      setIsStreaming(false)
      setStreamStatus('错误')
      addErrorLog(
        `流式处理出错: ${error instanceof Error ? error.message : '未知错误'}`
      )
    }
  }, [isStreaming, handleStreamEvent, addInfoLog, addErrorLog, setIsStreaming, setStreamStatus])

  // 停止流式处理
  const stopStream = useCallback(() => {
    streamServiceRef.current.stopStream()
    setIsStreaming(false)
    setStreamStatus('已停止')
    setCurrentNodeId(null)
    addWarningLog('⏹️ 流程已手动停止')
  }, [setIsStreaming, setStreamStatus, setCurrentNodeId, addWarningLog])

  // 重新开始流程
  const restartFlow = useCallback(() => {
    streamServiceRef.current.stopStream()
    setNodes([])
    setEdges([])
    setIsStreaming(false)
    setCurrentNodeId(null)
    setStreamStatus('就绪')
    clearLogs()
    addInfoLog('🔄 重新启动流程...')
    // 重置后自动开始新的流程
    setTimeout(() => {
      startStream()
    }, 100)
  }, [setNodes, setEdges, startStream, clearLogs, addInfoLog, setIsStreaming, setCurrentNodeId, setStreamStatus])

  // 页面加载时自动开始流程
  useEffect(() => {
    let mounted = true

    const initializeFlow = async () => {
      if (!mounted) return

      addInfoLog('📋 系统初始化完成，准备开始流程')

      if (!isStreaming) {
        setIsStreaming(true)
        setStreamStatus('正在启动...')
        addInfoLog('🚀 开始启动流程处理...')

        try {
          await streamServiceRef.current.createEventStream((event) => {
            if (mounted) {
              handleStreamEvent(event)
            }
          })
        } catch (error) {
          if (mounted) {
            console.error('Stream error:', error)
            toast.error('流式处理出错')
            setIsStreaming(false)
            setStreamStatus('错误')
            addErrorLog(
              `流式处理出错: ${
                error instanceof Error ? error.message : '未知错误'
              }`
            )
          }
        }
      }
    }

    initializeFlow()

    // 组件卸载时清理
    return () => {
      mounted = false
      streamServiceRef.current.stopStream()
    }
  }, []) // 空依赖数组，只在组件挂载时执行一次

  return {
    startStream,
    stopStream,
    restartFlow,
  }
}

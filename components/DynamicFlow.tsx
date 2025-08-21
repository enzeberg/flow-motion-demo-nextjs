import { useState, useCallback, useRef, useEffect } from 'react'
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  Position,
} from '@xyflow/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { RotateCcw, Square } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import '@xyflow/react/dist/style.css'

import FlowNode from './FlowNode'
import AnimatedEdge from './AnimatedEdge'
import LogConsole from './LogConsole'
import { FlowEventStreamService } from '../services/flowEventStream'
import { useLogConsole } from '../hooks/useLogConsole'

import {
  type StreamEvent,
  EventType,
  NodeStatus,
  type ReactFlowNode,
  type ReactFlowEdge,
} from '../types/flow'

const nodeTypes = {
  flowNode: FlowNode,
}

const edgeTypes = {
  animated: AnimatedEdge,
}

function DynamicFlowContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState<ReactFlowNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<ReactFlowEdge>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null)
  const [streamStatus, setStreamStatus] = useState<string>('就绪')

  const streamServiceRef = useRef<FlowEventStreamService>(
    new FlowEventStreamService()
  )
  const { fitView, setCenter } = useReactFlow()
  const {
    logs,
    addInfoLog,
    addSuccessLog,
    addWarningLog,
    addErrorLog,
    clearLogs,
  } = useLogConsole()

  // 处理流事件
  const handleStreamEvent = useCallback(
    (event: StreamEvent) => {
      switch (event.type) {
        case EventType.NODE_CREATED:
          const newNode: ReactFlowNode = {
            id: event.data.id,
            type: 'flowNode',
            position: { x: event.data.x, y: event.data.y },
            data: event.data,
            style: {
              width: 200,
              height: 'auto',
            },
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
          }
          setNodes((prevNodes) => [...prevNodes, newNode])
          setCurrentNodeId(event.data.id)
          setStreamStatus(`创建节点: ${event.data.title}`)
          addInfoLog(`创建节点: ${event.data.title} (${event.data.id})`)

          // 聚焦到新节点
          setTimeout(() => {
            setCenter(event.data.x, event.data.y, { zoom: 1, duration: 800 })
          }, 300)
          break

        case EventType.NODE_STATUS_UPDATED:
          setNodes((prevNodes) =>
            prevNodes.map((node) =>
              node.id === event.data.nodeId
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      status: event.data.status,
                    },
                  }
                : node
            )
          )

          if (event.data.status === NodeStatus.RUNNING) {
            setCurrentNodeId(event.data.nodeId)
            setStreamStatus(`执行中: ${event.data.nodeId}`)
            addInfoLog(`开始执行任务: ${event.data.nodeId}`)

            // 聚焦到当前执行的节点
            const currentNode = nodes.find((n) => n.id === event.data.nodeId)
            if (currentNode) {
              setCenter(currentNode.position.x, currentNode.position.y, {
                zoom: 1,
                duration: 500,
              })
            }
          } else if (event.data.status === NodeStatus.SUCCESS) {
            setStreamStatus(`完成: ${event.data.nodeId}`)
            addSuccessLog(`任务完成: ${event.data.nodeId}`)
          } else if (event.data.status === NodeStatus.ERROR) {
            addErrorLog(`任务失败: ${event.data.nodeId}`)
          }
          break

        case EventType.EDGE_CREATED:
          const newEdge: ReactFlowEdge = {
            id: event.data.id,
            source: event.data.source,
            target: event.data.target,
            sourceHandle: null,
            targetHandle: null,
            type: 'animated',
            animated: true,
            style: {
              strokeDasharray: '5,5',
              stroke: '#1890ff',
              strokeWidth: 2,
            },
          }
          setEdges((prevEdges) => [...prevEdges, newEdge])
          setStreamStatus(
            `创建连接: ${event.data.source} → ${event.data.target}`
          )
          addInfoLog(`创建连接: ${event.data.source} → ${event.data.target}`)
          break

        case EventType.FLOW_COMPLETED:
          setStreamStatus('流程完成！')
          setCurrentNodeId(null)
          toast.success(event.data.message)
          setIsStreaming(false)
          addSuccessLog('🎉 流程执行完成！所有任务已成功完成')
          break
      }
    },
    [
      nodes,
      setNodes,
      setEdges,
      setCenter,
      addInfoLog,
      addSuccessLog,
      addErrorLog,
    ]
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
  }, [isStreaming, handleStreamEvent, addInfoLog, addErrorLog])

  // 停止流式处理
  const stopStream = useCallback(() => {
    streamServiceRef.current.stopStream()
    setIsStreaming(false)
    setStreamStatus('已停止')
    setCurrentNodeId(null)
    addWarningLog('⏹️ 流程已手动停止')
  }, [addWarningLog])

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
  }, [setNodes, setEdges, startStream, clearLogs, addInfoLog])

  // 自动适应视图
  useEffect(() => {
    if (nodes.length > 0) {
      setTimeout(() => fitView({ duration: 500 }), 100)
    }
  }, [nodes.length, fitView])

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

  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 控制面板 */}
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
                onClick={stopStream}
                disabled={!isStreaming}
              >
                <Square className="w-4 h-4 mr-2" />
                停止
              </Button>
              <Button size="sm" onClick={restartFlow} disabled={isStreaming}>
                <RotateCcw className="w-4 h-4 mr-2" />
                重新开始
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 流程图区域 */}
      <div className="flex-1 mx-4 mt-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="h-full rounded-lg border overflow-hidden shadow-sm"
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            attributionPosition="bottom-left"
            className="bg-background"
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            minZoom={0.1}
            maxZoom={2}
            elementsSelectable={false}
            nodesDraggable={false}
            nodesConnectable={false}
            edgesFocusable={false}
            connectionLineStyle={{
              strokeDasharray: '5,5',
              stroke: '#1890ff',
            }}
            nodeOrigin={[0.5, 0.5]}
            snapToGrid={false}
          >
            <Controls
              position="top-left"
              className="bg-background border border-border rounded-lg"
            />
            <Background
              color="hsl(var(--muted-foreground))"
              gap={20}
              size={1}
              className="opacity-10"
            />
            <MiniMap
              nodeColor="hsl(var(--primary))"
              maskColor="rgba(0,0,0,0.1)"
              className="bg-background border border-border rounded-lg"
            />
          </ReactFlow>
        </motion.div>
      </div>

      {/* 日志控制台 */}
      <LogConsole logs={logs} maxHeight={120} autoScroll={true} />

      {/* 当前节点指示器 */}
      <AnimatePresence>
        {currentNodeId && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#1890ff',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)',
              zIndex: 1000,
            }}
          >
            当前聚焦: {currentNodeId}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DynamicFlow() {
  return (
    <ReactFlowProvider>
      <DynamicFlowContent />
    </ReactFlowProvider>
  )
}

export default DynamicFlow

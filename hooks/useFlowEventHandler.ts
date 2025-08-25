import { useCallback } from 'react'
import { useReactFlow } from '@xyflow/react'
import { Position } from '@xyflow/react'
import { toast } from 'sonner'
import {
  type StreamEvent,
  EventType,
  NodeStatus,
  type ReactFlowNode,
  type ReactFlowEdge,
} from '../types/flow'

interface UseFlowEventHandlerProps {
  setNodes: (updater: (nodes: ReactFlowNode[]) => ReactFlowNode[]) => void
  setEdges: (updater: (edges: ReactFlowEdge[]) => ReactFlowEdge[]) => void
  setCurrentNodeId: (id: string | null) => void
  setStreamStatus: (status: string) => void
  setIsStreaming: (streaming: boolean) => void
  addInfoLog: (message: string) => void
  addSuccessLog: (message: string) => void
  addErrorLog: (message: string) => void
}

export const useFlowEventHandler = ({
  setNodes,
  setEdges,
  setCurrentNodeId,
  setStreamStatus,
  setIsStreaming,
  addInfoLog,
  addSuccessLog,
  addErrorLog,
}: UseFlowEventHandlerProps) => {
  const { setCenter } = useReactFlow()

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
            setNodes((prevNodes) => {
              const currentNode = prevNodes.find((n) => n.id === event.data.nodeId)
              if (currentNode) {
                setCenter(currentNode.position.x, currentNode.position.y, {
                  zoom: 1,
                  duration: 500,
                })
              }
              return prevNodes
            })
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
      setNodes,
      setEdges,
      setCenter,
      setCurrentNodeId,
      setStreamStatus,
      setIsStreaming,
      addInfoLog,
      addSuccessLog,
      addErrorLog,
    ]
  )

  return { handleStreamEvent }
}

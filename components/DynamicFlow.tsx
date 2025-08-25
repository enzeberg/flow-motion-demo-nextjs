import { useState } from 'react'
import {
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from '@xyflow/react'

import FlowCanvas from './FlowCanvas'
import ControlPanel from './ControlPanel'
import CurrentNodeIndicator from './CurrentNodeIndicator'
import LogConsole from './LogConsole'
import { useLogConsole } from '../hooks/useLogConsole'
import { useFlowEventHandler } from '../hooks/useFlowEventHandler'
import { useFlowController } from '../hooks/useFlowController'

import {
  type ReactFlowNode,
  type ReactFlowEdge,
} from '../types/flow'

function DynamicFlowContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState<ReactFlowNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<ReactFlowEdge>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null)
  const [streamStatus, setStreamStatus] = useState<string>('就绪')

  const {
    logs,
    addInfoLog,
    addSuccessLog,
    addWarningLog,
    addErrorLog,
    clearLogs,
  } = useLogConsole()

  // 使用自定义 Hook 处理流事件
  const { handleStreamEvent } = useFlowEventHandler({
    setNodes,
    setEdges,
    setCurrentNodeId,
    setStreamStatus,
    setIsStreaming,
    addInfoLog,
    addSuccessLog,
    addErrorLog,
  })

  // 使用自定义 Hook 控制流
  const { startStream, stopStream, restartFlow } = useFlowController({
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
  })

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
      <ControlPanel
        isStreaming={isStreaming}
        streamStatus={streamStatus}
        onStop={stopStream}
        onRestart={restartFlow}
      />

      {/* 流程图区域 */}
      <FlowCanvas
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      />

      {/* 日志控制台 */}
      <LogConsole logs={logs} maxHeight={120} autoScroll={true} />

      {/* 当前节点指示器 */}
      <CurrentNodeIndicator currentNodeId={currentNodeId} />
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

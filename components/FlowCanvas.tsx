import { useEffect } from 'react'
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  useReactFlow,
} from '@xyflow/react'
import { motion } from 'framer-motion'
import '@xyflow/react/dist/style.css'

import FlowNode from './FlowNode'
import AnimatedEdge from './AnimatedEdge'
import { type ReactFlowNode, type ReactFlowEdge } from '../types/flow'

const nodeTypes = {
  flowNode: FlowNode,
}

const edgeTypes = {
  animated: AnimatedEdge,
}

interface FlowCanvasProps {
  nodes: ReactFlowNode[]
  edges: ReactFlowEdge[]
  onNodesChange: (changes: any) => void
  onEdgesChange: (changes: any) => void
}

export default function FlowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
}: FlowCanvasProps) {
  const { fitView } = useReactFlow()

  // 自动适应视图
  useEffect(() => {
    if (nodes.length > 0) {
      setTimeout(() => fitView({ duration: 500 }), 100)
    }
  }, [nodes.length, fitView])

  return (
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
  )
}

import type { Node, Edge } from '@xyflow/react'

// 节点执行状态
export enum NodeStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILED = 'failed',
  ERROR = 'ERROR',
}

// 事件类型
export enum EventType {
  NODE_CREATED = 'node_created',
  NODE_STATUS_UPDATED = 'node_status_updated',
  EDGE_CREATED = 'edge_created',
  FLOW_COMPLETED = 'flow_completed',
}

// 基础节点数据
export interface FlowNodeData extends Record<string, unknown> {
  id: string
  title: string
  description: string
  status: NodeStatus
  x: number
  y: number
  expanded?: boolean // 节点是否展开显示描述
}

// 连接线数据
export interface FlowEdgeData {
  id: string
  source: string
  target: string
  animated?: boolean
}

// EventStream 事件接口
export interface NodeCreatedEvent {
  type: EventType.NODE_CREATED
  data: FlowNodeData
}

export interface NodeStatusUpdatedEvent {
  type: EventType.NODE_STATUS_UPDATED
  data: {
    nodeId: string
    status: NodeStatus
  }
}

export interface EdgeCreatedEvent {
  type: EventType.EDGE_CREATED
  data: FlowEdgeData
}

export interface FlowCompletedEvent {
  type: EventType.FLOW_COMPLETED
  data: {
    message: string
  }
}

// 联合类型
export type StreamEvent =
  | NodeCreatedEvent
  | NodeStatusUpdatedEvent
  | EdgeCreatedEvent
  | FlowCompletedEvent

// ReactFlow 节点类型扩展自 Node
export interface ReactFlowNode extends Node {
  data: FlowNodeData
}

// ReactFlow 边类型扩展自 Edge
export interface ReactFlowEdge extends Edge {
  animated?: boolean
}

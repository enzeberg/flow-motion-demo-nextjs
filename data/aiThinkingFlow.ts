import { NodeStatus, EventType } from '../types/flow'

// AI思考流程的模拟数据
export const aiThinkingFlowData = [
  {
    id: 'init',
    type: EventType.NODE_CREATED,
    timestamp: 0,
    data: {
      id: 'init-node',
      title: 'MetaSOTA Deep Research v0.3.1',
      description: '模型加载成功，准备开始思考',
      status: NodeStatus.SUCCESS,
      x: 400,
      y: 50,
    },
  },
  {
    id: 'session-start',
    type: EventType.NODE_CREATED,
    timestamp: 1000,
    data: {
      id: 'session-node',
      title: '会话创建',
      description: '分析外卖大战研究需求',
      status: NodeStatus.PENDING,
      x: 400,
      y: 200,
    },
  },
  {
    id: 'connection-1',
    type: EventType.EDGE_CREATED,
    timestamp: 1200,
    data: {
      id: 'edge-init-session',
      source: 'init-node',
      target: 'session-node',
      animated: true,
    },
  },
  {
    id: 'session-update-1',
    type: EventType.NODE_STATUS_UPDATED,
    timestamp: 1500,
    data: {
      nodeId: 'session-node',
      status: NodeStatus.RUNNING,
    },
  },
  {
    id: 'thinking-start',
    type: EventType.NODE_CREATED,
    timestamp: 2000,
    data: {
      id: 'thinking-node',
      title: '深度思考中...',
      description: '正在分析外卖行业十年发展历程',
      status: NodeStatus.PENDING,
      x: 200,
      y: 350,
    },
  },
  {
    id: 'connection-2',
    type: EventType.EDGE_CREATED,
    timestamp: 2200,
    data: {
      id: 'edge-session-thinking',
      source: 'session-node',
      target: 'thinking-node',
      animated: true,
    },
  },
  {
    id: 'thinking-update-1',
    type: EventType.NODE_STATUS_UPDATED,
    timestamp: 2500,
    data: {
      nodeId: 'thinking-node',
      status: NodeStatus.RUNNING,
    },
  },
  {
    id: 'analysis-1',
    type: EventType.NODE_CREATED,
    timestamp: 3500,
    data: {
      id: 'analysis-history',
      title: '历史背景分析',
      description: '2015年移动互联网补贴大战回顾',
      status: NodeStatus.PENDING,
      x: 100,
      y: 500,
    },
  },
  {
    id: 'analysis-2',
    type: EventType.NODE_CREATED,
    timestamp: 4000,
    data: {
      id: 'analysis-current',
      title: '当前格局分析',
      description: '京东、美团、淘宝三家外卖策略',
      status: NodeStatus.PENDING,
      x: 300,
      y: 500,
    },
  },
  {
    id: 'connection-3',
    type: EventType.EDGE_CREATED,
    timestamp: 4200,
    data: {
      id: 'edge-thinking-history',
      source: 'thinking-node',
      target: 'analysis-history',
      animated: true,
    },
  },
  {
    id: 'connection-4',
    type: EventType.EDGE_CREATED,
    timestamp: 4400,
    data: {
      id: 'edge-thinking-current',
      source: 'thinking-node',
      target: 'analysis-current',
      animated: true,
    },
  },
  {
    id: 'history-update',
    type: EventType.NODE_STATUS_UPDATED,
    timestamp: 5000,
    data: {
      nodeId: 'analysis-history',
      status: NodeStatus.RUNNING,
    },
  },
  {
    id: 'data-collection',
    type: EventType.NODE_CREATED,
    timestamp: 6000,
    data: {
      id: 'data-node',
      title: '数据收集',
      description: '收集补贴金额、用户增长、市场份额数据',
      status: NodeStatus.PENDING,
      x: 600,
      y: 350,
    },
  },
  {
    id: 'connection-5',
    type: EventType.EDGE_CREATED,
    timestamp: 6200,
    data: {
      id: 'edge-session-data',
      source: 'session-node',
      target: 'data-node',
      animated: true,
    },
  },
  {
    id: 'data-update',
    type: EventType.NODE_STATUS_UPDATED,
    timestamp: 6500,
    data: {
      nodeId: 'data-node',
      status: NodeStatus.RUNNING,
    },
  },
  {
    id: 'strategy-analysis',
    type: EventType.NODE_CREATED,
    timestamp: 7500,
    data: {
      id: 'strategy-node',
      title: '战略分析',
      description: '三家平台竞争策略深度解析',
      status: NodeStatus.PENDING,
      x: 700,
      y: 500,
    },
  },
  {
    id: 'connection-6',
    type: EventType.EDGE_CREATED,
    timestamp: 7700,
    data: {
      id: 'edge-data-strategy',
      source: 'data-node',
      target: 'strategy-node',
      animated: true,
    },
  },
  {
    id: 'trend-prediction',
    type: EventType.NODE_CREATED,
    timestamp: 8500,
    data: {
      id: 'trend-node',
      title: '趋势预测',
      description: '补贴持续性与未来发展预测',
      status: NodeStatus.PENDING,
      x: 500,
      y: 650,
    },
  },
  {
    id: 'connection-7',
    type: EventType.EDGE_CREATED,
    timestamp: 8700,
    data: {
      id: 'edge-history-trend',
      source: 'analysis-history',
      target: 'trend-node',
      animated: true,
    },
  },
  {
    id: 'connection-8',
    type: EventType.EDGE_CREATED,
    timestamp: 8900,
    data: {
      id: 'edge-current-trend',
      source: 'analysis-current',
      target: 'trend-node',
      animated: true,
    },
  },
  {
    id: 'connection-9',
    type: EventType.EDGE_CREATED,
    timestamp: 9100,
    data: {
      id: 'edge-strategy-trend',
      source: 'strategy-node',
      target: 'trend-node',
      animated: true,
    },
  },
  {
    id: 'complete-history',
    type: EventType.NODE_STATUS_UPDATED,
    timestamp: 9500,
    data: {
      nodeId: 'analysis-history',
      status: NodeStatus.SUCCESS,
    },
  },
  {
    id: 'complete-current',
    type: EventType.NODE_STATUS_UPDATED,
    timestamp: 10000,
    data: {
      nodeId: 'analysis-current',
      status: NodeStatus.SUCCESS,
    },
  },
  {
    id: 'complete-data',
    type: EventType.NODE_STATUS_UPDATED,
    timestamp: 10500,
    data: {
      nodeId: 'data-node',
      status: NodeStatus.SUCCESS,
    },
  },
  {
    id: 'complete-strategy',
    type: EventType.NODE_STATUS_UPDATED,
    timestamp: 11000,
    data: {
      nodeId: 'strategy-node',
      status: NodeStatus.SUCCESS,
    },
  },
  {
    id: 'trend-running',
    type: EventType.NODE_STATUS_UPDATED,
    timestamp: 11500,
    data: {
      nodeId: 'trend-node',
      status: NodeStatus.RUNNING,
    },
  },
  {
    id: 'report-generation',
    type: EventType.NODE_CREATED,
    timestamp: 12000,
    data: {
      id: 'report-node',
      title: '报告生成',
      description: '生成2万字深度研究报告',
      status: NodeStatus.PENDING,
      x: 400,
      y: 800,
    },
  },
  {
    id: 'connection-10',
    type: EventType.EDGE_CREATED,
    timestamp: 12200,
    data: {
      id: 'edge-trend-report',
      source: 'trend-node',
      target: 'report-node',
      animated: true,
    },
  },
  {
    id: 'complete-trend',
    type: EventType.NODE_STATUS_UPDATED,
    timestamp: 13000,
    data: {
      nodeId: 'trend-node',
      status: NodeStatus.SUCCESS,
    },
  },
  {
    id: 'complete-thinking',
    type: EventType.NODE_STATUS_UPDATED,
    timestamp: 13200,
    data: {
      nodeId: 'thinking-node',
      status: NodeStatus.SUCCESS,
    },
  },
  {
    id: 'complete-session',
    type: EventType.NODE_STATUS_UPDATED,
    timestamp: 13400,
    data: {
      nodeId: 'session-node',
      status: NodeStatus.SUCCESS,
    },
  },
  {
    id: 'report-running',
    type: EventType.NODE_STATUS_UPDATED,
    timestamp: 13500,
    data: {
      nodeId: 'report-node',
      status: NodeStatus.RUNNING,
    },
  },
  {
    id: 'complete-report',
    type: EventType.NODE_STATUS_UPDATED,
    timestamp: 15000,
    data: {
      nodeId: 'report-node',
      status: NodeStatus.SUCCESS,
    },
  },
  {
    id: 'flow-complete',
    type: EventType.FLOW_COMPLETED,
    timestamp: 15500,
    data: {
      message: 'AI思考流程完成！外卖大战深度报告已生成',
    },
  },
]

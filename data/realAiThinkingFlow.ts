import { NodeStatus, EventType } from '../types/flow'

// 基于真实AI思考数据的流程模拟
export const realAiThinkingFlowData = [
  {
    id: 'init',
    type: EventType.NODE_CREATED,
    timestamp: 0,
    data: {
      id: 'init-node',
      title: 'MetaSOTA Deep Research v0.3.1',
      description: 'Model loaded successfully.',
      status: NodeStatus.SUCCESS,
      x: 100,
      y: 300,
    },
  },
  {
    id: 'session-start',
    type: EventType.NODE_CREATED,
    timestamp: 1000,
    data: {
      id: 'session-node',
      title: '会话创建',
      description: '外卖大战研究：京东美团淘宝三家混战分析',
      status: NodeStatus.PENDING,
      x: 450,
      y: 300,
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
      title: 'MetaAI.Thinking()',
      description: '正在思考外卖大战十年：三巨头战略与未来趋势分析',
      status: NodeStatus.PENDING,
      x: 700,
      y: 50,
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
    id: 'deep-analysis',
    type: EventType.NODE_CREATED,
    timestamp: 3500,
    data: {
      id: 'analysis-node',
      title: '深度分析启动',
      description: '数据缺失与现状分析 - 2025年外卖补贴大战深度分析',
      status: NodeStatus.PENDING,
      x: 1050,
      y: 50,
    },
  },
  {
    id: 'connection-3',
    type: EventType.EDGE_CREATED,
    timestamp: 3700,
    data: {
      id: 'edge-thinking-analysis',
      source: 'thinking-node',
      target: 'analysis-node',
      animated: true,
    },
  },
  {
    id: 'query-generation',
    type: EventType.NODE_CREATED,
    timestamp: 4500,
    data: {
      id: 'query-node',
      title: 'MetaAI.Ask()',
      description:
        '京东、美团和饿了么在2025年外卖补贴大战中的具体补贴金额、用户增长数据和市场份额变化情况',
      status: NodeStatus.PENDING,
      x: 700,
      y: 450,
    },
  },
  {
    id: 'connection-4',
    type: EventType.EDGE_CREATED,
    timestamp: 4700,
    data: {
      id: 'edge-session-query',
      source: 'session-node',
      target: 'query-node',
      animated: true,
    },
  },
  {
    id: 'analysis-update',
    type: EventType.NODE_STATUS_UPDATED,
    timestamp: 5000,
    data: {
      nodeId: 'analysis-node',
      status: NodeStatus.RUNNING,
    },
  },
  {
    id: 'historical-analysis',
    type: EventType.NODE_CREATED,
    timestamp: 6000,
    data: {
      id: 'history-node',
      title: '历史背景回顾',
      description: '2015年移动互联网补贴大战 - 历史数据与案例分析',
      status: NodeStatus.PENDING,
      x: 1400,
      y: 50,
    },
  },
  {
    id: 'connection-5',
    type: EventType.EDGE_CREATED,
    timestamp: 6200,
    data: {
      id: 'edge-analysis-history',
      source: 'analysis-node',
      target: 'history-node',
      animated: true,
    },
  },
  {
    id: 'current-strategy',
    type: EventType.NODE_CREATED,
    timestamp: 7000,
    data: {
      id: 'strategy-node',
      title: '当前竞争策略',
      description: '京东、美团、淘宝三家外卖的布局与发展策略分析',
      status: NodeStatus.PENDING,
      x: 1300,
      y: 450,
    },
  },
  {
    id: 'connection-6',
    type: EventType.EDGE_CREATED,
    timestamp: 7200,
    data: {
      id: 'edge-query-strategy',
      source: 'query-node',
      target: 'strategy-node',
      animated: true,
    },
  },
  {
    id: 'query-update',
    type: EventType.NODE_STATUS_UPDATED,
    timestamp: 7500,
    data: {
      nodeId: 'query-node',
      status: NodeStatus.RUNNING,
    },
  },
  {
    id: 'data-collection',
    type: EventType.NODE_CREATED,
    timestamp: 8500,
    data: {
      id: 'data-node',
      title: '数据收集分析',
      description: '补贴金额、用户增长、市场份额数据收集与分析',
      status: NodeStatus.PENDING,
      x: 1650,
      y: 300,
    },
  },
  {
    id: 'connection-7',
    type: EventType.EDGE_CREATED,
    timestamp: 8700,
    data: {
      id: 'edge-history-data',
      source: 'history-node',
      target: 'data-node',
      animated: true,
    },
  },
  {
    id: 'connection-8',
    type: EventType.EDGE_CREATED,
    timestamp: 8900,
    data: {
      id: 'edge-strategy-data',
      source: 'strategy-node',
      target: 'data-node',
      animated: true,
    },
  },
  {
    id: 'history-update',
    type: EventType.NODE_STATUS_UPDATED,
    timestamp: 9500,
    data: {
      nodeId: 'history-node',
      status: NodeStatus.SUCCESS,
    },
  },
  {
    id: 'strategy-update',
    type: EventType.NODE_STATUS_UPDATED,
    timestamp: 10000,
    data: {
      nodeId: 'strategy-node',
      status: NodeStatus.SUCCESS,
    },
  },
  {
    id: 'trend-prediction',
    type: EventType.NODE_CREATED,
    timestamp: 11000,
    data: {
      id: 'trend-node',
      title: '未来趋势预测',
      description: '针对用户的补贴持续性分析与未来补贴形式预测',
      status: NodeStatus.PENDING,
      x: 1980,
      y: 300,
    },
  },
  {
    id: 'connection-9',
    type: EventType.EDGE_CREATED,
    timestamp: 11200,
    data: {
      id: 'edge-data-trend',
      source: 'data-node',
      target: 'trend-node',
      animated: true,
    },
  },
  {
    id: 'data-update',
    type: EventType.NODE_STATUS_UPDATED,
    timestamp: 12000,
    data: {
      nodeId: 'data-node',
      status: NodeStatus.SUCCESS,
    },
  },
  {
    id: 'report-generation',
    type: EventType.NODE_CREATED,
    timestamp: 13000,
    data: {
      id: 'report-node',
      title: '深度报告生成',
      description: '生成2万字外卖大战深度研究报告 - 塔子老师',
      status: NodeStatus.PENDING,
      x: 2300,
      y: 300,
    },
  },
  {
    id: 'connection-10',
    type: EventType.EDGE_CREATED,
    timestamp: 13200,
    data: {
      id: 'edge-trend-report',
      source: 'trend-node',
      target: 'report-node',
      animated: true,
    },
  },
  {
    id: 'analysis-complete',
    type: EventType.NODE_STATUS_UPDATED,
    timestamp: 14000,
    data: {
      nodeId: 'analysis-node',
      status: NodeStatus.SUCCESS,
    },
  },
  {
    id: 'thinking-complete',
    type: EventType.NODE_STATUS_UPDATED,
    timestamp: 14200,
    data: {
      nodeId: 'thinking-node',
      status: NodeStatus.SUCCESS,
    },
  },
  {
    id: 'query-complete',
    type: EventType.NODE_STATUS_UPDATED,
    timestamp: 14400,
    data: {
      nodeId: 'query-node',
      status: NodeStatus.SUCCESS,
    },
  },
  {
    id: 'trend-running',
    type: EventType.NODE_STATUS_UPDATED,
    timestamp: 14500,
    data: {
      nodeId: 'trend-node',
      status: NodeStatus.RUNNING,
    },
  },
  {
    id: 'session-complete',
    type: EventType.NODE_STATUS_UPDATED,
    timestamp: 15000,
    data: {
      nodeId: 'session-node',
      status: NodeStatus.SUCCESS,
    },
  },
  {
    id: 'trend-complete',
    type: EventType.NODE_STATUS_UPDATED,
    timestamp: 16000,
    data: {
      nodeId: 'trend-node',
      status: NodeStatus.SUCCESS,
    },
  },
  {
    id: 'report-running',
    type: EventType.NODE_STATUS_UPDATED,
    timestamp: 16500,
    data: {
      nodeId: 'report-node',
      status: NodeStatus.RUNNING,
    },
  },
  {
    id: 'report-complete',
    type: EventType.NODE_STATUS_UPDATED,
    timestamp: 18000,
    data: {
      nodeId: 'report-node',
      status: NodeStatus.SUCCESS,
    },
  },
  {
    id: 'flow-complete',
    type: EventType.FLOW_COMPLETED,
    timestamp: 18500,
    data: {
      message: 'AI深度思考完成！外卖大战研究报告已生成 - 感谢塔子老师的提问',
    },
  },
]

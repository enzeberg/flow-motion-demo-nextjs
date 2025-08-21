import { getBezierPath, type EdgeProps, Position } from '@xyflow/react'

const AnimatedEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
}: EdgeProps) => {
  // 计算调整后的连接点，确保连线不穿透节点
  const nodeWidth = 200
  const handleRadius = 6

  let adjustedSourceX = sourceX
  const adjustedSourceY = sourceY
  let adjustedTargetX = targetX
  const adjustedTargetY = targetY

  // 调整源节点连接点
  if (sourcePosition === Position.Right) {
    adjustedSourceX = sourceX + nodeWidth / 2 - handleRadius
  } else if (sourcePosition === Position.Left) {
    adjustedSourceX = sourceX - nodeWidth / 2 + handleRadius
  }

  // 调整目标节点连接点
  if (targetPosition === Position.Left) {
    adjustedTargetX = targetX - nodeWidth / 2 + handleRadius
  } else if (targetPosition === Position.Right) {
    adjustedTargetX = targetX + nodeWidth / 2 - handleRadius
  }

  const [edgePath] = getBezierPath({
    sourceX: adjustedSourceX,
    sourceY: adjustedSourceY,
    sourcePosition,
    targetX: adjustedTargetX,
    targetY: adjustedTargetY,
    targetPosition,
  })

  return (
    <g>
      {/* 背景路径 */}
      <path
        d={edgePath}
        style={{
          stroke: 'rgba(24, 144, 255, 0.1)',
          strokeWidth: 6,
          fill: 'none',
          pointerEvents: 'none',
        }}
      />

      {/* 主路径 */}
      <path
        id={id}
        d={edgePath}
        style={{
          ...style,
          stroke: '#1890ff',
          strokeWidth: 2,
          strokeDasharray: '5,5',
          fill: 'none',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }}
      />

      {/* 动画路径 */}
      <path
        d={edgePath}
        style={{
          stroke: '#1890ff',
          strokeWidth: 2,
          strokeDasharray: '5,5',
          fill: 'none',
          strokeLinecap: 'round',
          opacity: 0.6,
        }}
      >
        <animate
          attributeName="stroke-dashoffset"
          values="0;-10"
          dur="1s"
          repeatCount="indefinite"
        />
      </path>
    </g>
  )
}

export default AnimatedEdge

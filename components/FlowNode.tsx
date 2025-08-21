import { useState } from 'react'
import { Handle, Position } from '@xyflow/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle,
  Loader2,
  XCircle,
  Clock,
  ChevronRight,
} from 'lucide-react'
import { NodeStatus, type FlowNodeData } from '../types/flow'

interface FlowNodeProps {
  data: FlowNodeData
}

function FlowNode({ data }: FlowNodeProps) {
  const [isExpanded, setIsExpanded] = useState(data.expanded || false)

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const getStatusIcon = (status: NodeStatus) => {
    switch (status) {
      case NodeStatus.PENDING:
        return <Clock className="w-4 h-4 text-muted-foreground" />
      case NodeStatus.RUNNING:
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
      case NodeStatus.SUCCESS:
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case NodeStatus.FAILED:
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: NodeStatus) => {
    switch (status) {
      case NodeStatus.PENDING:
        return 'hsl(var(--muted))'
      case NodeStatus.RUNNING:
        return '#e6f7ff'
      case NodeStatus.SUCCESS:
        return '#f6ffed'
      case NodeStatus.FAILED:
        return '#fff2f0'
      default:
        return 'hsl(var(--muted))'
    }
  }

  const getBorderColor = (status: NodeStatus) => {
    switch (status) {
      case NodeStatus.PENDING:
        return 'hsl(var(--border))'
      case NodeStatus.RUNNING:
        return '#1890ff'
      case NodeStatus.SUCCESS:
        return '#52c41a'
      case NodeStatus.FAILED:
        return '#ff4d4f'
      default:
        return 'hsl(var(--border))'
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
          duration: 0.5,
        }}
        className="flow-node"
        style={{
          backgroundColor: getStatusColor(data.status),
          borderColor: getBorderColor(data.status),
          borderWidth: '2px',
          borderStyle: 'solid',
          borderRadius: '8px',
          padding: '16px',
          minWidth: '200px',
          width: '200px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'relative',
          cursor: 'pointer',
          zIndex: 10,
        }}
        onClick={toggleExpanded}
      >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: getBorderColor(data.status),
          width: '12px',
          height: '12px',
          border: '2px solid white',
          borderRadius: '50%',
          zIndex: 15,
          left: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: isExpanded ? '8px' : '0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {getStatusIcon(data.status)}
          <h3
            style={{
              margin: '0 0 0 8px',
              fontSize: '14px',
              fontWeight: 'bold',
              color: 'hsl(var(--foreground))',
            }}
          >
            {data.title}
          </h3>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-muted-foreground ml-2"
        >
          <ChevronRight className="w-3 h-3" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p
              style={{
                margin: 0,
                fontSize: '12px',
                color: 'hsl(var(--muted-foreground))',
                lineHeight: '1.4',
                paddingTop: '8px',
                borderTop: '1px solid hsl(var(--border))',
              }}
            >
              {data.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {data.status === NodeStatus.RUNNING && (
        <motion.div
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(24, 144, 255, 0.7)',
              '0 0 0 10px rgba(24, 144, 255, 0)',
              '0 0 0 0 rgba(24, 144, 255, 0)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '8px',
            pointerEvents: 'none',
          }}
        />
      )}

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: getBorderColor(data.status),
          width: '12px',
          height: '12px',
          border: '2px solid white',
          borderRadius: '50%',
          zIndex: 15,
          right: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
      </motion.div>
    </div>
  )
}

export default FlowNode

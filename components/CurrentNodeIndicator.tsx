import { motion, AnimatePresence } from 'framer-motion'

interface CurrentNodeIndicatorProps {
  currentNodeId: string | null
}

export default function CurrentNodeIndicator({
  currentNodeId,
}: CurrentNodeIndicatorProps) {
  return (
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
  )
}

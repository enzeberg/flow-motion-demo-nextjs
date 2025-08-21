import { realAiThinkingFlowData } from '@/data/realAiThinkingFlow'

export async function GET() {
  const encoder = new TextEncoder()

  const customReadable = new ReadableStream({
    start(controller) {
      let index = 0
      let timeoutId: NodeJS.Timeout | null = null
      let isCancelled = false

      const sendEvent = () => {
        if (isCancelled || index >= realAiThinkingFlowData.length) {
          if (!isCancelled) {
            // 发送结束信号
            try {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'))
              controller.close()
            } catch (error) {
              console.log('Controller already closed')
            }
          }
          return
        }

        const item = realAiThinkingFlowData[index]
        const delay =
          index === 0
            ? item.timestamp
            : item.timestamp - realAiThinkingFlowData[index - 1].timestamp

        timeoutId = setTimeout(() => {
          if (isCancelled) return

          try {
            const data = `data: ${JSON.stringify(item)}\n\n`
            controller.enqueue(encoder.encode(data))

            index++
            sendEvent()
          } catch (error) {
            if (!isCancelled) {
              console.error('Error sending event:', error)
            }
          }
        }, delay)
      }

      // 发送初始连接确认
      try {
        controller.enqueue(encoder.encode('data: {"type":"connected"}\n\n'))

        // 开始发送事件
        timeoutId = setTimeout(() => {
          sendEvent()
        }, 100)
      } catch (error) {
        console.error('Error starting stream:', error)
      }

      // 清理函数
      return () => {
        isCancelled = true
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
      }
    },

    cancel() {
      console.log('Stream cancelled by client')
    },
  })

  return new Response(customReadable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  })
}

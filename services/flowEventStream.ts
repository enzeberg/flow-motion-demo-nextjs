import { type StreamEvent } from '../types/flow'

export class FlowEventStreamService {
  private eventSource: EventSource | null = null
  private isManualStop = false

  // 创建 EventStream - 使用 Server-Sent Events
  async createEventStream(
    onEvent: (event: StreamEvent) => void
  ): Promise<void> {
    // 如果已经有连接，先关闭
    this.stopStream()
    this.isManualStop = false

    try {
      this.eventSource = new EventSource('/api/flow-stream')

      this.eventSource.onopen = () => {
        console.log('EventSource connected successfully')
      }

      this.eventSource.onmessage = (event) => {
        try {
          // 忽略连接确认和结束信号
          if (
            event.data === '{"type":"connected"}' ||
            event.data === '[DONE]'
          ) {
            if (event.data === '[DONE]') {
              console.log('Stream completed normally')
              this.stopStream()
            }
            return
          }

          const streamEvent = JSON.parse(event.data) as StreamEvent
          onEvent(streamEvent)
        } catch (error) {
          console.error(
            'Failed to parse SSE data:',
            error,
            'Raw data:',
            event.data
          )
        }
      }

      this.eventSource.onerror = (error) => {
        console.error('EventSource error:', error)

        // 只有在非手动停止的情况下才记录错误
        if (!this.isManualStop) {
          console.log('EventSource connection failed or interrupted')
        }

        // 不再自动重连，避免无限循环
        this.stopStream()
      }
    } catch (error) {
      console.error('EventStream initialization error:', error)
      throw error
    }
  }

  // 停止流
  stopStream(): void {
    this.isManualStop = true
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }
  }
}

'use client'


import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

function MessageExample() {
  const showMessage = (type: 'success' | 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'success':
        toast.success('操作成功！')
        break
      case 'error':
        toast.error('操作失败！')
        break
      case 'warning':
        toast.warning('警告信息！')
        break
      case 'info':
        toast.info('提示信息！')
        break
    }
  }

  const showNotification = () => {
    toast('通知标题', {
      description: '这是一个通知消息的详细描述。',
      position: 'top-right',
    })
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => showMessage('success')}>成功消息</Button>
      <Button onClick={() => showMessage('error')} variant="destructive">
        错误消息
      </Button>
      <Button onClick={() => showMessage('warning')} variant="outline">
        警告消息
      </Button>
      <Button onClick={() => showMessage('info')} variant="secondary">
        信息消息
      </Button>
      <Button onClick={showNotification} variant="outline">
        显示通知
      </Button>
    </div>
  )
}

export default MessageExample

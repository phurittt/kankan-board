export interface Notification {
  id: string
  recipientUserId: string
  type: 'task-assigned'
  message: string
  taskId?: string
  boardId?: string
  read: boolean
  createdAt: string
}


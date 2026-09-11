export interface Task {
  id: string
  columnId: string
  boardId: string
  title: string
  description?: string
  done: boolean
  tagIds: string[]
  assigneeIds: string[]
  dueDate: string | null
  dueTime: string | null
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Tag {
  id: string
  boardId: string
  label: string
  color: string
}
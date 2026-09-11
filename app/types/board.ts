export interface Board {
  id: string
  name: string
  ownerId: string
  color: string
  memberIds: string[]
  columnIds: string[]
  createdAt: string
  lastEditedAt: string
}

export interface Column {
  id: string
  boardId: string
  name: string
  color: string
  taskIds: string[]
}
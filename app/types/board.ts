export interface Board {
  id: string
  name: string
  ownerId: string
  memberIds: string[]
  columnIds: string[]
  createAt: string
}

export interface Column {
  id: string
  board: string
  name: string
  taskIds: string[]
}
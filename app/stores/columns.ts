import { defineStore } from 'pinia'
import type { Column } from '~/types/board'

export const useColumnsStore = defineStore('columns', () => {
  const columns = ref<Column[]>(readStorage<Column[]>('kanban:columns', []))

  watch(columns, (value) => {
    writeStorage('kanban:columns', value)
  }, { deep: true })

  function getColumnById(id: string) {
    return columns.value.find((c) => c.id === id)
  }

  function columnsForBoard(boardId: string) {
    const boardsStore = useBoardsStore()
    const board = boardsStore.getBoardById(boardId)
    if (!board) return []

    return board.columnIds
      .map((id) => getColumnById(id))
      .filter((c): c is Column => c !== undefined)
  }

  function createColumn(boardId: string, name: string) {
    const boardsStore = useBoardsStore()
    const board = boardsStore.getBoardById(boardId)
    if (!board) return

    const newColumn: Column = {
      id: crypto.randomUUID(),
      boardId,
      name,
      color: '#e5e7eb',
      taskIds: [],
    }
    columns.value.push(newColumn)
    board.columnIds.push(newColumn.id)
    return newColumn
  }

  function renameColumn(id: string, name: string) {
    const column = getColumnById(id)
    if (column) column.name = name
  }

  function setColumnColor(id: string, color: string) {
    const column = getColumnById(id)
    if (column) column.color = color
  }

  function reorderColumn(boardId: string, columnId: string, newIndex: number) {
    const boardsStore = useBoardsStore()
    const board = boardsStore.getBoardById(boardId)
    if (!board) return

    const currentIndex = board.columnIds.indexOf(columnId)
    if (currentIndex === -1) return

    board.columnIds.splice(currentIndex, 1)
    board.columnIds.splice(newIndex, 0, columnId)
  }

  function deleteColumn(id: string) {
  const column = getColumnById(id)
  if (!column) return

  const boardsStore = useBoardsStore()
  const board = boardsStore.getBoardById(column.boardId)
  if (board) {
    board.columnIds = board.columnIds.filter((cid) => cid !== id)
  }

  const tasksStore = useTasksStore()
  for (const taskId of column.taskIds) {
    tasksStore.deleteTask(taskId)
  }

  columns.value = columns.value.filter((c) => c.id !== id)
}


  return {
    columns,
    getColumnById,
    columnsForBoard,
    createColumn,
    renameColumn,
    setColumnColor,
    reorderColumn,
    deleteColumn,
  }
})

import { defineStore } from 'pinia'
import type { Board } from '~/types/board'

export const useBoardsStore = defineStore('boards', () => {
  const boards = ref<Board[]>(readStorage<Board[]>('kanban:boards', []))

  watch(boards, (value) => {
    writeStorage('kanban:boards', value)
  }, { deep: true })

  const authStore = useAuthStore()

  const boardsForCurrentUser = computed(() => {
    const userId = authStore.currentUserId
    if (!userId) return [] // ้ายังไม่ได้ login (currentUserId = null) จะส่ง arrey เปล่าๆ
    return boards.value.filter((b) => b.memberIds.includes(userId))
  })

  function getBoardById(id: string) {
    return boards.value.find((b) => b.id === id)
  }

  function createBoard(name: string) {
    const userId = authStore.currentUserId
    if (!userId) return
    
    const newBoard: Board = {
      id: crypto.randomUUID(),
      name,
      ownerId: userId,
      memberIds: [userId],
      columnIds: [],
      createdAt: new Date().toISOString(),
    }
    boards.value.push(newBoard)
    return newBoard
  }

  function renameBoard(id: string, name: string) {
    const board = getBoardById(id)
    if (board) board.name = name
  }

  function deleteBoard(id: string) {
    boards.value = boards.value.filter((b) => b.id !== id)
  }

  return { boards, boardsForCurrentUser, getBoardById, createBoard, renameBoard, deleteBoard }
})
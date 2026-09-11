import { defineStore } from 'pinia'
import type { Board } from '~/types/board'

export const useBoardsStore = defineStore('boards', () => {
  const boards = ref<Board[]>(readStorage<Board[]>('kanban:boards', []))

  watch(boards, (value) => {
    writeStorage('kanban:boards', value)
  }, { deep: true })

  const authStore = useAuthStore()
  const userStore = useUserStore()

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
    
    const now = new Date().toISOString()
    const newBoard: Board = {
      id: crypto.randomUUID(),
      name,
      color: '#3b82f6',
      ownerId: userId,
      memberIds: [userId],
      columnIds: [],
      createdAt: now,
      lastEditedAt: now,
    }
    boards.value.push(newBoard)
    return newBoard
  }

  function renameBoard(id: string, name: string) {
    const board = getBoardById(id)
    if (board) board.name = name
  }

  function setBoardColor(id: string, color: string) {
    const board = getBoardById(id)
    if (board) board.color = color
  }

  function addMemberByUsername(boardId: string, username: string): { success: boolean, message: string} {
    const board = getBoardById(boardId)
    if (!board) return { success: false, message: 'ไม่พบบอร์ด' }

    const user = userStore.findByUsername(username)
    if (!user) return { success: false, message: 'ไม่พบ username นี้' }

    if (board.memberIds.includes(user.id)) {
      return { success: false, message: 'เป็นสมาชิกอยู่แล้ว' } 
    }

    board.memberIds.push(user.id)
    return { success: true, message: `เพิ่ม ${user.displayName} แล้ว` }
  }

  function touchBoard(id: string) {
    const board = getBoardById(id)
    if (board) board.lastEditedAt = new Date().toISOString()
  }

  function deleteBoard(id: string) {
    boards.value = boards.value.filter((b) => b.id !== id)
  }

  function removeMember(boardId: string, userId: string) {
    const board = getBoardById(boardId)
    if (!board || userId === board.ownerId) return

    board.memberIds = board.memberIds.filter((id) => id !== userId)

    const tasksStore = useTasksStore()
    for (const task of tasksStore.tasks) {
      if (task.boardId === boardId && task.assigneeIds.includes(userId)) {
        tasksStore.unassignMember(task.id, userId)
      }
    }
  }

  return { boards, boardsForCurrentUser, getBoardById, createBoard, renameBoard, deleteBoard, setBoardColor, addMemberByUsername, removeMember, touchBoard }
})
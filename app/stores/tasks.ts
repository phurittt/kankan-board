import { defineStore } from 'pinia'
import type { Task, Tag } from '~/types/task'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>(readStorage<Task[]>('kanban:tasks', []))
  const tags = ref<Tag[]>(readStorage<Tag[]>('kanban:tags', []))

  watch(tasks, (value) => {
    writeStorage('kanban:tasks', value)
  }, { deep: true })

  watch(tags, (value) => {
    writeStorage('kanban:tags', value)
  }, { deep: true })

  function getTaskById(id: string) {
    return tasks.value.find((t) => t.id === id)
  }

  function tasksForColumn(columnId: string) {
    const columnsStore = useColumnsStore()
    const column = columnsStore.getColumnById(columnId)
    if (!column) return []

    return column.taskIds
      .map((id) => getTaskById(id))
      .filter((t): t is Task => t !== undefined)
  }

  function tagsForBoard(boardId: string) {
    return tags.value.filter((t) => t.boardId === boardId)
  }

  function getTagById(id: string) {
    return tags.value.find((t) => t.id === id)
  }

  function createTask(columnId: string, boardId: string, title: string) {
    const columnsStore = useColumnsStore()
    const column = columnsStore.getColumnById(columnId)
    if (!column) return

    const now = new Date().toISOString()
    const newTask: Task = {
      id: crypto.randomUUID(),
      columnId,
      boardId,
      title,
      done: false,
      tagIds: [],
      assigneeIds: [],
      dueDate: null,
      dueTime: null,
      createdAt: now,
      updatedAt: now,
    }
    tasks.value.push(newTask)
    column.taskIds.push(newTask.id)
    return newTask
  }

  function updateTask(id: string, patch: Partial<Task>) {
    const task = getTaskById(id)
    if (!task) return
    Object.assign(task, patch, { updatedAt: new Date().toISOString() })
  }

  function deleteTask(id: string) {
    const task = getTaskById(id)
    if (!task) return

    const columnsStore = useColumnsStore()
    const column = columnsStore.getColumnById(task.columnId)
    if (column) {
      column.taskIds = column.taskIds.filter((tid) => tid !== id)
    }

    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  function moveTask(taskId: string, fromColumnId: string, toColumnId: string, newIndex: number) {
    const columnsStore = useColumnsStore()
    const fromColumn = columnsStore.getColumnById(fromColumnId)
    const toColumn = columnsStore.getColumnById(toColumnId)
    const task = getTaskById(taskId)
    if (!fromColumn || !toColumn || !task) return

    fromColumn.taskIds = fromColumn.taskIds.filter((tid) => tid !== taskId)
    toColumn.taskIds.splice(newIndex, 0, taskId)
    task.columnId = toColumnId
  }

  function createTag(boardId: string, label: string, color: string) {
    const newTag: Tag = {
      id: crypto.randomUUID(),
      boardId,
      label,
      color,
    }
    tags.value.push(newTag)
    return newTag
  }

  function updateTag(id: string, patch: Partial<Tag>) {
    const tag = getTagById(id)
    if (tag) Object.assign(tag, patch)
  }

  function deleteTag(id: string) {
    tags.value = tags.value.filter((t) => t.id !== id)
    for (const task of tasks.value) {
      task.tagIds = task.tagIds.filter((tid) => tid !== id)
    }
  }

  function toggleTag(taskId: string, tagId: string) {
    const task = getTaskById(taskId)
    if (!task) return

    if (task.tagIds.includes(tagId)) {
      task.tagIds = task.tagIds.filter((id) => id !== tagId)
    } else {
      task.tagIds.push(tagId)
    }
  }

  function assignMember(taskId: string, userId: string) {
    const task = getTaskById(taskId)
    if (!task || task.assigneeIds.includes(userId)) return
    task.assigneeIds.push(userId)

    const authStore = useAuthStore()
    if (userId !== authStore.currentUserId) {
      const notificationsStore = useNotificationsStore()
      notificationsStore.push({
        recipientUserId: userId,
        type: 'task-assigned',
        message: `คุณถูกมอบหมายให้ทำ "${task.title}"`,
        taskId: task.id,
        boardId: task.boardId,
      })
    }
  }


  function unassignMember(taskId: string, userId: string) {
    const task = getTaskById(taskId)
    if (!task) return
    task.assigneeIds = task.assigneeIds.filter((id) => id !== userId)
  }

  return {
    tasks,
    tags,
    getTaskById,
    tasksForColumn,
    tagsForBoard,
    getTagById,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    createTag,
    updateTag,
    deleteTag,
    toggleTag,
    assignMember,
    unassignMember,
  }
})

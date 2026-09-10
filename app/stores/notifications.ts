import { defineStore } from 'pinia'
import type { Notification } from '~/types/notification'

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>(readStorage<Notification[]>('kanban:notifications', []))

  watch(notifications, (value) => {
    writeStorage('kanban:notifications', value)
  }, { deep: true})

  //ยังไม่อ่าน
  function unreadForUser(userId: string) {
    return notifications.value.filter((n) => n.recipientUserId === userId && !n.read)
  }

  function allForUser(userId: string) {
    return notifications.value
      .filter((n) => n.recipientUserId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  function push(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) {
    notifications.value.push({
      ...notification,
      id: crypto.randomUUID(),
      read: false,
      createdAt: new Date().toISOString(),
    })
  }

  function markRead(id: string) {
    const notification = notifications.value.find((n) => n.id === id)
    if (notification) notification.read = true
  }

  function markAllRead(userId: string) {
    for (const n of notifications.value) {
      if (n.recipientUserId === userId) n.read = true
    }
  }

  return { notifications, unreadForUser, allForUser, push, markRead, markAllRead }

})


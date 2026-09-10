import { defineStore } from 'pinia'
import { readStorage, writeStorage } from '~/composables/useLocalStorage'
import type { User } from '~/types/user'
import { seedUsers } from '~/utils/seed'

export const useUserStore = defineStore('users', () => {
  const users = ref<User[]>(readStorage<User[]>('kanban:users', seedUsers))

  watch(users, (value) => {
    writeStorage('kanban:users', value)
  }, { deep: true })

  function findByUsername(username: string) {
    return users.value.find((u) => u.username === username)
  }

  function addUser(user: User) {
    users.value.push(user)
  }

  function getUserById(id: string) {
    return users.value.find((u) => u.id === id)
  }

  return { users, findByUsername, addUser, getUserById}
})

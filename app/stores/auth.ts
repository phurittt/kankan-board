import { defineStore } from 'pinia'
import type { User } from '~/types/user'

const AVATAR_COLORS = ['#f97316', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6', '#eab308']

export  const useAuthStore = defineStore('auth', () => {
  const currentUserId = ref<string | null>(readStorage<string | null>('kanban:auth', null))

  watch(currentUserId, (value) => { // value คือค่าใหม่ ถ้า value เปลี่ยน จะเขียนลงใน localStorage
    writeStorage('kanban:auth', value)
  }) 

  const usersStore = useUserStore()

  //หาข้อมูลคนที่ล็อกอินอยู่หรือไม่
  const currentUser = computed(() => {
    if (!currentUserId.value) return null
    return usersStore.getUserById(currentUserId.value) ?? null
  })

  const isLoggedIn = computed(() => currentUserId.value !== null)

  // LOGIN
  function login(username: string, password: string) {
    const user = usersStore.findByUsername(username)
    if (!user) return false // หาว่ามี user ไหม
    if (user.password !== password) return false //เช็ครหัสผ่าน
    currentUserId.value = user.id
    return true
  }

  //LOGOUT
  function logout() {
    currentUserId.value = null
  }

  function register(username: string, displayName: string, password: string) {
    if (usersStore.findByUsername(username)) return false //ถ้าหา username เจอ = ซ้ำ

    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      displayName,
      password,
      color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)] ?? '#f97316',
      createdAt: new Date().toISOString(),
    }
    usersStore.addUser(newUser)
    currentUserId.value = newUser.id
    return true
  }

  return { currentUserId, currentUser, isLoggedIn, login, logout, register }
})
<script setup lang="ts">
const authStore = useAuthStore()
const boardsStore = useBoardsStore()
const route = useRoute()

const isSidebarOpen = ref(true)
const isProfileMenuOpen = ref(false)

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function toggleProfileMenu() {
  isProfileMenuOpen.value = !isProfileMenuOpen.value
  isNotificationsOpen.value = false
}

function handleLogout() {
  isProfileMenuOpen.value = false
  authStore.logout()
  navigateTo('/login')
}

// notifications
const notificationsStore = useNotificationsStore()
const isNotificationsOpen = ref(false)

const unreadCount = computed(() =>
  authStore.currentUserId ? notificationsStore.unreadForUser(authStore.currentUserId).length : 0
)
const myNotifications = computed(() =>
  authStore.currentUserId ? notificationsStore.allForUser(authStore.currentUserId) : []
)

function toggleNotifications() {
  isNotificationsOpen.value = !isNotificationsOpen.value
  isProfileMenuOpen.value = false
}

function handleNotificationClick(notification: { id: string, boardId?: string }) {
  notificationsStore.markRead(notification.id)
  isNotificationsOpen.value = false
  if (notification.boardId) navigateTo(`/boards/${notification.boardId}`)
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (target.closest('[data-header-menu]')) return
  isNotificationsOpen.value = false
  isProfileMenuOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="flex h-screen flex-col bg-gray-50">
    <header class="flex items-center justify-between border-b border-gray-300 bg-white px-4 py-3 shadow-sm">
      <div class="flex items-center gap-3">
        <button class="cursor-pointer text-gray-600 hover:text-gray-900" @click="toggleSidebar">
          ☰
        </button>
        <span class="font-bold text-gray-900">Kanban Board</span>
      </div>

      <div class="flex items-center gap-4">
        <div class="relative" data-header-menu>
          <button
            class="relative cursor-pointer text-xl text-gray-600 hover:text-gray-900"
            title="การแจ้งเตือน"
            @click="toggleNotifications"
          >
            🔔
            <span
              v-if="unreadCount > 0"
              class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white"
            >
              {{ unreadCount }}
            </span>
          </button>

          <div
            v-if="isNotificationsOpen"
            class="absolute right-0 z-10 mt-2 max-h-96 w-72 overflow-y-auto rounded-md bg-white py-1 shadow-lg"
          >
            <p v-if="myNotifications.length === 0" class="px-4 py-3 text-sm text-gray-500">
              ยังไม่มีการแจ้งเตือน
            </p>
            <button
              v-for="n in myNotifications"
              :key="n.id"
              class="block w-full cursor-pointer border-b border-gray-100 px-4 py-2 text-left text-sm hover:bg-gray-50"
              :class="n.read ? 'text-gray-500' : 'bg-blue-50 font-medium text-gray-900'"
              @click="handleNotificationClick(n)"
            >
              {{ n.message }}
            </button>
          </div>
        </div>


        <div class="relative" data-header-menu>
          <button
            class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-200 text-lg hover:bg-gray-300"
            @click="toggleProfileMenu"
          >
            👤
          </button>

          <div
            v-if="isProfileMenuOpen"
            class="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg"
          >
            <p class="border-b border-gray-100 px-4 py-2 text-sm font-medium text-gray-900">
              {{ authStore.currentUser?.displayName }}
            </p>
            <button
              class="block w-full cursor-pointer px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              @click="handleLogout"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <aside v-if="isSidebarOpen" class="w-60 shrink-0 overflow-y-auto border-r border-gray-300 bg-white">
        <nav class="p-2">
          <div class="flex justify-end">
            <button
              class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              @click="toggleSidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
          </div>

          <NuxtLink to="/boards" class="block rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100">
            ทุกบอร์ด
          </NuxtLink>

          <p class="mt-3 px-3 text-xs font-semibold uppercase text-gray-400">
            บอร์ดของฉัน
          </p>

          <NuxtLink
            v-for="board in boardsStore.boardsForCurrentUser"
            :key="board.id"
            :to="`/boards/${board.id}`"
            class="block truncate rounded-md px-3 py-2 text-sm hover:bg-gray-100"
            :class="route.params.boardId === board.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'"
          >
            {{ board.name }}
          </NuxtLink>
        </nav>
      </aside>

      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const boardsStore = useBoardsStore()
const route = useRoute()

const isSidebarOpen = ref(true)
const isBoardsListOpen = ref(true)
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
        <button class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900" @click="toggleSidebar">
          ☰
        </button>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-7 w-7 shrink-0">
          <circle cx="12" cy="12" r="11" fill="black" />
          <rect x="6" y="6.5" width="3.2" height="4.5" rx="0.8" fill="white" />
          <rect x="10.4" y="6.5" width="3.2" height="4.5" rx="0.8" fill="white" />
          <rect x="14.8" y="6.5" width="3.2" height="4.5" rx="0.8" fill="white" />
          <rect x="6" y="13" width="3.2" height="4.5" rx="0.8" fill="white" />
          <rect x="10.4" y="13" width="3.2" height="4.5" rx="0.8" fill="white" />
          <rect x="14.8" y="13" width="3.2" height="4.5" rx="0.8" fill="white" />
        </svg>
        <span class="font-bold text-gray-900">Kanban Board</span>
      </div>

      <div class="flex items-center gap-4">
        <div class="relative" data-header-menu>
          <button
            class="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            title="การแจ้งเตือน"
            @click="toggleNotifications"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            <span
              v-if="unreadCount > 0"
              class="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white"
            >
              {{ unreadCount }}
            </span>
          </button>

          <div
            v-if="isNotificationsOpen"
            class="absolute right-0 z-10 mt-2 max-h-96 w-72 overflow-y-auto rounded-md bg-white py-1 shadow-lg"
          >
            <p class="border-b border-gray-100 px-4 py-2 text-sm font-medium text-gray-900">
              แจ้งเตือน
            </p>
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
            class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md hover:bg-gray-100"
            @click="toggleProfileMenu"
          >
            <span
              class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-white"
              :style="{ backgroundColor: authStore.currentUser?.color }"
            >
              {{ authStore.currentUser?.displayName.charAt(0).toUpperCase() }}
            </span>
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
      <aside v-if="isSidebarOpen" class="w-80 shrink-0 overflow-y-auto border-r border-gray-300 bg-white">
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

          <NuxtLink
            to="/boards"
            class="flex items-center gap-2 rounded-md px-3 py-2 text-base font-bold hover:bg-gray-300"
            :class="route.path === '/boards' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4" :class="route.path === '/boards' ? 'text-blue-700' : 'text-gray-500'">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
            Boards
          </NuxtLink>

          <hr class="my-2 border-gray-200">

          <button
            class="flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm font-bold uppercase text-gray-700 hover:bg-gray-100"
            @click="isBoardsListOpen = !isBoardsListOpen"
          >
            Your Boards
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-5 w-5 transition-transform"
              :class="isBoardsListOpen ? '' : 'rotate-180'"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
            </svg>
          </button>

          <template v-if="isBoardsListOpen">
            <NuxtLink
              v-for="board in boardsStore.boardsForCurrentUser"
              :key="board.id"
              :to="`/boards/${board.id}`"
              class="flex items-center gap-2 rounded-md px-3 py-2 pl-6 text-sm font-medium hover:bg-gray-100"
              :class="route.params.boardId === board.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'"
            >
              <span
                class="h-5 w-5 shrink-0 rounded"
                :style="{ backgroundColor: board.color }"
              />
              <span class="truncate">{{ board.name }}</span>
            </NuxtLink>
          </template>
        </nav>
      </aside>

      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

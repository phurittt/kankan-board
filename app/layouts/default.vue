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
}

function handleLogout() {
  isProfileMenuOpen.value = false
  authStore.logout()
  navigateTo('/login')
}
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
        <button class="cursor-pointer text-xl text-gray-600 hover:text-gray-900" title="การแจ้งเตือน">
          🔔
        </button>

        <div class="relative">
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

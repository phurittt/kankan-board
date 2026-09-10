<script setup lang="ts">
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">
      <span class="font-bold text-gray-900">Kanban Board</span>

      <div class="flex items-center gap-3">
        <span class="text-sm text-gray-600">{{ authStore.currentUser?.displayName }}</span>
        <button
          class="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100"
          @click="handleLogout"
        >
          ออกจากระบบ
        </button>
      </div>
    </header>

    <main>
      <slot />
    </main>
  </div>
</template>
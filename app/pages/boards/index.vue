<script setup lang="ts">
const boardStore = useBoardsStore()

const openMenuBoardId = ref<string | null>(null)
const confirmDeleteBoardId = ref<string | null>(null)
const isCreateBoardOpen = ref(false)
const sortMode = ref('เข้าไปแก้ไขล่าสุด')

const sortedBoards = computed(() => {
  const boards = [...boardStore.boardsForCurrentUser]
  if (sortMode.value === 'สร้างล่าสุด') {
    return boards.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
  if (sortMode.value === 'สร้างเก่าสุด') {
    return boards.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  }
  return boards.sort((a, b) => (b.lastEditedAt ?? b.createdAt).localeCompare(a.lastEditedAt ?? a.createdAt))
})

function closeMenu() {
  openMenuBoardId.value = null
  confirmDeleteBoardId.value = null
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (target.closest('[data-board-menu]')) return
  closeMenu()
  isCreateBoardOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="mx-auto max-w-5xl p-4">
    <h1 class="mb-4 text-xl font-bold">Your Boards</h1>

    <div class="mb-4">
      <SortMenu @change="sortMode = $event" />
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <CreateBoardCard
        :is-open="isCreateBoardOpen"
        @open="isCreateBoardOpen = true"
        @close="isCreateBoardOpen = false"
      />

      <BoardCard
        v-for="board in sortedBoards"
        :key="board.id"
        :board="board"
        :is-menu-open="openMenuBoardId === board.id"
        :is-confirming-delete="confirmDeleteBoardId === board.id"
        @open-menu="openMenuBoardId = board.id"
        @close-menu="closeMenu"
        @request-delete="confirmDeleteBoardId = board.id"
        @cancel-delete="confirmDeleteBoardId = null"
      />
    </div>

    <p v-if="boardStore.boardsForCurrentUser.length === 0" class="text-gray-500">
      ยังไม่มีบอร์ด ลองสร้างอันแรกดูสิ
    </p>
  </div>
</template>

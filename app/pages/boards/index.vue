<script setup lang="ts">
const boardStore = useBoardsStore()

const activeEditor = ref<string | null>(null)
const confirmDeleteBoardId = ref<string | null>(null)
const sortMode = ref('แก้ไขล่าสุด')

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
  activeEditor.value = null
  confirmDeleteBoardId.value = null
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (target.closest('[data-board-menu]')) return
  closeMenu()
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="p-4">
    <h1 class="mb-4 text-xl font-bold">Your Boards</h1>

    <div class="mb-4">
      <SortMenu @change="sortMode = $event" />
    </div>

    <div class="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
      <CreateBoardCard
        :is-open="activeEditor === 'create'"
        @open="activeEditor = 'create'"
        @close="activeEditor = null"
      />

      <BoardCard
        v-for="board in sortedBoards"
        :key="board.id"
        :board="board"
        :is-menu-open="activeEditor === `menu:${board.id}`"
        :is-confirming-delete="confirmDeleteBoardId === board.id"
        @open-menu="activeEditor = `menu:${board.id}`"
        @close-menu="closeMenu"
        @request-delete="confirmDeleteBoardId = board.id"
        @cancel-delete="closeMenu"
      />
    </div>

    <p v-if="boardStore.boardsForCurrentUser.length === 0" class="text-gray-500">
      ยังไม่มีบอร์ด ลองสร้างอันแรกดูสิ
    </p>
  </div>
</template>

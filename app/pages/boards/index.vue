<script setup lang="ts">
const boardStore = useBoardsStore()

const newBoardName = ref('')

function handleCreate() {
  const name = newBoardName.value.trim() //ตัดช่องว่าง 
  if (!name) return
  boardStore.createBoard(name)
  newBoardName.value = ''
}

function handleRename(boardId: string, currentName: string) {
  const name = window.prompt('ชื่อบอร์ดใหม่', currentName)
  if (!name || !name.trim()) return //ถ้ากด Cancel (ได้ null) หรือพิมพ์แต่ช่องว่าง ให้หยุดทันที
  boardStore.renameBoard(boardId, name.trim())
}

function handleDelete(boardId: string) {
  if (!window.confirm('ลบบอร์ดนี้เลยหรือไม่')) return
  boardStore.deleteBoard(boardId)
}
</script>

<template>
  <div class="mx-auto max-w-5xl p-4">
    <h1 class="mb-4 text-xl font-bold">Boards ของฉัน</h1>

    <form class="mb-6 flex gap-2" @submit.prevent="handleCreate">
      <input
        v-model="newBoardName"
        type="text"
        placeholder="ชื่อบอร์ดใหม่"
        class="flex-1 rounded-md border border-gray-300 px-3 py-2"
      >
      <button type="submit" class="rounded-md bg-blue-600 px-4 py-2 text-white">
        สร้างบอร์ด
      </button>
    </form>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="board in boardStore.boardsForCurrentUser"
        :key="board.id"
        class="rounded-lg border bg-white p-4 shadow-sm"
      >
        <NuxtLink :to="`/boards/${board.id}`" class="font-semibold text-gray-900 hover:underline">
          {{ board.name }}
        </NuxtLink>

        <div class="mt-3 flex gap-2 text-sm">
          <button class="text-blue-600 hover:underline" @click="handleRename(board.id, board.name)">
            แก้ชื่อ
          </button>
          <button class="text-red-600 hover:underline" @click="handleDelete(board.id)">
            ลบ
          </button>
        </div>
      </div>
    </div>

    <p v-if="boardStore.boardsForCurrentUser.length === 0" class="text-gray-500">
      ยังไม่มีบอร์ด ลองสร้างอันแรกดูสิ
    </p>
  </div>
</template>

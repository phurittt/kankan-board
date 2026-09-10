<script setup lang="ts">
const boardStore = useBoardsStore()

const newBoardName = ref('')
const openMenuBoardId = ref<string | null>(null)
const renameDraft = ref('')
const memberUsernameDraft = ref('')
const memberError = ref('')

const BOARD_COLORS = ['#3b82f6', '#f97316', '#10b981', '#ec4899', '#8b5cf6', '#ef4444', '#eab308', '#64748b']

//เพิ่มบอร์ด ต้องแก้
function handleCreate() {
  const name = newBoardName.value.trim() //ตัดช่องว่าง 
  if (!name) return
  boardStore.createBoard(name)
  newBoardName.value = ''
}

//แก้ไขบอร์ด
function openMenu(boardId: string, currentName: string) {
  openMenuBoardId.value = boardId
  renameDraft.value = currentName
  memberUsernameDraft.value = ''
  memberError.value = ''
}

//ปิดแก้ไขบอร์ด
function closeMenu() {
  openMenuBoardId.value = null
}

function commitRename(boardId: string) {
  const name = renameDraft.value.trim()
  if (!name) return
  boardStore.renameBoard(boardId, name)
}

function selectColor(boardId: string, color: string) {
  boardStore.setBoardColor(boardId, color)
}


function handleAddMember(boardId: string) {
  const username = memberUsernameDraft.value.trim()
  if (!username) return

  const result = boardStore.addMemberByUsername(boardId, username)
  if (!result.success) {
    memberError.value = result.message
    return
  }
  memberUsernameDraft.value = ''
  memberError.value = ''
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
        class="relative rounded-lg bg-white p-4 shadow-sm"
        :style="{ borderTopWidth: '4px', borderTopColor: board.color }"
      >
        <div class="flex items-start justify-between">
          <NuxtLink :to="`/boards/${board.id}`" class="font-semibold text-gray-900 hover:underline">
            {{ board.name }}
          </NuxtLink>

          <button class="text-gray-500 hover:text-gray-800" @click="openMenu(board.id, board.name)">
            ⋮
          </button>
        </div>

        <button class="mt-3 text-sm text-red-600 hover:underline" @click="handleDelete(board.id)">
          ลบบอร์ด
        </button>

        <div
          v-if="openMenuBoardId === board.id"
          class="absolute right-4 top-12 z-10 w-64 rounded-md bg-white p-3 shadow-lg"
        >
          <label class="mb-1 block text-xs font-medium text-gray-500">ชื่อบอร์ด</label>
          <input
            v-model="renameDraft"
            type="text"
            class="mb-3 w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
            @blur="commitRename(board.id)"
            @keyup.enter="commitRename(board.id)"
          >

          <label class="mb-1 block text-xs font-medium text-gray-500">สีบอร์ด</label>
          <div class="mb-3 flex flex-wrap gap-2">
            <button
              v-for="color in BOARD_COLORS"
              :key="color"
              class="h-6 w-6 rounded-full border-2"
              :style="{ backgroundColor: color, borderColor: board.color === color ? '#111827' : 'transparent' }"
              @click="selectColor(board.id, color)"
            />
          </div>

          <label class="mb-1 block text-xs font-medium text-gray-500">เพิ่มสมาชิก (username)</label>
          <div class="flex gap-2">
            <input
              v-model="memberUsernameDraft"
              type="text"
              placeholder="username"
              class="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
              @keyup.enter="handleAddMember(board.id)"
            >
            <button class="rounded-md bg-blue-600 px-2 py-1 text-sm text-white" @click="handleAddMember(board.id)">
              เพิ่ม
            </button>
          </div>
          <p v-if="memberError" class="mt-1 text-xs text-red-600">
            {{ memberError }}
          </p>

          <button class="mt-3 text-xs text-gray-500 hover:underline" @click="closeMenu">
            ปิด
          </button>
        </div>
      </div>
    </div>

    <p v-if="boardStore.boardsForCurrentUser.length === 0" class="text-gray-500">
      ยังไม่มีบอร์ด ลองสร้างอันแรกดูสิ
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  open: []
  close: []
}>()

const boardStore = useBoardsStore()
const usersStore = useUserStore()

const BOARD_COLORS = ['#3b82f6', '#f97316', '#10b981', '#ec4899', '#8b5cf6', '#ef4444', '#eab308', '#64748b']

const draftName = ref('')
const draftColor = ref(BOARD_COLORS[0] ?? '#3b82f6')
const draftMemberUsername = ref('')
const draftMemberUsernames = ref<string[]>([])
const draftMemberError = ref('')

watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) return
  draftName.value = ''
  draftColor.value = BOARD_COLORS[0] ?? '#3b82f6'
  draftMemberUsername.value = ''
  draftMemberUsernames.value = []
  draftMemberError.value = ''
})

function addDraftMember() {
  const username = draftMemberUsername.value.trim()
  if (!username) return

  if (draftMemberUsernames.value.includes(username)) {
    draftMemberError.value = 'เพิ่มไปแล้ว'
    return
  }
  const user = usersStore.findByUsername(username)
  if (!user) {
    draftMemberError.value = 'ไม่พบ username นี้'
    return
  }

  draftMemberUsernames.value.push(username)
  draftMemberUsername.value = ''
  draftMemberError.value = ''
}

function removeDraftMember(username: string) {
  draftMemberUsernames.value = draftMemberUsernames.value.filter((u) => u !== username)
}

function submitCreateBoard() {
  const name = draftName.value.trim()
  if (!name) return

  const board = boardStore.createBoard(name)
  if (!board) return

  boardStore.setBoardColor(board.id, draftColor.value)
  for (const username of draftMemberUsernames.value) {
    boardStore.addMemberByUsername(board.id, username)
  }

  emit('close')
}
</script>

<template>
  <div class="relative min-h-36 rounded-lg bg-gray-200 shadow-sm">
    <button
      data-board-menu
      class="flex h-full w-full cursor-pointer items-center justify-center rounded-lg text-3xl text-gray-500 hover:bg-gray-300"
      @click="emit('open')"
    >
      +
    </button>

    <div
      v-if="isOpen"
      data-board-menu
      class="absolute right-4 top-12 z-10 w-64 rounded-md bg-white p-3 shadow-lg"
    >
      <button
        class="absolute right-2 top-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        @click="emit('close')"
      >
        ×
      </button>

      <label class="mb-1 block text-xs font-medium text-gray-500">ชื่อบอร์ด</label>
      <input
        v-model="draftName"
        type="text"
        placeholder="ชื่อบอร์ดใหม่"
        class="mb-3 w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
        @keyup.enter="submitCreateBoard"
      >

      <label class="mb-1 block text-xs font-medium text-gray-500">สีบอร์ด</label>
      <div class="mb-3 flex flex-wrap gap-2">
        <button
          v-for="color in BOARD_COLORS"
          :key="color"
          class="h-6 w-6 cursor-pointer rounded-full border-2"
          :style="{ backgroundColor: color, borderColor: draftColor === color ? '#111827' : 'transparent' }"
          @click="draftColor = color"
        />
      </div>

      <label class="mb-1 block text-xs font-medium text-gray-500">เพิ่มสมาชิก (username)</label>
      <div class="flex gap-2">
        <input
          v-model="draftMemberUsername"
          type="text"
          placeholder="username"
          class="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
          @keyup.enter="addDraftMember"
        >
        <button class="cursor-pointer rounded-md bg-blue-600 px-2 py-1 text-sm text-white" @click="addDraftMember">
          เพิ่ม
        </button>
      </div>
      <p v-if="draftMemberError" class="mt-1 text-xs text-red-600">
        {{ draftMemberError }}
      </p>
      <div v-if="draftMemberUsernames.length > 0" class="mt-2 flex flex-wrap gap-1">
        <span
          v-for="username in draftMemberUsernames"
          :key="username"
          class="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
        >
          {{ username }}
          <button class="cursor-pointer text-gray-400 hover:text-gray-700" @click="removeDraftMember(username)">
            ×
          </button>
        </span>
      </div>

      <div class="mt-3">
        <button
          class="w-full cursor-pointer rounded-md bg-blue-600 px-2 py-1 text-sm text-white hover:bg-blue-700"
          @click="submitCreateBoard"
        >
          สร้าง
        </button>
      </div>
    </div>
  </div>
</template>

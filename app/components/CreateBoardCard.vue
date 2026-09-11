<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  open: []
  close: []
}>()

const boardStore = useBoardsStore()

const BOARD_COLORS = ['#3b82f6', '#f97316', '#10b981', '#ec4899', '#8b5cf6', '#ef4444', '#eab308', '#64748b']

const draftName = ref('')
const draftColor = ref(BOARD_COLORS[0] ?? '#3b82f6')
const nameError = ref('')

watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) return
  draftName.value = ''
  draftColor.value = BOARD_COLORS[0] ?? '#3b82f6'
  nameError.value = ''
})

function submitCreateBoard() {
  const name = draftName.value.trim()
  if (!name) {
    nameError.value = 'โปรดกรอกชื่อบอร์ด'
    return
  }

  const board = boardStore.createBoard(name)
  if (!board) return

  boardStore.setBoardColor(board.id, draftColor.value)

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
        class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
        @keyup.enter="submitCreateBoard"
      >
      <p v-if="nameError" class="mt-1 text-xs text-red-600">
        {{ nameError }}
      </p>

      <label class="mb-1 mt-3 block text-xs font-medium text-gray-500">สีบอร์ด</label>
      <div class="mb-3 flex flex-wrap gap-2">
        <button
          class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2 bg-white text-gray-400"
          :style="{ borderColor: draftColor === '#ffffff' ? '#111827' : '#d1d5db' }"
          title="ไม่มีสี"
          @click="draftColor = '#ffffff'"
        >
          <svg viewBox="0 0 20 20" class="h-full w-full">
            <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="1.3" />
            <line x1="4.5" y1="15.5" x2="15.5" y2="4.5" stroke="currentColor" stroke-width="1.3" />
          </svg>
        </button>
        <button
          v-for="color in BOARD_COLORS"
          :key="color"
          class="h-6 w-6 cursor-pointer rounded-full border-2"
          :style="{ backgroundColor: color, borderColor: draftColor === color ? '#111827' : 'transparent' }"
          @click="draftColor = color"
        />
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

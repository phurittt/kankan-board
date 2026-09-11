<script setup lang="ts">
import type { Board } from '~/types/board'

const props = defineProps<{
  board: Board
  isMenuOpen: boolean
  isConfirmingDelete: boolean
}>()

const emit = defineEmits<{
  'open-menu': []
  'close-menu': []
  'request-delete': []
  'cancel-delete': []
}>()

const boardStore = useBoardsStore()
const usersStore = useUserStore()
const authStore = useAuthStore()

const isOwner = computed(() => authStore.currentUserId === props.board.ownerId)

const BOARD_COLORS = ['#3b82f6', '#f97316', '#10b981', '#ec4899', '#8b5cf6', '#ef4444', '#eab308', '#64748b']

const boardMembers = computed(() =>
  props.board.memberIds
    .map((id) => usersStore.getUserById(id))
    .filter((u): u is NonNullable<typeof u> => u !== undefined)
)

const visibleMembers = computed(() => boardMembers.value.slice(0, 5))
const extraMemberCount = computed(() => Math.max(0, boardMembers.value.length - 5))

const renameDraft = ref(props.board.name)
const memberUsernameDraft = ref('')
const memberError = ref('')

watch(() => props.isMenuOpen, (isOpen) => {
  if (!isOpen) return
  renameDraft.value = props.board.name
  memberUsernameDraft.value = ''
  memberError.value = ''
})

function commitRename() {
  const name = renameDraft.value.trim()
  if (!name) return
  boardStore.renameBoard(props.board.id, name)
}

function selectColor(color: string) {
  boardStore.setBoardColor(props.board.id, color)
}

function handleAddMember() {
  const username = memberUsernameDraft.value.trim()
  if (!username) return

  const result = boardStore.addMemberByUsername(props.board.id, username)
  if (!result.success) {
    memberError.value = result.message
    return
  }
  memberUsernameDraft.value = ''
  memberError.value = ''
}

function confirmDelete() {
  boardStore.deleteBoard(props.board.id)
  emit('close-menu')
}
</script>

<template>
  <NuxtLink
    :to="`/boards/${board.id}`"
    class="relative block min-h-36 rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    :style="{ borderTopWidth: '4px', borderTopColor: board.color }"
  >
    <div class="flex items-start justify-between">
      <span class="font-semibold text-gray-900">
        {{ board.name }}
      </span>

      <button
        data-board-menu
        class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-lg text-gray-600 hover:bg-black/20"
        @click.stop.prevent="emit('open-menu')"
      >
        ⋯
      </button>
    </div>

    <div
      v-if="isMenuOpen"
      data-board-menu
      class="absolute right-4 top-12 z-10 w-64 rounded-md bg-white p-3 shadow-lg"
      @click.stop.prevent
    >
      <button
        class="absolute right-2 top-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        @click="emit('close-menu')"
      >
        ×
      </button>

      <label class="mb-1 block text-xs font-medium text-gray-500">ชื่อบอร์ด</label>
      <input
        v-model="renameDraft"
        type="text"
        class="mb-3 w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
        @blur="commitRename"
        @keyup.enter="commitRename"
      >

      <label class="mb-1 block text-xs font-medium text-gray-500">สีบอร์ด</label>
      <div class="mb-3 flex flex-wrap gap-2">
        <button
          class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2 bg-white text-gray-400"
          :style="{ borderColor: board.color === '#ffffff' ? '#111827' : '#d1d5db' }"
          title="ไม่มีสี"
          @click="selectColor('#ffffff')"
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
          :style="{ backgroundColor: color, borderColor: board.color === color ? '#111827' : 'transparent' }"
          @click="selectColor(color)"
        />
      </div>

      <label class="mb-1 block text-xs font-medium text-gray-500">เพิ่มสมาชิก (username)</label>
      <div class="flex gap-2">
        <input
          v-model="memberUsernameDraft"
          type="text"
          placeholder="username"
          class="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
          @keyup.enter="handleAddMember"
        >
        <button class="cursor-pointer rounded-md bg-blue-600 px-2 py-1 text-sm text-white" @click="handleAddMember">
          เพิ่ม
        </button>
      </div>
      <p v-if="memberError" class="mt-1 text-xs text-red-600">
        {{ memberError }}
      </p>

      <button
        v-if="isOwner"
        class="mt-3 w-full cursor-pointer rounded-md border border-red-200 px-2 py-1 text-sm text-red-600 hover:bg-red-50"
        @click="emit('request-delete')"
      >
        ลบบอร์ด
      </button>

      <div
        v-if="isConfirmingDelete"
        class="absolute left-full top-0 ml-2 w-56 rounded-md bg-white p-3 shadow-lg"
      >
        <p class="mb-2 text-center text-sm font-medium text-gray-900">
          คุณแน่ใจหรือไม่
        </p>
        <hr class="mb-2 border-gray-200">
        <p class="mb-3 text-sm text-gray-700">
          บอร์ดจะถูกลบถาวร คุณจะไม่สามารถเปิดบอร์ดนี้ได้อีก
        </p>
        <div class="flex gap-2">
          <button
            class="flex-1 cursor-pointer rounded-md bg-red-600 px-2 py-1 text-sm text-white hover:bg-red-700"
            @click="confirmDelete"
          >
            ลบ
          </button>
          <button
            class="flex-1 cursor-pointer rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100"
            @click="emit('cancel-delete')"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>

    <div class="absolute bottom-3 right-3 flex -space-x-2">
      <div
        v-for="user in visibleMembers"
        :key="user.id"
        class="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-xs font-medium text-white"
        :style="{ backgroundColor: user.color }"
        :title="user.displayName"
      >
        {{ user.displayName.charAt(0).toUpperCase() }}
      </div>
      <div
        v-if="extraMemberCount > 0"
        class="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-300 text-xs font-medium text-gray-700"
      >
        +{{ extraMemberCount }}
      </div>
    </div>
  </NuxtLink>
</template>

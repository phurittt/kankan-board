<script setup lang="ts">
import type { Board } from '~/types/board'

const props = defineProps<{
  board: Board
}>()

const boardsStore = useBoardsStore()
const usersStore = useUserStore()

const isOpen = ref(false)
const memberUsernameDraft = ref('')
const memberError = ref('')

const members = computed(() =>
  props.board.memberIds
    .map((id) => usersStore.getUserById(id))
    .filter((u): u is NonNullable<typeof u> => u !== undefined)
)

const visibleMembers = computed(() => members.value.slice(0, 5))
const extraMemberCount = computed(() => Math.max(0, members.value.length - 5))

function toggleOpen() {
  isOpen.value = !isOpen.value
  memberUsernameDraft.value = ''
  memberError.value = ''
}

function handleAddMember() {
  const username = memberUsernameDraft.value.trim()
  if (!username) return

  const result = boardsStore.addMemberByUsername(props.board.id, username)
  if (!result.success) {
    memberError.value = result.message
    return
  }
  memberUsernameDraft.value = ''
  memberError.value = ''
}

function handleRemoveMember(userId: string) {
  boardsStore.removeMember(props.board.id, userId)
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (target.closest('[data-board-members-panel]')) return
  isOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="relative" data-board-members-panel>
    <button class="flex cursor-pointer items-center gap-2" @click.stop="toggleOpen">
      <span class="text-xs text-gray-600">เพิ่ม</span>
      <div class="flex -space-x-2">
        <div
          v-for="user in visibleMembers"
          :key="user.id"
          class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-medium text-white"
          :style="{ backgroundColor: user.color }"
          :title="user.displayName"
        >
          {{ user.displayName.charAt(0).toUpperCase() }}
        </div>
        <div
          v-if="extraMemberCount > 0"
          class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-300 text-xs font-medium text-gray-700"
        >
          +{{ extraMemberCount }}
        </div>
      </div>
    </button>

    <div v-if="isOpen" class="absolute right-0 z-10 mt-2 w-64 rounded-md bg-white p-3 shadow-lg" @click.stop>
      <div class="mb-3 space-y-2">
        <div v-for="user in members" :key="user.id" class="flex items-center gap-2">
          <div
            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white"
            :style="{ backgroundColor: user.color }"
          >
            {{ user.displayName.charAt(0).toUpperCase() }}
          </div>
          <span class="flex-1 truncate text-sm text-gray-700">{{ user.username }}</span>
          <button
            v-if="user.id !== board.ownerId"
            class="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md border border-gray-300 text-xs text-gray-500 hover:bg-gray-50"
            @click="handleRemoveMember(user.id)"
          >
            ลบ
          </button>
        </div>
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
    </div>
  </div>
</template>

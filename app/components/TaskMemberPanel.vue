<script setup lang="ts">
import type { Task } from '~/types/task'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  close: []
}>()

const tasksStore = useTasksStore()
const boardsStore = useBoardsStore()
const usersStore = useUserStore()

const boardMembers = computed(() => {
  const board = boardsStore.getBoardById(props.task.boardId)
  if (!board) return []
  return board.memberIds
    .map((id) => usersStore.getUserById(id))
    .filter((u): u is NonNullable<typeof u> => u !== undefined)
})

function toggleAssignee(userId: string) {
  if (props.task.assigneeIds.includes(userId)) {
    tasksStore.unassignMember(props.task.id, userId)
  } else {
    tasksStore.assignMember(props.task.id, userId)
  }
}
</script>

<template>
  <div class="mb-4 rounded-md border border-gray-200 p-3">
    <div class="mb-2 flex items-center justify-between">
      <p class="text-sm font-medium text-gray-700">สมาชิกที่รับผิดชอบ</p>
      <button class="cursor-pointer text-gray-400 hover:text-gray-700" @click="emit('close')">
        ✕
      </button>
    </div>

    <div class="space-y-2">
      <label v-for="user in boardMembers" :key="user.id" class="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          :checked="task.assigneeIds.includes(user.id)"
          class="h-4 w-4 cursor-pointer"
          @change="toggleAssignee(user.id)"
        >
        <div
          class="flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium text-white"
          :style="{ backgroundColor: user.color }"
        >
          {{ user.displayName.charAt(0).toUpperCase() }}
        </div>
        <span class="text-sm text-gray-700">{{ user.displayName }}</span>
      </label>

      <p v-if="boardMembers.length === 0" class="text-sm text-gray-500">
        บอร์ดนี้ยังไม่มีสมาชิกคนอื่น
      </p>
    </div>
  </div>
</template>

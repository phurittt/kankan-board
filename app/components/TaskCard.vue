<script setup lang="ts">
import type { Task } from '~/types/task'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  open: []
}>()

const tasksStore = useTasksStore()
const usersStore = useUserStore()

const assignees = computed(() => 
  props.task.assigneeIds //array ของ id ผู้ที่ถูก assign ให้ task นี้ (เช่น ['u1', 'u2', 'u3']) 
    .map((id) => usersStore.getUserById(id)) //แปลง id แต่ละตัวให้กลายเป็น object ผู้ใช้จริงๆ โดยไปค้นจาก usersStore
    .filter((u): u is NonNullable<typeof u> => u !== undefined)
)

//สมาชิกที่เห็น
const visibleAssignees = computed(() => 
  assignees.value.slice(0,3)
)
//สมาชิกที่ +
const extraAssigneeCount = computed(() => Math.max(0, assignees.value.length - 3))

const tags = computed(() =>
  tasksStore.tagsForBoard(props.task.boardId) //ได้ array ของ tag ทั้งหมดที่มีอยู่ใน board นั้น
  .filter((tag) => props.task.tagIds.includes(tag.id)) //กรอง เก็บเฉพาะ tag ที่ tag.id นั้นปรากฏอยู่ใน props.task.tagIds
)

function toggleDone() {
  tasksStore.updateTask(props.task.id, { done: !props.task.done })
}

const dueDateLabel = computed(() => {
  if (!props.task.dueDate) return null
  const [year, month, day] = props.task.dueDate.split('-').map(Number)
  if (year === undefined || month === undefined || day === undefined) return null
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
})
</script>

<template>
  <div
    class="cursor-pointer rounded-md bg-white p-2 text-sm shadow-sm hover:shadow-md"
    @click="emit('open')"
  >
    <div v-if="tags.length > 0" class="mb-1 flex flex-wrap gap-1">
      <span
        v-for="tag in tags"
        :key="tag.id"
        class="flex h-4 w-14 shrink-0 items-center justify-center rounded-full px-1 text-white"
        :style="{ backgroundColor: tag.color }"
      >
        <span class="min-w-0 truncate text-[10px] leading-none">{{ tag.label }}</span>
      </span>
    </div>


    <div class="flex items-start gap-2">
      <button
        class="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-full border-2"
        :class="task.done ? 'border-green-600 bg-green-600' : 'border-gray-400 bg-white'"
        @click.stop="toggleDone"
      />
      <span class="min-w-0 flex-1 break-words" :class="task.done ? 'text-gray-400 line-through' : 'text-gray-800'">
        {{ task.title }}
      </span>
    </div>

    <div v-if="dueDateLabel || assignees.length > 0" class="mt-2 flex items-center justify-between">
      <span v-if="dueDateLabel" class="flex items-center gap-1 text-xs text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-3.5 w-3.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        {{ dueDateLabel }}
      </span>
      <span v-else />

      <div v-if="assignees.length > 0" class="flex -space-x-2">
        <div
          v-for="user in visibleAssignees"
          :key="user.id"
          class="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-xs font-medium text-white"
          :style="{ backgroundColor: user.color }"
          :title="user.displayName"
        >
          {{ user.displayName.charAt(0).toUpperCase() }}
        </div>
        <div
          v-if="extraAssigneeCount > 0"
          class="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-300 text-xs font-medium text-gray-700"
        >
          +{{ extraAssigneeCount }}
        </div>
      </div>
    </div>
  </div>
</template>
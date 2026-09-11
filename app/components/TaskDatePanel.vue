<script setup lang="ts">
import type { Task } from '~/types/task'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  close: []
}>()

const tasksStore = useTasksStore()

const dateDraft = ref(props.task.dueDate ?? '')
const timeDraft = ref(props.task.dueTime ?? '')

function handleSave() {
  tasksStore.updateTask(props.task.id, {
    dueDate: dateDraft.value || null,
    dueTime: timeDraft.value || null,
  })
  emit('close')
}
</script>

<template>
  <div class="mb-4 rounded-md border border-gray-200 p-3">
    <div class="mb-2 flex items-center justify-between">
      <p class="text-sm font-medium text-gray-700">วันครบกำหนด</p>
      <button class="cursor-pointer text-gray-400 hover:text-gray-700" @click="emit('close')">
        ✕
      </button>
    </div>

    <div class="mb-3 flex gap-2">
      <input
        v-model="dateDraft"
        type="date"
        class="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
      >
      <input
        v-model="timeDraft"
        type="time"
        class="w-28 rounded-md border border-gray-300 px-2 py-1 text-sm"
      >
    </div>

    <button
      class="w-full cursor-pointer rounded-md bg-blue-600 px-2 py-1.5 text-sm text-white hover:bg-blue-700"
      @click="handleSave"
    >
      บันทึกเวลา
    </button>
  </div>
</template>

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

const [initialHour, initialMinute] = (props.task.dueTime ?? '').split(':')
const hourDraft = ref(initialHour ?? '')
const minuteDraft = ref(initialMinute ?? '')

function sanitizeTimePart(value: string, max: number) {
  const digitsOnly = value.replace(/\D/g, '').slice(0, 2)
  if (!digitsOnly) return ''
  return String(Math.min(Number(digitsOnly), max))
}

watch(hourDraft, (value) => {
  hourDraft.value = sanitizeTimePart(value, 23)
})
watch(minuteDraft, (value) => {
  minuteDraft.value = sanitizeTimePart(value, 59)
})

function handleSave() {
  const dueTime = hourDraft.value || minuteDraft.value
    ? `${hourDraft.value.padStart(2, '0')}:${minuteDraft.value.padStart(2, '0')}`
    : null

  tasksStore.updateTask(props.task.id, {
    dueDate: dateDraft.value || null,
    dueTime,
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
      <div class="flex items-center gap-1">
        <input
          v-model="hourDraft"
          type="text"
          inputmode="numeric"
          maxlength="2"
          placeholder="00"
          class="w-14 rounded-md border border-gray-300 px-2 py-1 text-center text-sm"
        >
        <span class="text-gray-400">:</span>
        <input
          v-model="minuteDraft"
          type="text"
          inputmode="numeric"
          maxlength="2"
          placeholder="00"
          class="w-14 rounded-md border border-gray-300 px-2 py-1 text-center text-sm"
        >
        <span class="text-sm text-gray-500">น.</span>
      </div>
    </div>

    <button
      class="w-full cursor-pointer rounded-md bg-blue-600 px-2 py-1.5 text-sm text-white hover:bg-blue-700"
      @click="handleSave"
    >
      บันทึกเวลา
    </button>
  </div>
</template>

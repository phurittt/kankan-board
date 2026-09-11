<script setup lang="ts">
import type { Task } from '~/types/task'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  close: []
}>()

const tasksStore = useTasksStore()

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    tasksStore.updateTask(props.task.id, { imageUrl: reader.result as string })
  }
  reader.readAsDataURL(file)
}

function removeImage() {
  tasksStore.updateTask(props.task.id, { imageUrl: undefined })
}
</script>

<template>
  <div class="mb-4 rounded-md border border-gray-200 p-3">
    <div class="mb-2 flex items-center justify-between">
      <p class="text-sm font-medium text-gray-700">รูปภาพ</p>
      <button class="cursor-pointer text-gray-400 hover:text-gray-700" @click="emit('close')">
        ✕
      </button>
    </div>

    <img v-if="task.imageUrl" :src="task.imageUrl" class="mb-3 h-32 w-full rounded-md object-cover" alt="">

    <input type="file" accept="image/*" class="mb-2 block w-full text-sm" @change="handleFileChange">

    <button
      v-if="task.imageUrl"
      class="w-full cursor-pointer rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
      @click="removeImage"
    >
      ลบรูป
    </button>
  </div>
</template>
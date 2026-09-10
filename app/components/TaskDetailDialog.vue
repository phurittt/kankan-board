<script setup lang="ts">
import type { Task } from '~/types/task'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  close: []
}>()

const tasksStore = useTasksStore()

const titleDraft = ref(props.task.title)
const descriptionDraft = ref(props.task.description ?? '')

watch(() => props.task.id, () => {
  titleDraft.value = props.task.title
  descriptionDraft.value = props.task.description ?? ''
})

function toggleDone() {
  tasksStore.updateTask(props.task.id, { done: !props.task.done })
}

function commitTitle() {
  const title = titleDraft.value.trim()
  if (title) tasksStore.updateTask(props.task.id, { title })
}

function saveDescription() {
  tasksStore.updateTask(props.task.id, { description: descriptionDraft.value })
  emit('close')
}

function cancelDescription() {
  descriptionDraft.value = props.task.description ?? ''
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="emit('close')">
    <div class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
      <div class="mb-4 flex items-start gap-3">
        <button
          class="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded-full border-2"
          :class="task.done ? 'border-green-600 bg-green-600' : 'border-gray-400 bg-white'"
          @click="toggleDone"
        />
        <input
          v-model="titleDraft"
          type="text"
          class="w-full rounded-md border border-transparent px-2 py-1 text-lg font-semibold hover:border-gray-300 focus:border-blue-500 focus:outline-none"
          @blur="commitTitle"
          @keyup.enter="commitTitle"
        >
        <button class="cursor-pointer text-gray-400 hover:text-gray-700" @click="emit('close')">
          ✕
        </button>
      </div>

      <div class="mb-4 flex gap-2 border-b border-gray-200 pb-4">
        <button class="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
          ป้าย
        </button>
        <button class="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
          วันที่
        </button>
        <button class="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
          สมาชิก
        </button>
      </div>

      <div class="mb-2">
        <label class="mb-1 block text-sm font-medium text-gray-700">คำอธิบาย</label>
        <textarea
          v-model="descriptionDraft"
          rows="4"
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="เพิ่มคำอธิบายรายละเอียด task..."
        />
      </div>
      <div class="flex gap-2">
        <button class="cursor-pointer rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700" @click="saveDescription">
          บันทึก
        </button>
        <button class="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100" @click="cancelDescription">
          ยกเลิก
        </button>
      </div>
    </div>
  </div>
</template>
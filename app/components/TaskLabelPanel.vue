<script setup lang="ts">
import type { Task } from '~/types/task'
import { PALETTE_COLORS } from '~/utils/palette'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  close: []
}>()

const tasksStore = useTasksStore()

const boardTags = computed(() => tasksStore.tagsForBoard(props.task.boardId))

const colorPickerTagId = ref<string | null>(null)
const currentColorPickerTag = computed(() => boardTags.value.find((t) => t.id === colorPickerTagId.value) ?? null)

function openColorPicker(tagId: string) {
  colorPickerTagId.value = tagId
}

function selectTagColor(color: string) {
  if (!colorPickerTagId.value) return
  tasksStore.updateTag(colorPickerTagId.value, { color })
}

function backToLabelList() {
  colorPickerTagId.value = null
}

function closePanel() {
  colorPickerTagId.value = null
  emit('close')
}

function handleLabelInput(tagId: string, event: Event) {
  const value = (event.target as HTMLInputElement).value
  tasksStore.updateTag(tagId, { label: value })
}

function createNewTag() {
  tasksStore.createTag(props.task.boardId, '', PALETTE_COLORS[0] ?? '#3b82f6')
}
</script>

<template>
  <div class="mb-4 rounded-md border border-gray-200 p-3">
    <div v-if="!colorPickerTagId">
      <div class="mb-2 flex items-center justify-between">
        <p class="text-sm font-medium text-gray-700">จัดการป้าย</p>
        <button class="cursor-pointer text-gray-400 hover:text-gray-700" @click="closePanel">
          ✕
        </button>
      </div>

      <div class="space-y-2">
        <div v-for="tag in boardTags" :key="tag.id" class="flex items-center gap-2">
          <input
            type="checkbox"
            :checked="task.tagIds.includes(tag.id)"
            class="h-4 w-4 cursor-pointer"
            @change="tasksStore.toggleTag(task.id, tag.id)"
          >
          <button
            class="h-6 w-6 shrink-0 cursor-pointer rounded"
            :style="{ backgroundColor: tag.color }"
            @click="openColorPicker(tag.id)"
          />
          <input
            :value="tag.label"
            type="text"
            placeholder="ชื่อป้าย"
            class="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
            @input="handleLabelInput(tag.id, $event)"
          >
          <button
            class="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border border-gray-300 text-xs text-gray-500 hover:bg-gray-50"
            @click="tasksStore.deleteTag(tag.id)"
          >
            ลบ
          </button>
        </div>

      </div>

      <button
        class="mt-2 w-full cursor-pointer rounded-md border border-dashed border-gray-300 px-2 py-1 text-sm text-gray-500 hover:bg-gray-50"
        @click="createNewTag"
      >
        + สร้างป้ายใหม่
      </button>
    </div>

    <div v-else>
      <div class="mb-3 flex items-center gap-2">
        <button
          class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
          @click="backToLabelList"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <p class="text-sm font-medium text-gray-700">เลือกสี</p>
      </div>

      <div class="grid grid-cols-4 gap-2">
        <button
          v-for="color in TAG_COLORS"
          :key="color"
          class="h-10 w-10 cursor-pointer rounded border-2"
          :style="{ backgroundColor: color, borderColor: currentColorPickerTag?.color === color ? '#111827' : 'transparent' }"
          @click="selectTagColor(color)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/types/task'
import { PALETTE_COLORS } from '~/utils/palette';
import type { Tag } from '~/types/task'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  close: []
}>()

const tasksStore = useTasksStore()

const titleDraft = ref(props.task.title)
const descriptionDraft = ref(props.task.description ?? '')

const activeSection = ref<'label' | 'date' | 'member' | null>(null)


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

// TAGS

//tag ทั้งหมดที่มีใน board
const boardTags = computed(() => 
  tasksStore.tagsForBoard(props.task.boardId)
)
//กรองเอาเฉพาะที่ task นี้ถูกติดไว้จริง (ใช้ boardTags.value ต่อยอด
const appliedTags = computed(() => 
  boardTags.value.filter((tag) => props.task.tagIds.includes(tag.id))
)

//เปิด/ปิด panel
function toggleLabelSection() { 
  activeSection.value = activeSection.value === 'label' ? null : 'label'
}

// เลือกสี tag
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

function closeLabelSection() {
  activeSection.value = null
  colorPickerTagId.value = null
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
        <button
          class="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
          :class="activeSection === 'label' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'"
          @click="toggleLabelSection"
        >
          ป้าย
        </button>
        <button class="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
          วันที่
        </button>
        <button class="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
          สมาชิก
        </button>
      </div>

      <div v-if="appliedTags.length > 0" class="mb-4 flex flex-wrap gap-1">
        <span
          v-for="tag in appliedTags"
          :key="tag.id"
          class="rounded-full px-2 py-0.5 text-xs text-white"
          :style="{ backgroundColor: tag.color }"
        >
          {{ tag.label || '(ยังไม่ตั้งชื่อ)' }}
        </span>
      </div>

      <div v-if="activeSection === 'label'" class="mb-4 rounded-md border border-gray-200 p-3">
        <div v-if="!colorPickerTagId">
          <div class="mb-2 flex items-center justify-between">
            <p class="text-sm font-medium text-gray-700">จัดการป้าย</p>
            <button class="cursor-pointer text-gray-400 hover:text-gray-700" @click="closeLabelSection">
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
              v-for="color in PALETTE_COLORS"
              :key="color"
              class="h-10 w-10 cursor-pointer rounded border-2"
              :style="{ backgroundColor: color, borderColor: currentColorPickerTag?.color === color ? '#111827' : 'transparent' }"
              @click="selectTagColor(color)"
            />
          </div>
        </div>
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
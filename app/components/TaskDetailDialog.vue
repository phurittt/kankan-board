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

// สรุปแท็กที่ติดไว้ (แค่โชว์ผล — ตัวแก้ไขจริงอยู่ใน TaskLabelPanel)
const boardTags = computed(() => tasksStore.tagsForBoard(props.task.boardId))
const appliedTags = computed(() => boardTags.value.filter((tag) => props.task.tagIds.includes(tag.id)))

// สรุปสมาชิกที่มอบหมายไว้ (แค่โชว์ผล — ตัวแก้ไขจริงอยู่ใน TaskMemberPanel)
const boardMembers = computed(() => {
  const board = boardsStore.getBoardById(props.task.boardId)
  if (!board) return []
  return board.memberIds
    .map((id) => usersStore.getUserById(id))
    .filter((u): u is NonNullable<typeof u> => u !== undefined)
})
const assignedMembers = computed(() => boardMembers.value.filter((u) => props.task.assigneeIds.includes(u.id)))

function toggleSection(section: 'label' | 'date' | 'member') {
  activeSection.value = activeSection.value === section ? null : section
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
          @click="toggleSection('label')"
        >
          ป้าย
        </button>
        <button class="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
          วันที่
        </button>
        <button
          class="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
          :class="activeSection === 'member' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'"
          @click="toggleSection('member')"
        >
          สมาชิก
        </button>
      </div>

      <div v-if="appliedTags.length > 0 || assignedMembers.length > 0" class="mb-4 space-y-2">
        <div v-if="assignedMembers.length > 0" class="flex items-center gap-2">
          <span class="text-xs font-medium text-gray-500">สมาชิก:</span>
          <div class="flex -space-x-2">
            <div
              v-for="user in assignedMembers"
              :key="user.id"
              class="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-xs font-medium text-white"
              :style="{ backgroundColor: user.color }"
              :title="user.displayName"
            >
              {{ user.displayName.charAt(0).toUpperCase() }}
            </div>
          </div>
        </div>

        <div v-if="appliedTags.length > 0" class="flex flex-wrap gap-1">
          <span
            v-for="tag in appliedTags"
            :key="tag.id"
            class="rounded-full px-2 py-0.5 text-xs text-white"
            :style="{ backgroundColor: tag.color }"
          >
            {{ tag.label || '(ยังไม่ตั้งชื่อ)' }}
          </span>
        </div>
      </div>

      <TaskLabelPanel v-if="activeSection === 'label'" :task="task" @close="activeSection = null" />
      <TaskMemberPanel v-if="activeSection === 'member'" :task="task" @close="activeSection = null" />

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

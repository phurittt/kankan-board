<script setup lang="ts">
import type { Column } from '~/types/board'
import { PALETTE_COLORS } from '~/utils/palette'

const props = defineProps<{
  column: Column
  activeEditor: string | null
}>()

const emit = defineEmits<{
  'set-active-editor': [value: string | null]
  'open-task': [taskId: string]
}>()

const columnsStore = useColumnsStore()
const tasksStore = useTasksStore()

const menuKey = computed(() => `menu:${props.column.id}`)
const editNameKey = computed(() => `edit-name:${props.column.id}`)
const addTaskKey = computed(() => `add-task:${props.column.id}`)

const isMenuOpen = computed(() => props.activeEditor === menuKey.value)
const isEditingName = computed(() => props.activeEditor === editNameKey.value)
const isAddingTask = computed(() => props.activeEditor === addTaskKey.value)

const nameDraft = ref(props.column.name)
const newTaskTitle = ref('')

const activeSubPanel = ref<'move' | 'delete' | null>(null)
const moveTargetIndex = ref(0)

const columnsInBoard = computed(() => columnsStore.columnsForBoard(props.column.boardId))
const tasks = computed(() => tasksStore.tasksForColumn(props.column.id))

watch(isMenuOpen, (isOpen) => {
  if (!isOpen) {
    activeSubPanel.value = null
    return
  }
  const currentIndex = columnsInBoard.value.findIndex((c) => c.id === props.column.id)
  moveTargetIndex.value = currentIndex === -1 ? 0 : currentIndex
})

function startEditName() {
  nameDraft.value = props.column.name
  emit('set-active-editor', editNameKey.value)
}

function commitName() {
  const name = nameDraft.value.trim()
  if (name) columnsStore.renameColumn(props.column.id, name)
  emit('set-active-editor', null)
}

function selectColor(color: string) {
  columnsStore.setColumnColor(props.column.id, color)
}

function handleMove() {
  columnsStore.reorderColumn(props.column.boardId, props.column.id, moveTargetIndex.value)
  activeSubPanel.value = null
  emit('set-active-editor', null)
}

function confirmDeleteColumn() {
  columnsStore.deleteColumn(props.column.id)
  emit('set-active-editor', null)
}

function handleAddTaskClick() {
  newTaskTitle.value = ''
  emit('set-active-editor', addTaskKey.value)
}

function submitNewTask() {
  const title = newTaskTitle.value.trim()
  if (!title) return
  tasksStore.createTask(props.column.id, props.column.boardId, title)
  newTaskTitle.value = ''
  emit('set-active-editor', null)
}
</script>

<template>
  <div
    class="relative w-72 shrink-0 rounded-lg p-3"
    :style="{ backgroundColor: column.color }"
  >
    <div class="mb-2 flex items-center justify-between gap-2">
      <input
        v-if="isEditingName"
        v-model="nameDraft"
        type="text"
        class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm font-semibold"
        autofocus
        @click.stop
        @blur="commitName"
        @keyup.enter="commitName"
      >
      <span
        v-else
        class="cursor-pointer truncate text-sm font-semibold text-gray-700"
        @click.stop="startEditName"
      >
        {{ column.name }}
      </span>

      <button
        data-column-menu
        class="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-600 hover:bg-black/10"
        @click.stop="emit('set-active-editor', menuKey)"
      >
        ⋯
      </button>
    </div>

    <div
      v-if="isMenuOpen"
      data-column-menu
      class="absolute right-2 top-10 z-10 w-56 rounded-md bg-white p-2 shadow-lg"
      @click.stop
    >
      <button
        class="block w-full cursor-pointer rounded-md px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100"
        @click="handleAddTaskClick"
      >
        เพิ่มการ์ด task
      </button>

      <button
        class="block w-full cursor-pointer rounded-md px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100"
        @click="activeSubPanel = activeSubPanel === 'move' ? null : 'move'"
      >
        ย้ายรายการ
      </button>

      <div class="px-2 py-1.5">
        <p class="mb-1 text-xs font-medium text-gray-500">สี</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="color in PALETTE_COLORS"
            :key="color"
            class="h-5 w-5 cursor-pointer rounded-full border-2"
            :style="{ backgroundColor: color, borderColor: column.color === color ? '#111827' : 'transparent' }"
            @click="selectColor(color)"
          />
        </div>
      </div>

      <button
        class="block w-full cursor-pointer rounded-md px-2 py-1.5 text-left text-sm text-red-600 hover:bg-red-50"
        @click="activeSubPanel = activeSubPanel === 'delete' ? null : 'delete'"
      >
        ลบ
      </button>

      <div
        v-if="activeSubPanel === 'move'"
        class="absolute left-full top-0 ml-2 w-48 rounded-md bg-white p-3 shadow-lg"
      >
        <label class="mb-1 block text-xs font-medium text-gray-500">ตำแหน่ง</label>
        <select v-model.number="moveTargetIndex" class="mb-3 w-full rounded-md border border-gray-300 px-2 py-1 text-sm">
          <option v-for="n in columnsInBoard.length" :key="n" :value="n - 1">
            {{ n }}
          </option>
        </select>
        <button class="w-full cursor-pointer rounded-md bg-blue-600 px-2 py-1 text-sm text-white hover:bg-blue-700" @click="handleMove">
          ย้าย
        </button>
      </div>

      <div
        v-if="activeSubPanel === 'delete'"
        class="absolute left-full top-0 ml-2 w-56 rounded-md bg-white p-3 shadow-lg"
      >
        <p class="mb-3 text-sm text-gray-700">
          คอลัมน์และ task ข้างในจะถูกลบถาวร
        </p>
        <div class="flex gap-2">
          <button class="flex-1 cursor-pointer rounded-md bg-red-600 px-2 py-1 text-sm text-white hover:bg-red-700" @click="confirmDeleteColumn">
            ลบ
          </button>
          <button class="flex-1 cursor-pointer rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100" @click="activeSubPanel = null">
            ยกเลิก
          </button>
        </div>
      </div>
    </div>

    <div class="space-y-2">
      <TaskCard v-for="task in tasks" :key="task.id" :task="task" @open="emit('open-task', task.id)" />
    </div>


    <div class="mt-2">
      <button
        v-if="!isAddingTask"
        class="w-full cursor-pointer rounded-md p-2 text-left text-sm text-gray-600 hover:bg-black/10"
        @click.stop="handleAddTaskClick"
      >
        + เพิ่มการ์ด
      </button>

      <div v-else @click.stop>
        <input
          v-model="newTaskTitle"
          type="text"
          placeholder="ชื่อ task"
          class="mb-2 w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
          autofocus
          @keyup.enter="submitNewTask"
        >
        <div class="flex gap-2">
          <button class="cursor-pointer rounded-md bg-blue-600 px-3 py-1 text-sm text-white" @click="submitNewTask">
            เพิ่ม
          </button>
          <button class="cursor-pointer rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700" @click="emit('set-active-editor', null)">
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

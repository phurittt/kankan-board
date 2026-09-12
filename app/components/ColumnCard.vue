<script setup lang="ts">
import type { Column } from '~/types/board'
import { PALETTE_COLORS } from '~/utils/palette'
import draggable from 'vuedraggable'
import type { Task } from '~/types/task'

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
const newTaskError = ref('')

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
  newTaskError.value = ''
  emit('set-active-editor', addTaskKey.value)
}

function submitNewTask() {
  const title = newTaskTitle.value.trim()
  if (!title) {
    newTaskError.value = 'กรุณากรอกชื่อ task'
    return
  }
  tasksStore.createTask(props.column.id, props.column.boardId, title)
  newTaskTitle.value = ''
  emit('set-active-editor', null)
}

//Drag

const localTasks = ref<Task[]>([...tasks.value])

watch(tasks, (newTasks) => {
  localTasks.value = [...newTasks]
})

function handleChange(event: any) {
  if (event.moved) {
    const { element, newIndex } = event.moved
    tasksStore.moveTask(element.id, props.column.id, props.column.id, newIndex)
  } else if (event.added) {
    const { element, newIndex } = event.added
    tasksStore.moveTask(element.id, element.columnId, props.column.id, newIndex) 
  }
}
</script>

<template>
  <div
    class="relative w-72 shrink-0 rounded-lg p-3"
    :style="{ backgroundColor: column.color }"
  >
    <draggable
      v-model="localTasks"
      item-key="id"
      group="tasks"
      class="min-h-16 select-none space-y-2"
      :force-fallback="true"
      ghost-class="opacity-40"
      @change="handleChange"
    >
      <template #header>
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
            class="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-xl font-bold text-gray-800 hover:bg-black/10"
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
            class="absolute right-2 top-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            @click="emit('set-active-editor', null)"
          >
            ✕
          </button>

          <button
            class="mt-6 block w-full cursor-pointer rounded-md px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100"
            @click="handleAddTaskClick"
          >
            เพิ่มการ์ด task
          </button>

          <button
            class="block w-full cursor-pointer rounded-md px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100"
            @click="startEditName"
          >
            แก้ไขชื่อ
          </button>

          <button
            class="block w-full cursor-pointer rounded-md px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100"
            @click="activeSubPanel = activeSubPanel === 'move' ? null : 'move'"
          >
            ย้ายรายการ
          </button>

          <div class="border-t border-b border-gray-200 px-2 py-2">
            <p class="mb-1 text-sm font-medium text-gray-700">เลือกสี</p>
            <div class="flex flex-wrap gap-2">
              <button
                class="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-2 bg-white text-gray-400"
                :style="{ borderColor: column.color === '#e5e7eb' ? '#111827' : '#d1d5db' }"
                title="ไม่มีสี"
                @click="selectColor('#e5e7eb')"
              >
                <svg viewBox="0 0 20 20" class="h-full w-full">
                  <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="1.3" />
                  <line x1="4.5" y1="15.5" x2="15.5" y2="4.5" stroke="currentColor" stroke-width="1.3" />
                </svg>
              </button>
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
            <p class="mb-2 text-center text-sm font-medium text-gray-900">
              คุณแน่ใจหรือไม่
            </p>
            <hr class="mb-2 border-gray-200">
            <p class="mb-3 text-sm text-gray-700">
              คอลัมน์และ task ข้างในจะถูกลบถาวร
            </p>
            <div class="flex gap-2">
              <button class="flex-1 cursor-pointer rounded-md bg-red-600 px-2 py-1 text-sm text-white hover:bg-red-700" @click="confirmDeleteColumn">
                ลบ
              </button>
              <button class="flex-1 cursor-pointer rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100" @click="activeSubPanel = null; emit('set-active-editor', null)">
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      </template>

      <template #item="{ element }">
        <TaskCard :task="element" @open="emit('open-task', element.id)" />
      </template>

      <template #footer>
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
              class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
              autofocus
              @keyup.enter="submitNewTask"
            >
            <p v-if="newTaskError" class="mb-2 mt-1 text-xs text-gray-500">
              {{ newTaskError }}
            </p>
            <div class="mt-2 flex gap-2">
              <button class="cursor-pointer rounded-md bg-blue-600 px-3 py-1 text-sm text-white" @click="submitNewTask">
                เพิ่ม
              </button>
              <button class="cursor-pointer rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700" @click="emit('set-active-editor', null)">
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

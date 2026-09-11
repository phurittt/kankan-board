<script setup lang="ts">
import type { Task } from '~/types/task'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  close: []
  moved: []
}>()

const tasksStore = useTasksStore()
const columnsStore = useColumnsStore()

const columnsInBoard = computed(() => columnsStore.columnsForBoard(props.task.boardId))

const currentColumnIndex = columnsInBoard.value.findIndex((c) => c.id === props.task.columnId)
const selectedColumnIndex = ref(currentColumnIndex === -1 ? 0 : currentColumnIndex)

const targetColumn = computed(() => columnsInBoard.value[selectedColumnIndex.value])

// จำนวนตำแหน่งที่เลือกได้ในคอลัมน์ปลายทาง (นับตำแหน่งสุดท้ายรวมด้วย)
// ถ้าย้ายอยู่ในคอลัมน์เดิม ต้องไม่นับตัวเองซ้ำ เพราะ moveTask จะเอาตัวเองออกจาก array ก่อนแทรกกลับเข้าไปเสมอ
const positionCount = computed(() => {
  if (!targetColumn.value) return 1
  const isSameColumn = targetColumn.value.id === props.task.columnId
  const otherTasksCount = isSameColumn
    ? targetColumn.value.taskIds.length - 1
    : targetColumn.value.taskIds.length
  return otherTasksCount + 1
})

function currentPositionInColumn(columnId: string) {
  const column = columnsInBoard.value.find((c) => c.id === columnId)
  if (!column) return 1
  const idx = column.taskIds.indexOf(props.task.id)
  return idx === -1 ? 1 : idx + 1
}

const selectedPosition = ref(currentPositionInColumn(props.task.columnId))

watch(selectedColumnIndex, () => {
  selectedPosition.value = positionCount.value
})

function handleMove() {
  if (!targetColumn.value) return
  tasksStore.moveTask(props.task.id, props.task.columnId, targetColumn.value.id, selectedPosition.value - 1)
  emit('moved')
}
</script>

<template>
  <div class="mb-4 rounded-md border border-gray-200 p-3">
    <div class="mb-2 flex items-center justify-between">
      <p class="text-sm font-medium text-gray-700">ย้ายไปคอลัมน์</p>
      <button class="cursor-pointer text-gray-400 hover:text-gray-700" @click="emit('close')">
        ✕
      </button>
    </div>

    <div class="mb-3">
      <label class="mb-1 block text-xs font-medium text-gray-500">คอลัมน์</label>
      <select v-model.number="selectedColumnIndex" class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm">
        <option v-for="(col, idx) in columnsInBoard" :key="col.id" :value="idx">
          {{ col.name }}
        </option>
      </select>
    </div>

    <div class="mb-3">
      <label class="mb-1 block text-xs font-medium text-gray-500">ตำแหน่ง</label>
      <select v-model.number="selectedPosition" class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm">
        <option v-for="n in positionCount" :key="n" :value="n">
          {{ n }}
        </option>
      </select>
    </div>

    <button
      class="w-full cursor-pointer rounded-md bg-blue-600 px-2 py-1.5 text-sm text-white hover:bg-blue-700"
      @click="handleMove"
    >
      ย้าย
    </button>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const boardId = route.params.boardId as string

const boardsStore = useBoardsStore()
const columnsStore = useColumnsStore()

const board = computed(() => boardsStore.getBoardById(boardId))

if (!board.value) {
  navigateTo('/boards')
}

const columns = computed(() => columnsStore.columnsForBoard(boardId))

const newColumnName = ref('')
const isAddingColumn = ref(false)

function handleCreateColumn() {
  const name = newColumnName.value.trim()
  if (!name) return
  columnsStore.createColumn(boardId, name)
  newColumnName.value = ''
  isAddingColumn.value = false
}
</script>

<template>
  <div v-if="board" class="p-4">
    <h1 class="mb-4 text-xl font-bold">{{ board.name }}</h1>

    <div class="flex gap-4 overflow-x-auto pb-4">
      <ColumnCard
        v-for="column in columns"
        :key="column.id"
        :column="column"
      />

      <div class="w-72 shrink-0">
        <button
          v-if="!isAddingColumn"
          class="w-full cursor-pointer rounded-lg bg-gray-100 p-3 text-left text-sm text-gray-600 hover:bg-gray-200"
          @click="isAddingColumn = true"
        >
          + เพิ่มคอลัมน์
        </button>

        <div v-else class="rounded-lg bg-gray-100 p-3">
          <input
            v-model="newColumnName"
            type="text"
            placeholder="ชื่อคอลัมน์"
            class="mb-2 w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
            @keyup.enter="handleCreateColumn"
          >
          <div class="flex gap-2">
            <button class="cursor-pointer rounded-md bg-blue-600 px-3 py-1 text-sm text-white" @click="handleCreateColumn">
              เพิ่ม
            </button>
            <button class="cursor-pointer rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700" @click="isAddingColumn = false">
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

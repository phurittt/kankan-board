<script setup lang="ts">
import type { Column } from '~/types/board'

defineProps<{
  column: Column
}>()
</script>

<template>
  <div
    class="w-72 shrink-0 rounded-lg p-3"
    :style="{ backgroundColor: column.color }"
  >
    <span class="text-sm font-semibold text-gray-700">
      {{ column.name }}
    </span>
  </div>
</template>

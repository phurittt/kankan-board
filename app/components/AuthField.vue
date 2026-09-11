<script setup lang="ts">
defineProps<{
  label: string
  type?: string
  error?: string
}>()

const modelValue = defineModel<string>({ required: true })
</script>

<template>
  <div>
    <label class="mb-1 block text-sm font-medium text-gray-700">{{ label }}</label>
    <input
      v-model="modelValue"
      :type="type ?? 'text'"
      class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
    >
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

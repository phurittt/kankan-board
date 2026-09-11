<script setup lang="ts">
const isOpen = ref(false)
const selected = ref('แก้ไขล่าสุด')

const OPTIONS = ['แก้ไขล่าสุด', 'สร้างล่าสุด', 'สร้างเก่าสุด']

const emit = defineEmits<{
  change: [value: string]
}>()

function toggle() {
  isOpen.value = !isOpen.value
}

function select(option: string) {
  selected.value = option
  isOpen.value = false
  emit('change', option)
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (target.closest('[data-sort-menu]')) return
  isOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div data-sort-menu class="relative inline-block">
    <label class="ml-1 mb-1 block text-sm font-medium text-gray-500">เรียงลำดับโดย</label>
    <button
      class="flex w-40 cursor-pointer items-center justify-between gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
      @click="toggle"
    >
      {{ selected }}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4 shrink-0 text-gray-400">
        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 z-10 mt-1 w-40 rounded-md bg-white py-1 shadow-lg"
    >
      <button
        v-for="option in OPTIONS"
        :key="option"
        class="block w-full cursor-pointer px-3 py-1.5 text-left text-sm hover:bg-gray-100"
        :class="selected === option ? 'bg-blue-50 text-blue-700' : 'text-gray-700'"
        @click="select(option)"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>

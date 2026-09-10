<script setup lang="ts">
const isOpen = ref(false)
const selected = ref('ล่าสุด')

const OPTIONS = ['ล่าสุด', 'เก่าสุด', 'A-Z', 'Z-A']

function toggle() {
  isOpen.value = !isOpen.value
}

// ตอนนี้แค่เก็บว่าเลือกอะไรไว้โชว์ ยังไม่ได้เรียงบอร์ดจริง
function select(option: string) {
  selected.value = option
  isOpen.value = false
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
    <button
      class="flex cursor-pointer items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
      @click="toggle"
    >
      เรียงลำดับโดย: {{ selected }}
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 z-10 mt-1 w-36 rounded-md bg-white py-1 shadow-lg"
    >
      <button
        v-for="option in OPTIONS"
        :key="option"
        class="block w-full cursor-pointer px-3 py-1.5 text-left text-sm hover:bg-gray-100"
        :class="selected === option ? 'font-medium text-blue-600' : 'text-gray-700'"
        @click="select(option)"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>

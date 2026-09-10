<script setup lang="ts">
definePageMeta({ layout: false })
import { useAuthStore } from '~/stores/auth';

const username = ref('')
const password = ref('')
const errorMessage = ref('')

const authStore = useAuthStore()

function handleSubmit() {
  errorMessage.value = ''

  const success = authStore.login(username.value, password.value)
  if (!success) {
    errorMessage.value = 'Username or Password incorrect'
    return
  }

  navigateTo('/boards')
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-sm rounded-lg bg-white p-6 shadow">
      <h1 class="mb-6 text-2xl font-bold text-gray-900">เข้าสู่ระบบ</h1>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Username</label>
          <input
            v-model="username"
            type="text"
            required
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          >
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          >
        </div>

        <p v-if="errorMessage" class="text-sm text-red-600">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          class="w-full rounded-md bg-blue-600 py-2 font-medium text-white hover:bg-blue-700"
        >
          เข้าสู่ระบบ
        </button>
      </form>

      <p class="mt-4 text-center text-sm text-gray-600">
        ยังไม่มีบัญชี?
        <NuxtLink to="/register" class="text-blue-600 hover:underline">สมัครสมาชิก</NuxtLink>
      </p>
    </div>
  </div>

</template>
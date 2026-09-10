<script setup lang="ts">
const authStore = useAuthStore()
navigateTo(authStore.isLoggedIn ? '/boards' : '/login')
</script>

<template>
  <div />
</template>
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const publicPages = ['/login', '/register']

  if (!authStore.isLoggedIn && !publicPages.includes(to.path)) {
    return navigateTo('/login')
  }

  if (authStore.isLoggedIn && publicPages.includes(to.path)) {
    return navigateTo('/boards')
  }
})
export default defineNuxtRouteMiddleware((to, from) => {
  const allowedRoutes = ['/']
  if (!allowedRoutes.includes(to.path)) {
    return navigateTo('/')
  }
})
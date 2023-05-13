export default defineNuxtRouteMiddleware((to, from) => {
  const allowedRoutes = ['index', 'article', 'article-id']

  if (!allowedRoutes.includes(to.name!.toString())) {
    return navigateTo('/')
  }
})
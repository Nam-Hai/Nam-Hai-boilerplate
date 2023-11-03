export default defineNuxtRouteMiddleware((to, from) => {
  // const allowedRoutes = ['/']
  // if (!allowedRoutes.includes(to.path)) {
  //   return navigateTo('/')
  // }
  const { isMobile } = useStore()

  const d = from.query.d
  if (!d) return
  isMobile.value = d == 'true'
  console.log('middle', d);
  // history.pushState(isMobile, '', '')
  // navigateTo({ path: to.path, query: {} })
  to.query = {}
  navigateTo(to)
})
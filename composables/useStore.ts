const useStore = createStore(() => {

  const isMobile = ref(false);

  const pageLoaded = ref(false);

  const preventScroll = ref(false);

  const fromPreloader = ref(true)

  const manifestLoaded = ref(false);

  const preloaderComplete = ref(false);
  return { isMobile, pageLoaded, preventScroll, fromPreloader, manifestLoaded, preloaderComplete }
})
export default useStore

const useCursorStore = createStore(() => {
  const cursorState = ref('active')

  function toggleMouse(active: boolean) {
    cursorState.value = active ? 'active' : 'default'
  }
  return { cursorState, toggleMouse }
})

export { useCursorStore }
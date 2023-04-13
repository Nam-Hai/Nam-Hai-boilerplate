export default function useResize(callback?: () => void) {
  const onResize = ref<boolean>(false);

  const vw = ref<number>(0);
  const vh = ref<number>(0);

  const throttle: number = 200;

  let to: any;

  onMounted(() => {
    updateSize();
    window.addEventListener('resize', onResizeHandler);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', onResizeHandler);
  });

  function onResizeHandler(e: Event): void {
    clearTimeout(to);
    to = setTimeout(() => {
      updateSize();
      onResize.value = !onResize.value;
      callback && callback();
    }, throttle);
  }

  function updateSize(): void {
    vw.value = window.innerWidth;
    vh.value = window.innerHeight;
  }

  return { vw, vh, onResize };
}


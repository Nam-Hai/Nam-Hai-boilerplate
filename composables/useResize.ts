import { ROR } from "~/plugins/core/resize";

export default function useResize(callback?: ({ vh, vw }: { vh: number, vw: number }) => void) {
  const onResize = ref<boolean>(false);

  const vw = ref<number>(0);
  const vh = ref<number>(0);

  const throttle: number = 200;

  let to: any;

  const { $ROR } = useNuxtApp()
  const ro = ref() as Ref<ROR>

  onMounted(() => {
    updateSize();
    ro.value = new $ROR(onResizeHandler)
    ro.value.on()
  });

  onBeforeUnmount(() => {
    ro.value.off()
  });

  function onResizeHandler(): void {
    clearTimeout(to);
    to = setTimeout(() => {
      updateSize();
      onResize.value = !onResize.value;
      callback && callback({ vh: vh.value, vw: vw.value });
    }, throttle);
  }

  function updateSize(): void {
    vw.value = window.innerWidth;
    vh.value = window.innerHeight;
  }

  return { vw, vh, onResize };
}

export function useRO(callback: (e: { vh: number, vw: number, scale: number, breakpoint: string }) => void) {
  const { $ROR } = useNuxtApp()
  const ro = ref() as Ref<ROR>

  onMounted(() => {
    ro.value = new $ROR(callback)
    ro.value.on()
  });

  onBeforeUnmount(() => {
    ro.value.off()
  });

  return ro.value;
}



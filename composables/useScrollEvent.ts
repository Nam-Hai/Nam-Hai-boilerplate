import { onFlow } from "~/waterflow/composables/onFlow";

type useScrollEventOptions = {
  el: Ref<HTMLElement>;
  vStart?: number;
  eStart?: number;
  vEnd?: number;
  eEnd?: number;
  onEnter?: () => void;
  onProgress?: (t: number) => void;
  pin?: boolean;
};

export const useScrollEvent = ({
  el,
  vStart = 100,
  eStart = 0,
  vEnd = 0,
  eEnd = 100,
  onEnter = undefined,
  onProgress = undefined,
}: useScrollEventOptions) => {
  const hasEnter = ref(false);
  const bounds = ref() as Ref<DOMRect>;


  const resize = () => {
    bounds.value = el.value.getBoundingClientRect();
    bounds.value.y = bounds.value.top + window.scrollY;
  };

  const { vh, vw } = useStoreView();
  useRO(resize);

  onMounted(() => {
    bounds.value = el.value.getBoundingClientRect();
    bounds.value.y = bounds.value.top;
  });

  const flow = onFlow(() => {
    intersectionInit();
    lenis.emit()
  })

  const { lenis } = useLenisScroll(() => {
    const dist = window.scrollY - bounds.value.y + (vh.value * vStart) / 100 - (bounds.value.height * eStart) / 100;
    const max = (bounds.value.height * (eEnd - eStart)) / 100 + (vh.value * (vStart - vEnd)) / 100;
    const offset = N.Clamp(dist, 0, max);
    const t = offset / max;
    if (t > 0 && !hasEnter.value && flow.value) {
      hasEnter.value = true;
      onEnter && onEnter();

      if (!onProgress) {
        intersectionObserver.value?.disconnect();
        lenis.stop();
      }
    }
    flow.value && onProgress && onProgress(t);
  });

  const intersectionObserver = ref() as Ref<IntersectionObserver>;
  const intersectionInit = () => {
    intersectionObserver.value = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.isIntersecting ? lenis.run() : lenis.stop();
      });
    });
    intersectionObserver.value.observe(el.value);
  };

  onBeforeUnmount(() => {
    intersectionObserver.value.disconnect();
  });
};

export const onEnter = ({
  el,
  vStart = 100,
  eStart = 0,
  vEnd = 0,
  eEnd = 100,
  leave = 100,
  enterCb,
  leaveCb,
  once = false,
  both = false
}: {
  el: Ref<HTMLElement>;
  vStart?: number;
  eStart?: number;
  vEnd?: number;
  eEnd?: number;
  leave?: number;
  once?: boolean;
  enterCb?: () => void;
  leaveCb?: () => void;
  both?: boolean
}) => {
  const hasEnter = ref(false);
  let bounds: DOMRect;
  let isFixed = false

  let boundY = 0

  const computeBounds = () => {
    bounds = el.value.getBoundingClientRect();
    boundY = bounds.top + (isFixed ? 0 : scrollY)
  };

  const { vh, vw } = useStoreView();
  useRO(computeBounds);

  onMounted(() => {
    const elementStyle = window.getComputedStyle(el.value);
    isFixed = elementStyle.position == 'fixed'
    computeBounds()
  });

  const flow = ref(false)

  const { lenis } = useLenisScroll((e) => {
    const dist = window.scrollY - boundY + (vh.value * vStart) / 100 - (bounds.height * eStart) / 100;
    const distLeave = window.scrollY - boundY + (vh.value * leave) / 100 - (bounds.height * eStart) / 100;
    const max = (bounds.height * (eEnd - eStart)) / 100 + (vh.value * (vStart - vEnd)) / 100;
    const offset = N.Clamp(dist, 0, max);
    const t = offset / max;
    const tLeave = N.Clamp(distLeave, 0, max) / max;
    if (both && t == 1) {
      hasEnter.value && (hasEnter.value = false)
    } else if (t > 0 && (!hasEnter.value && flow.value)) {
      hasEnter.value = true;
      enterCb && enterCb();
      // intersectionObserver.value.disconnect();
      // lenis.off()
    } else if (tLeave <= 0 && hasEnter.value && !once) {
      leaveCb && leaveCb()
      hasEnter.value = false
    }
  });

  onFlow(() => {
    flow.value = true
    lenis.run();
    lenis.emit()
  })

  onBeforeUnmount(() => {
    lenis.off()
  })



  return hasEnter
};

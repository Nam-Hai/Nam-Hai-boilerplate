import type { ShallowRef } from "vue";
import type { Breakpoints } from "~/plugins/core/resize";

export const [provideStoreView, useStoreView] = createContext(() => {

  const mouse = shallowRef({ x: 0, y: 0 })
  const vh = shallowRef(0);
  const vw = shallowRef(0);

  const dpr = shallowRef(1)

  const scale = shallowRef(0);
  const breakpoint = shallowRef("desktop") as ShallowRef<Breakpoints>;

  onMounted(() => {
    dpr.value = devicePixelRatio
    const updateMouse = (evt: MouseEvent) => {
      mouse.value = {
        x: evt.clientX,
        y: evt.clientY
      }
    };

    document.addEventListener("mousemove", updateMouse);
  })

  useRO(e => {
    console.error(e.vh);
    vh.value = e.vh;
    vw.value = e.vw;
    scale.value = e.scale;
    breakpoint.value = e.breakpoint;
  })

  return {
    mouse,
    vh,
    vw,
    dpr,
    breakpoint,
    scale
  }
})

// export const useStoreView = createStore(() => {
//   const mouse = reactive({ x: 0, y: 0 });

//   const vh = shallowRef(0);
//   const vw = shallowRef(0);

//   const scale = shallowRef(0);
//   const breakpoint = shallowRef("");

//   const dpr = shallowRef(1)

//   const preventScroll = shallowRef(false);
//   const lenis = shallowRef() as Ref<Lenis>;

//   function init() {

//     dpr.value = devicePixelRatio

//     lenis.value = new Lenis();

//     const ro = useROR((e) => {
//       vh.value = e.vh;
//       vw.value = e.vw;
//       scale.value = e.scale;
//       breakpoint.value = e.breakpoint;
//     });
//     ro.on();
//     ro.trigger();

//     const updateMouse = (evt: MouseEvent) => {
//       mouse.x = evt.clientX;
//       mouse.y = evt.clientY;
//     };
//     document.addEventListener("mousemove", updateMouse);
//   }
//   function resetLenis({
//     wrapper, content, target, infinite, direction
//   }: {
//     wrapper?: Window | HTMLElement;
//     content?: HTMLElement;
//     target?: Window | HTMLElement;
//     infinite?: boolean;
//     direction?: "horizontal" | "vertical";
//   }) {

//     lenis.value.stop();
//     lenis.value = new Lenis({
//       wrapper,
//       content,
//       wheelEventsTarget: target,
//       normalizeWheel: true,
//       smoothTouch: false,
//       syncTouch: true,
//       wheelMultiplier: 0.82,
//       touchMultiplier: 1.7,
//       infinite: infinite,
//       orientation: direction
//     });
//   }


//   return {
//     mouse,
//     vw,
//     vh,
//     dpr,
//     scale,
//     breakpoint,
//     lenis,
//     init,
//     preventScroll,
//     resetLenis
//   };
// });

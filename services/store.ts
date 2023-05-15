import Lenis from "@studio-freight/lenis";
import { useROR } from "~/composables/pluginComposables";

type CursorState = 'default' | 'active'

class StoreService {
  vh: globalThis.Ref<number>;
  vw: globalThis.Ref<number>;
  scale: globalThis.Ref<number>;
  breakpoint: globalThis.Ref<string>;
  manifestLoaded: globalThis.Ref<boolean>;
  showLogoLayout: globalThis.Ref<boolean>;
  mouse: { x: number; y: number; };
  cursorState: globalThis.Ref<CursorState>;
  indexMaskBound: globalThis.Ref<number>;
  lenis!: Ref<Lenis>;
  constructor() {
    console.log('class init')
    this.mouse = reactive({ x: 0, y: 0 })

    this.vh = ref(0)
    this.vw = ref(0)
    this.scale = ref(0)
    this.breakpoint = ref('desktop')

    this.manifestLoaded = ref(false)

    this.showLogoLayout = ref(false)

    this.cursorState = ref('default') as Ref<CursorState>
    this.indexMaskBound = ref(0)
  }

  init() {
    this.lenis = ref(new Lenis())
    const ro = useROR(({ vh, vw, scale, breakpoint }) => {
      this.vh.value = vh
      this.vw.value = vw
      this.scale.value = scale
      this.breakpoint.value = breakpoint
    })
    ro.on()

    const updateMouse = (evt: MouseEvent) => {
      this.mouse.x = evt.clientX
      this.mouse.y = evt.clientY
    }
    document.addEventListener('mousemove', updateMouse)
  }

  resetLenis(wrapper?: Window | HTMLElement, content?: HTMLElement) {
    this.lenis.value.stop()
    this.lenis.value = new Lenis({
      wrapper,
      content,
      normalizeWheel: true,
      smoothTouch: false,
      syncTouch: true,
      // syncTouchLerp: 1
    })
  }
}

const store = new StoreService()
export default store

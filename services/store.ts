console.log('SERVICE');

class storeService {
  mouse: { x: number; y: number; };
  vh: globalThis.Ref<number>;
  vw: globalThis.Ref<number>;
  scale: globalThis.Ref<number>;
  breakpoint: globalThis.Ref<string>;
  constructor() {
    console.log('class init')
    this.mouse = reactive({
      x: 0,
      y: 0
    })

    this.vh = ref(0)
    this.vw = ref(0)
    this.scale = ref(0)
    this.breakpoint = ref('desktop')

  }

  init() {
    const { $ROR } = useNuxtApp()
    const ro = new $ROR(({ vh, vw, scale, breakpoint }) => {
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
    document.addEventListener('mouseenter', updateMouse)
  }
}

const store = new storeService()
export default store

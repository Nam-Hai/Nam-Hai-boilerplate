import Lenis from "@studio-freight/lenis";
class StoreService {
  vh: globalThis.Ref<number>;
  vw: globalThis.Ref<number>;
  scale: globalThis.Ref<number>;
  breakpoint: globalThis.Ref<string>;
  manifestLoaded: globalThis.Ref<boolean>;
  mouse: { x: number; y: number };
  lenis!: Ref<Lenis>;

  canvasRef: Ref<HTMLElement | undefined> = ref();

  isMobile: globalThis.Ref<boolean>;
  pageLoaded: globalThis.Ref<boolean>;
  preloaderComplete: globalThis.Ref<boolean>;
  preventScroll: globalThis.Ref<boolean>;
  fromPreloader: globalThis.Ref<boolean>;

  constructor() {
    N.BM(this, ["init", "resetLenis"]);
    this.isMobile = ref(false);

    this.pageLoaded = ref(false);

    this.preventScroll = ref(false);

    this.fromPreloader = ref(true)

    this.mouse = reactive({ x: 0, y: 0 });

    this.vh = ref(0);
    this.vw = ref(0);
    this.scale = ref(0);
    this.breakpoint = ref("");

    this.manifestLoaded = ref(false);

    this.preloaderComplete = ref(false);
  }

  init() {
    this.lenis = ref(
      new Lenis({
        // normalizeWheel: true,
        // smoothTouch: false,
        // syncTouch: true,
        // wheelMultiplier: 1,
        // touchMultiplier: 2,
        // orientation: 'vertical',
        // gestureOrientation: 'vertical',
        // infinite: true,
        // syncTouchLerp: 1
      })
    );

    const ro = useROR(({ vh, vw, scale, breakpoint }) => {
      this.mouse.x = vw / 2;
      this.mouse.y = vh / 2;
      this.vh.value = vh;
      this.vw.value = vw;
      this.scale.value = scale;
      this.breakpoint.value = breakpoint;
    });
    ro.on();
    ro.trigger();

    const updateMouse = (evt: MouseEvent) => {
      this.mouse.x = evt.clientX;
      this.mouse.y = evt.clientY;
    };
    document.addEventListener("mousemove", updateMouse);


    // CREATE A TICKER COMPOSABLE
    // let delay = 0
    // let elapsed = 0
    // useRaf(({ delta }) => {
    //   if (this.section1.sleep) return
    //   elapsed += delta
    //   const d = Math.floor(elapsed / 3500)
    //   if (d != delay) {
    //     delay = d
    //     const index = this.section1.currentPartnerDoubleIndex.value - 1
    //     this.section1.currentPartnerDoubleIndex.value = mod(index, PARTNERS_STORE.length * 2)
    //     this.section1.currentPartnerIndex.value = mod(index, PARTNERS_STORE.length)
    //   }
    // })
  }

  resetLenis({
    wrapper,
    content,
    target,
    infinite,
    direction
  }: {
    wrapper?: Window | HTMLElement;
    content?: HTMLElement;
    target?: Window | HTMLElement;
    infinite?: boolean;
    direction?: "horizontal" | "vertical";
  }) {

    this.lenis.value.stop();
    this.lenis.value = new Lenis({
      wrapper,
      content,
      wheelEventsTarget: target,
      normalizeWheel: true,
      smoothTouch: false,
      syncTouch: true,
      wheelMultiplier: 0.82,
      touchMultiplier: 1.7,
      infinite: infinite,
      orientation: direction
      // syncTouchLerp: 1
    });
  }
}

const store = new StoreService();
export default store;

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

}

const store = new StoreService();
export default store;

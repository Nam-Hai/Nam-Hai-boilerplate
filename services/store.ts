
class StoreService {
  manifestLoaded: globalThis.Ref<boolean>;
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

    this.manifestLoaded = ref(false);

    this.preloaderComplete = ref(false);
  }

}

const store = new StoreService();
export default store;

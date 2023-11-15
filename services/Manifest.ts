
import { Texture } from "ogl";

const MANIFEST = {
  background: [
    // "Asset"
  ],
};

export default class Manifest {
  length: number;
  index: globalThis.Ref<number>;
  callback?: (n: number) => void;

  textures: {
    [key: string]: Texture[];
  };
  jsons: { [key: string]: {} };
  percentage: Ref<number>;
  canvasContext: any;
  currentBackground: number;

  constructor(gl: any) {
    this.canvasContext = gl;
    this.textures = {};

    this.index = ref(0);
    this.percentage = ref(0);
    this.length = 0;

    this.jsons = {};

    this.currentBackground = 0
  }

  init() {
    for (const m of Object.values(MANIFEST)) {
      this.length += Object.values(m).length;
    }
    this.length += Object.values(this.jsons).length;

    // prismic fetch
    // this.length += 1

    const { manifestLoaded } = useStore();

    const unWatch = watch(this.index, (i) => {
      this.percentage.value = i / this.length;

      i == this.length && ((manifestLoaded.value = true), unWatch());
    });
  }

  async loadManifest() {
    const { manifestLoaded } = useStore();

    this.length === 0 &&
      ((this.percentage.value = 1), (manifestLoaded.value = true));
    for (const [keys, m] of Object.entries(MANIFEST)) {
      this.textures[keys] = [];
      for (const src of m) {
        await new Promise<void>((res) => {
          const texture = new Texture(this.canvasContext);
          const image = new Image();
          image.crossOrigin = "anonymous";

          image.onload = () => {
            texture.image = image;
            this.textures[keys].push(texture);
            this.index.value++;
            res();
          };
          image.src = src;
        });
      }
    }

    for (const [keys, values] of Object.entries(this.jsons)) {
      const font = await (await fetch(keys)).json();
      this.jsons[keys] = font;
      this.index.value += 1;
    }
  }

  getBackground() {
    this.currentBackground++
    if (this.currentBackground >= this.textures.background.length) {
      N.Arr.shuffle(this.textures.background)
      this.currentBackground = 0
    }
    return this.textures.background[this.currentBackground]
  }
}

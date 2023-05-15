// @ts-ignore
import { Texture } from "ogl"

export default class Manifest {
  length: number
  index: globalThis.Ref<number>
  callback?: (n: number) => void

  textures: {
    images: {
      [key: string]: Texture
    },
    prismicAny: {
      [key: string]: Texture
    }
  }
  jsons: { [key: string]: {} }
  percentage: Ref<number>
  canvasContext: any
  prismicData: any
  constructor(gl: any) {
    this.canvasContext = gl
    this.textures = {
      images: {
        // '1.png': new Texture(gl),
        // '2.jpg': new Texture(gl),
        // '3.png': new Texture(gl),
        // '4.jpg': new Texture(gl),
        // '5.jpg': new Texture(gl),
        // '6.jpg': new Texture(gl),
        // '7.jpg': new Texture(gl),
      },
      prismicAny: {

      }
    }

    this.index = ref(0)
    this.percentage = ref(0)
    this.length = 0

    this.jsons = {
    }
  }

  async loadCMS() {
    // const { client } = usePrismic()
    // const { data: media } = await useAsyncData('media', () => client.getAllByType('mediatest'))
    // if (!media.value) return
    // this.prismicData = media
    // for (const data of media.value) {
    //   this.textures.prismicAny[data.data.place.url] = new Texture(this.canvasContext)
    // }
  }

  init() {
    for (const m of Object.values(this.textures)) {
      this.length += Object.values(m).length
    }
    this.length += Object.values(this.jsons).length


    const { manifestLoaded } = useStore()

    const unWatch = watch(this.index, i => {
      this.percentage.value = i / this.length
      i == this.length && (manifestLoaded.value = true, unWatch())
    })

  }

  async loadManifest() {
    const { manifestLoaded } = useStore()

    this.length === 0 && (this.percentage.value = 1, manifestLoaded.value = true)
    for (const m of Object.values(this.textures)) {
      for (const [keys, values] of Object.entries(m)) {
        await new Promise<void>(res => {
          let image = new Image()
          image.crossOrigin = 'anonymous'
          image.onload = () => {
            values.image = image
            this.index.value++;
            res()
          }
          image.src = keys
        })
      }
    }

    for (const [keys, values] of Object.entries(this.jsons)) {
      const font = await (await fetch(keys)).json();
      this.jsons[keys] = font
      this.index.value += 1
    }
  }
}

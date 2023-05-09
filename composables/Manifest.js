import { Texture } from "ogl"

export default class Manifest {
  constructor(gl) {
    const textures = {
      images: {
        // texture1: new Texture(gl)
      },
      font: {
      }
    }

    this.jsons = {
    }


    this.length = 0
    for (const m of Object.values(textures)) {
      this.length += Object.values(m).length
    }
    this.length += Object.values(this.jsons).length

    this.index = ref(0)

    this.callback = (n)=>{}
    watch(this.index, i =>{
      this.callback(i)
    })

    this.textures = textures
  }


  async loadManifest() {
    for (const m of Object.values(this.textures)) {
      for (const [keys, values] of Object.entries(m)) {
        // await new Promise((resolve) => {
        let image = new Image()
        image.crossOrigin = 'anonymous'
        image.onload = () => {
          values.image = image

          this.index.value += 1
          // resolve()
        }
        image.src = keys
      }
    }

    for (const [keys, values] of Object.entries(this.jsons)) {
      const font = await (await fetch(keys)).json();
      this.jsons[keys] = font
      this.index.value += 1
    }
  }
}

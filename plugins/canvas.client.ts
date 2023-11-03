import Canvas from "~/scene/canvas"
import Manifest from "~/services/Manifest"

const canvas = new Canvas()
const manifest = new Manifest(canvas.gl)

export default defineNuxtPlugin(nuxtApp => {
  return {
    provide: {
      canvas,
      manifest
    }
  }
})


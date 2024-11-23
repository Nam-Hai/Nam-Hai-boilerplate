import { FrameFactory, FrameManager, TabManager } from './core/frame'
// import { ROR } from './core/resize'


export default defineNuxtPlugin({
  name: "namhai",
  setup: nuxtApp => {
    const tab = new TabManager()
    const FM = new FrameManager(tab)
    const frameFactory = new FrameFactory(FM)

    return {
      provide: {
        frameFactory
      }
    }

  }
})

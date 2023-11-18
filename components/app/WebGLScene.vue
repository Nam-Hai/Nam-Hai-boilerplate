<template>
  <div ref="wrapperSceneRef" class="wrapper-scene">
  </div>
</template>

<script lang='ts' setup>
import { useFlowProvider } from '~/waterflow/FlowProvider'
const sceneRef = ref()
const wrapperSceneRef = ref()
const canvas = useCanvas()

onMounted(() => {
  sceneRef.value = canvas
  wrapperSceneRef.value.appendChild(canvas.gl.canvas)

})

const flowProvider = useFlowProvider()
flowProvider.addProps('canvasWrapperRef', wrapperSceneRef)

onUnmounted(() => {
  canvas.destroy()
})

</script>

<style lang="scss">
.wrapper-scene {
  position: relative;
  z-index: 8;
  pointer-events: none;

  &.BOTTOM {
    z-index: 6;
  }

  canvas {
    // background-color: white;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>

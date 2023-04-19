<template>
  <div class="wrapper-scene">
    <canvas ref="canvasRef"></canvas> 
  </div>
</template>

<script lang='ts' setup>
import  Canvas  from '@/scene/canvas.js';
import { createContext } from 'vm';
import { useFlowProvider } from '~/util/FlowProvider';


const canvasRef = ref()
const sceneRef = ref()

onMounted(()=>{
  sceneRef.value = new Canvas({canvas: canvasRef.value})
  const flowProvider = useFlowProvider()
  flowProvider.canvas = sceneRef
})

onUnmounted(()=>{
  sceneRef.value.destroy()
})



</script>

<style lang="scss" scoped>
canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

}
</style>

<template>
  <div ref="wrapperRef" class="preloader__wrapper" v-if="!killPreloader">
    <div class="logo">
      <div>
        Preloader
      </div>
    </div>

    <div class="counter">
      {{ counter }}
    </div>
  </div>
  <slot v-if="preloaderComplete" />
</template>

<script lang="ts" setup>
import { useFlowProvider } from '~/waterflow/FlowProvider';


const flowProvider = useFlowProvider()
const wrapperRef = ref()
const counter = ref('00')

const manifestLoaded = ref(false)
const { preloaderComplete, fromPreloader } = useStore()
const killPreloader = ref(false)
const percentageRef = ref(0)
const route = useRoute()

const canvas = useCanvas()


watch(preloaderComplete, async () => {
  await nextTick()

  fromPreloader.value = false

  canvas.onChange(flowProvider.getRouteTo())

  useDelay(1000, () => {
    killPreloader.value = true
  }).run()
})


onMounted(() => {
  const manifest = useManifest()

  manifest.init()

  const percentage = manifest.percentage
  watch(percentage, (next, old) => {
    percentageRef.value = next
    counter.value = N.ZL(Math.floor(next * 100))
  })

  manifest.loadManifest().then(() => {
    manifestLoaded.value = true
    console.log('load');
    endPreloader()
  })
  // if (manifest.length == 0) return endPreloader()
})

function endPreloader() {

  canvas.preloader()

  N.Class.add(wrapperRef.value, 'hide')
}

</script>

<style scoped lang="scss">
@use "@/styles/shared.scss" as *;

.preloader__wrapper {
  pointer-events: none;
  position: fixed;
  z-index: 50;
  top: 0;
  left: 0;
  line-height: 100%;
  height: 100%;
  width: 100%;

  transition: opacity 1s $easeOutExpo;
  // opacity: 0.2;
  color: rgb(0, 0, 0);
  background-color: white;

  &.hide {
    opacity: 0;
  }

  .logo {
    opacity: 0.25;

    position: absolute;
    left: 50%;
    top: 48%;
    transform: translate(-50%, -50%);
    font-size: 6.5rem;
    font-weight: 500;
    letter-spacing: -0.4844rem;
    line-height: 100%;
    letter-spacing: -.41rem;

    display: flex;
    // align-items: center;
    align-items: baseline;
    height: 4.8rem;

    >div {
      margin-left: 0.8rem;
    }
  }
}

.counter {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 4rem;
  font-size: 1.4rem;
  opacity: 0.25;
}
</style>

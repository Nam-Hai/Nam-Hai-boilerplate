<template>
  <div ref="wrapperRef" class="wrapper__preloader" v-if="!preloadComplete">
  </div>

  <slot v-if="preloadComplete" />
</template>

<script lang="ts" setup>
const fromPreloader = inject('from-preloader') as Ref<boolean>

const wrapperRef = ref()
const preloadComplete = ref(false)

const canvas = useCanvas()

watch(preloadComplete, () => {
  fromPreloader.value = false
  canvas.currentPage.init()
})


const { manifestLoaded } = useStore()

const quitLoader = ref(false)

function endPreloader() {
  preloadComplete.value = true
}


const { client } = usePrismic()
onMounted(() => {
  const manifest = useManifest()

  manifest.loadManifest()
  if (manifest.length == 0) return endPreloader()
  watch(manifest.percentage, i => {
  })
})



</script>

<style scoped lang="scss">
@use "@/styles/shared.scss" as *;

</style>

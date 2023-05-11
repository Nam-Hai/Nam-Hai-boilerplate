<template>
  <div ref="wrapperRef" class="wrapper__preloader" v-if="!preloadComplete">
    {{index}}
  </div>
  <slot v-if="preloadComplete" />
</template>

<script lang="ts" setup>
const preloadComplete = ref(false)


const { $TL, $canvas, $manifest } = useNuxtApp()

const wrapperRef = ref()

const fromPreloader = inject('from-preloader') as Ref<boolean>
watch(preloadComplete, () => {
    fromPreloader.value = false
    $canvas.currentPage.init()
})

const index = ref(0)
onMounted(() => {

  $manifest.callback = (i) => {
    index.value = i
    if (i == $manifest.length) {
      preloadComplete.value = true
    }
  }
  $manifest.loadManifest()
  if($manifest.length ===0){
    preloadComplete.value = true
  }
})



</script>

<style scoped lang="scss">
@use "@/styles/shared.scss" as *;
.wrapper__preloader {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
}


</style>

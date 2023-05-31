<template>
  <main ref="wrapperRef">

    <NuxtWelcome />
  </main>
</template>

<script lang="ts" setup>
import { NuxtWelcome } from '~~/.nuxt/components';


const store = useStore()

store.resetLenis()

const wrapperRef = ref()

onMounted(() => {
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

main {
}
</style>

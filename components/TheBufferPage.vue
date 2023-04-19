<template>
  <div class="buffer-page__wrapper">
    <component :is="routePage" />
  </div>
</template>

<script setup lang='ts'>
import { useFlowProvider } from '~/util/FlowProvider';

const routePage = shallowRef()

const provider = useFlowProvider()
provider.connectBuffer(routePage)


</script>

<style lang="scss">
.buffer-page__wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>

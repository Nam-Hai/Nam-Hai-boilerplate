<template>
  <div class="menu__wrapper" v-if="data">
    <NuxtLink :to="{ name: 'index' }" class="menu-item">
      home
    </NuxtLink>
    <NuxtLink :to="{ name: 'foo' }" class="menu-item">
      foo
    </NuxtLink>
    <NuxtLink :to="{ name: 'baz' }" class="menu-item">
      baz
    </NuxtLink>
    <button @click="onClick" class="menu-item">
      Random Route
    </button>
  </div>
</template>

<script lang="ts" setup>
const { data, error } = await useAsyncData("slugs", async () => {
  const data = await $fetch("/api/getSlugs")
  return data
});
if (error.value) throw createError({ statusCode: 404, statusMessage: "Slugs Not Found" });
// if (error.value) createError({ statusCode: 404, statusMessage: "Slugs Not Found" });

const { currentRoute } = useFlowProvider()
const onClick = () => {
  const to = N.Arr.randomElement(['foo', 'baz', 'index'])
  const cur = currentRoute.value.name?.toString()
  if (to === cur) return onClick()
  navigateTo({ name: to })
}
</script>

<style lang="scss" scoped>
.menu__wrapper {
  z-index: 1000;
  position: fixed;
  top: 8rem;
  left: 22rem;
  display: flex;
  flex-direction: column;

  font-size: 2rem;
  row-gap: 1rem;
}

.menu-item {
  padding: 0.5rem;
  background-color: blanchedalmond;
}
</style>

<template>
    <h1>
        slug : {{ data }}
    </h1>
</template>
<script lang="ts" setup>
import { useFlowProvider } from '~/lib/waterflow/FlowProvider';

const { currentRoute } = useFlowProvider()
const { data } = await useAsyncData("slug", async () => {
    return { slug: currentRoute.value.params.slug }
});

</script>

<style scoped lang="scss"></style>
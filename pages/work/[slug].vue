<template>
    <h1 v-if="data">
        slug : {{ data.slug }}
    </h1>
</template>
<script lang="ts" setup>
import { useFlowProvider } from '~/lib/waterflow/FlowProvider';
const { currentRoute } = useFlowProvider()
const routeSlug = currentRoute.value.params.slug
console.log(routeSlug);
const slug = typeof routeSlug === "string" ? routeSlug : routeSlug[0]

const { data, error } = await useAsyncData(`slug-${slug}`, async () => {
    const slugs = await $fetch("/api/getSlugs")
    const include = slugs.map(el => el.name).includes(slug)
    if (!include) throw "wrong slug"

    return { slug: currentRoute.value.params.slug }
});

if (error.value) {
    flowCreateError({ statusCode: 404, statusMessage: "Page Not Found" })
}

</script>

<style scoped lang="scss"></style>
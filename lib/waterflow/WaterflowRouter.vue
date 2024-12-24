<script setup lang="ts">
import type { RouteComponent, RouteLocationNormalized } from '#vue-router';

const { scrollTopApi } = defineProps<{ scrollTopApi?: () => void }>()
const router = useRouter()
const routes = router.getRoutes()

const { currentRoute, routeTo, crossfadeMode, hijackFlow, flowIsHijacked, flowIsHijackedPromise, flowInPromise } = useFlowProvider()

const pages: { component: RouteComponent, id: number }[] = shallowReactive([])

let idGen = 0
pages.push({
    id: ++idGen,
    component: await getComponent(currentRoute.value)
})
const routerGuard = router.beforeEach(async (to, from, next) => {
    if (!pageRef.value) return
    currentRoute.value = to

    const resolver = hijackFlow()

    const nextComponent = await getComponent(to)!
    pages.push({
        component: nextComponent,
        id: ++idGen
    })


    await nextTick()
    const _page = pageRef.value[pageRef.value?.length - 1]
    _page.style.opacity = "0"

    const flowInPromises = [...flowInPromise]
    const allExecptLast = flowInPromises.slice(0, -1)
    Promise.all(allExecptLast).then(async () => {
        _page.style.opacity = "1"
    })

    await Promise.all(flowInPromises)


    scrollTopApi && scrollTopApi()

    resolver()

    pages.shift()
    console.log("next", to.name);
    next()
})

async function getComponent(route: RouteLocationNormalized) {
    const componentGetter = routes.filter(el => {
        return el.name === route.name
    })[0].components?.default

    const component = typeof componentGetter === "function" ? (await (componentGetter as Function)()).default : componentGetter
    return component
}

const pageRef = useTemplateRef("pageRefs")
</script>

<template>
    <div class="custom-router__wrapper">
        <div class="page__wrapper" :class="[index === 0 ? 'current-page' : 'buffer-page']"
            v-for="(page, index) in pages" :key="page.id"
            :style="{ zIndex: 100 + index + ((index > flowIsHijackedPromise.length - flowInPromise.length) ? 50 : 0) }"
            ref="pageRefs">
            <component :is="page.component" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.custom-router__wrapper {
    position: relative;

}

.page__wrapper {
    top: 0;
    left: 0;
    width: 100%;
}

.current-page {
    z-index: 100;
    position: relative;
}

.buffer-page {
    position: fixed;
    pointer-events: none;
    height: var(--100vh);
    z-index: 150;
    top: 0;
    left: 0;
}
</style>
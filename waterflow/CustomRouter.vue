<script setup lang="ts">
import type { RouteComponent, RouteLocationNormalized } from '#vue-router';
import { delay } from '~/plugins/core/raf';
import { provideFlowProvider, useFlowProvider } from './FlowProvider';

const nuxtApp = useNuxtApp()

const router = useRouter()
const routes = router.getRoutes()

const { currentRoute } = useFlowProvider()

const componentLeft: Ref<RouteComponent | undefined> = shallowRef(undefined)
const componentRight: Ref<RouteComponent | undefined> = shallowRef(undefined)

componentRight.value = await getComponent(currentRoute.value)

let leftRight = true
const routerGuard = router.beforeEach(async (to, _from, next) => {
    // mount next page
    console.log("test delay");

    if (leftRight) componentLeft.value = await getComponent(to)!
    else componentRight.value = await getComponent(to)!
    leftRight = !leftRight

    await delay(1000)
    if (leftRight) componentLeft.value = undefined
    else componentRight.value = undefined
    next()
})

async function getComponent(route: RouteLocationNormalized) {
    const comp = routes.filter(el => {
        return el.path === route.path
    })[0].components?.default

    return typeof comp === "function" ? (comp as Function)() : comp
}
</script>

<template>
    <div class='page-a'>
        <component :is="componentLeft" />
    </div>
    <div class='page-b'>
        <component :is="componentRight" />
    </div>
</template>
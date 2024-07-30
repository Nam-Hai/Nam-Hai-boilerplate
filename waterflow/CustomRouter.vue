<script setup lang="ts">
import type { RouteComponent, RouteLocationNormalized } from '#vue-router';

const nuxtApp = useNuxtApp()

const router = useRouter()
const routes = router.getRoutes()
console.log(routes);

const componentLeft: Ref<RouteComponent | undefined> = shallowRef(undefined)
const componentRight: Ref<RouteComponent | undefined> = shallowRef(undefined)

componentRight.value = await getComponent(router.currentRoute.value)

const routerGuard = router.beforeEach(async (to, _from, next) => {
    await new Promise<void>(async res => {
        // mount next page
        console.log("test delay");

        componentLeft.value = await getComponent(to)!

        useDelay(1000, () => {
            componentRight.value = undefined
            res()
        })
    })
    next()
})
// // const done = nuxtApp.deferHydration()

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
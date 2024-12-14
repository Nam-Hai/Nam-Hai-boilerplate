<script setup lang="ts">
import type { RouteComponent, RouteLocationNormalized } from '#vue-router';
import { provideFlowProvider, useFlowProvider } from './FlowProvider';

const nuxtApp = useNuxtApp()
const router = useRouter()
const routes = router.getRoutes()

const { currentRoute, routeTo, routeFrom, hijackFlow, releaseHijackFlow, flowInPromise } = useFlowProvider()

const currentPage: Ref<RouteComponent | undefined> = shallowRef(undefined)
const bufferPage: Ref<RouteComponent | undefined> = shallowRef(undefined)

const pageObject = {
    currentPage,
    bufferPage
}
pageObject.currentPage.value = await getComponent(currentRoute.value)

const routerGuard = router.beforeEach(async (to, _from, next) => {
    routeFrom.value = routeTo.value
    routeTo.value = to

    hijackFlow()

    pageObject.bufferPage.value = await getComponent(to)!

    await nextTick()
    console.log(flowInPromise.value);
    await Promise.all([flowInPromise.value])
    next()
})

router.afterEach(async (to, from, failure) => {
    currentRoute.value = routeTo.value

    const temp = pageObject.currentPage

    pageObject.currentPage = pageObject.bufferPage
    pageObject.bufferPage = temp
    pageObject.bufferPage.value = undefined

    swapClass()

    releaseHijackFlow()
})

async function getComponent(route: RouteLocationNormalized) {
    const comp = routes.filter(el => {
        return el.path === route.path
    })[0].components?.default

    return typeof comp === "function" ? (comp as Function)() : comp
}

const wrapperA = shallowRef()
const wrapperB = shallowRef()

const swapClass = () => {
    wrapperA.value.classList.toggle('buffer-page')
    wrapperA.value.classList.toggle('current-page')

    wrapperB.value.classList.toggle('buffer-page')
    wrapperB.value.classList.toggle('current-page')
}
</script>

<template>
    <div class="custom-router__wrapper">
        <div class='page-a current-page' ref="wrapperA">
            <component :is="currentPage" />
        </div>
        <div class='page-b buffer-page' ref="wrapperB">
            <component :is="bufferPage" />
        </div>
    </div>
</template>

<style lang="scss">
.custom-router__wrapper {
    position: relative;
    // overflow: scroll;
    height: 100vh;
    width: 100vw;
}

.page-a {
    left: 0;
}

.page-b {
    right: 0;
}

.page-a,
.page-b {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
}

.current-page {}
</style>
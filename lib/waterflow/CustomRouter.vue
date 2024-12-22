<script setup lang="ts">
import type { RouteComponent, RouteLocationNormalized } from '#vue-router';
import { useFlowProvider } from './FlowProvider';

const { scrollTopApi } = defineProps<{ scrollTopApi: () => void }>()
const router = useRouter()
const routes = router.getRoutes()

const { currentRoute, routeTo, routeFrom, hijackFlow, flowIsHijacked, releaseHijackFlow, flowInPromise } = useFlowProvider()

const currentPage: Ref<RouteComponent | undefined> = shallowRef(undefined)
const bufferPage: Ref<RouteComponent | undefined> = shallowRef(undefined)

const pageObject = {
    currentPage,
    bufferPage
}
pageObject.currentPage.value = await getComponent(currentRoute.value)

const routerGuard = router.beforeEach(async (to, from, next) => {
    if (flowIsHijacked.value) return
    routeFrom.value = routeTo.value
    routeTo.value = to

    hijackFlow()

    pageObject.bufferPage.value = await getComponent(to)!
    await nextTick()
    await Promise.all([flowInPromise.value])
    next()
})

router.afterEach(async (to, from, failure) => {
    if (checkEqualRoute(to, from)) return
    currentRoute.value = routeTo.value

    const temp = pageObject.currentPage

    pageObject.currentPage = pageObject.bufferPage
    pageObject.bufferPage = temp
    pageObject.bufferPage.value = undefined

    swapClass()
    scrollTopApi()

    console.log("router.after each resolved");
    releaseHijackFlow()
})

function checkEqualRoute(from: RouteLocationNormalized, to: RouteLocationNormalized) {
    return from.fullPath === to.fullPath && from.hash === to.hash
}

async function getComponent(route: RouteLocationNormalized) {
    const componentGetter = routes.filter(el => {
        return el.path === route.path
    })[0].components?.default

    const component = typeof componentGetter === "function" ? (await (componentGetter as Function)()).default : componentGetter
    return component
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

}

.page-a {
    left: 0;
}

.page-b {
    right: 0;
}

.page-a,
.page-b {
    top: 0;
    width: 100%;
}

.current-page {
    z-index: 50;
    position: relative;
}

.buffer-page {
    z-index: 100;
    position: fixed;
    pointer-events: none;
    height: var(--100vh);
}
</style>
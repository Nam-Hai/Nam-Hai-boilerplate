<script lang="ts" setup>
import { Transform } from 'ogl';
import { createRenderer, Fragment, type App } from 'vue-demi';
import { provideOGL, type OGLContext } from './useOGL';
import { nodeOps } from './CustomRenderer';
import { provideFlowProvider } from '~/waterflow/FlowProvider';

const canvasRef = shallowRef() as Ref<HTMLCanvasElement>

const instance = getCurrentInstance()?.appContext.app
console.log("instance : ", instance);
const slots = defineSlots<{
    default: () => any
}>()
const scene = shallowRef<Transform>(new Transform())

const createInternalComponent = (context: OGLContext) =>
    defineComponent({
        setup() {
            const ctx = getCurrentInstance()?.appContext
            if (ctx) { ctx.app = instance as App }
            provide('ogl', context)

            provideFlowProvider({})

            const slot = slots?.default ? slots.default() : []
            return () => h(Fragment, null, slot)
        },
    })

const mountCustomRenderer = (context: OGLContext) => {
    const InternalComponent = createInternalComponent(context)
    const { render, createApp } = createRenderer(nodeOps(context))

    const component = h(InternalComponent)
    const app = createApp(component)
    app.mount(scene.value)
}
const context = shallowRef<OGLContext | null>(null)

const dispose = (context: OGLContext, force = false) => {
    // disposeObject3D(context.scene.value as unknown as Transform)
    // if (force) {
    //     context.renderer.value.dispose()
    //     context.renderer.value.renderLists.dispose()
    //     context.renderer.value.forceContextLoss()
    // }
    // (scene.value as TresScene).__tres = {
    //     root: context,
    // }
    // mountCustomRenderer(context)
}
defineExpose({ context, dispose: () => dispose(context.value as any, true) })

onMounted(() => {
    const existingCanvas = canvasRef as Ref<HTMLCanvasElement>
    context.value = provideOGL(existingCanvas.value)
    mountCustomRenderer(context.value)


    // useDelay(4000, () => {
    //     if (!context.value) return
    //     context.value.testRef.value = Math.random()
    // })
    watch(context.value.testRef, (val) => {
        console.log(val);
    })
    // HMR support
    if (import.meta.hot && context.value) {
        import.meta.hot.on('vite:afterUpdate', (payload) => {
            console.warn("VITE AFTER UPDATE", payload);
            dispose(context.value as OGLContext)
        })
    }
})
const wrapperRef = shallowRef() as Ref<HTMLElement>

</script>

<template>
    <canvas ref="canvasRef" />
</template>

<style scoped>
.canvas__wrapper {
    position: fixed;
    inset: 0;
}
</style>
import type { RouteComponent, RouteLocationNormalized, RouteRecord } from "#vue-router";

export default defineComponent({
    name: "CustomRouter",
    async setup(props, { attrs, slots, expose }) {
        const nuxtApp = useNuxtApp()

        const router = useRouter()
        const routes = router.getRoutes()
        console.log(routes);

        const componentLeft: Ref<RouteComponent | null> = shallowRef(null)
        const componentRight: Ref<RouteComponent | null> = shallowRef(null)
        const vLeft = shallowRef(false)
        const vRight = shallowRef(true)

        componentRight.value = await getComponent(router.currentRoute.value)
        console.log(componentRight.value);
        const routerGuard = router.beforeEach(async (to, _from, next) => {
            await new Promise<void>(async res => {
                // mount next page
                console.log("test delay");

                componentLeft.value = await getComponent(to)!
                vLeft.value = true
                console.log(componentLeft.value);

                useDelay(1000, () => {
                    // componentRight.value = null
                    vRight.value = false
                    res()
                })
            })
            next()
        })
        // const done = nuxtApp.deferHydration()

        async function getComponent(route: RouteLocationNormalized) {
            const comp = routes.filter(el => {
                return el.path === route.path
            })[0].components!.default
            return typeof comp === "function" ? (comp as Function)() : comp
        }

        return () => {
            return (
                <>
                    <div class={'page-a'}>
                        {componentLeft.value}
                        {(vLeft.value && !!componentLeft.value) ? h(componentLeft.value) : "test"}
                    </div>
                    <div class={'page-b'}>
                        {(vRight.value && !!componentRight.value) ? h(componentRight.value) : "rrrrrrrrrrr"}
                    </div>
                </>
            );
        }
    }
})
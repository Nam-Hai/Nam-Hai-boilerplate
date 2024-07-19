import { RouterView } from "#vue-router"

export default defineComponent({
    name: "CustomRouter",
    setup(props, { attrs, slots, expose }) {

        return ()=> {
            return h(RouterView)
        }
    }
})
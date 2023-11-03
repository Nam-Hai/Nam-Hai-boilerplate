
class CursorService {
    cursorState: globalThis.Ref<'active' | 'default'>

    constructor() {
        this.cursorState = ref('active')
    }


    toggleMouse = (active: boolean) => {
        this.cursorState.value = active ? 'active' : 'default'
    }
}

const cursorStore = new CursorService()
export default cursorStore
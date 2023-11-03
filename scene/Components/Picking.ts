import Callstack from "../utils/Callstack";

const { mouse } = useStore()

// Alpha Picker
export default class Picker {
    needUpdate: boolean;
    indexPicked: null | number;
    gl: any;
    clickEvent: boolean;
    hoverCallstack: Callstack;
    clickCallstack: Callstack;
    dpr: number;

    constructor(gl: any) {
        this.gl = gl

        this.dpr = devicePixelRatio

        this.needUpdate = false
        this.indexPicked = null
        this.clickEvent = false

        N.BM(this, ['onClick', 'onMouseMove'])
        document.addEventListener('click', this.onClick)
        document.addEventListener('mousemove', this.onMouseMove)

        this.clickCallstack = new Callstack()
        this.hoverCallstack = new Callstack()
    }
    onClick() {
        this.needUpdate = true
        this.clickEvent = true
    }

    onMouseMove() {
        this.needUpdate = true
    }

    pick() {
        const data = new Uint8Array(4);
        this.gl.readPixels(
            mouse.x * this.dpr,
            mouse.y * this.dpr,
            1,
            1,
            this.gl.RGBA,           // format
            this.gl.UNSIGNED_BYTE,  // type
            data);             // typed array to hold result

        const index = data[3] - 1
        this.indexPicked = index >= 0 ? index : null

        this.needUpdate = false

        this.hoverCallstack.call()

        if (this.clickEvent) {
            this.clickCallstack.call()
            this.clickEvent = false
        }
    }

    destroy() {
        document.removeEventListener('click', this.onClick)
    }
}
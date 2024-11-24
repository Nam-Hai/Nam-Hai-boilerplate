
import { EaseEnum, type Ease4Arg, type EaseFunctionName, Ease, Ease4 } from "~/plugins/core/eases";
import { Frame, FramePriority, type FrameEvent, Delay, FrameFactory } from "./frame";

const STYLE_MAP = {
    o: "--stop-motion-opacity",
    x: "--stop-motion-x",
    y: "--stop-motion-y",
    s: "--stop-motion-scaleX",
    scaleX: "--stop-motion-scaleX",
    scaleY: "--stop-motion-scaleY",
    r: "--stop-motion-rotate",
} as const;

type MotionEvent = { progress: number, easeProgress: number }
interface StopMotionOptionPrimitive {
    e?: EaseFunctionName | Ease4Arg
    d?: number,
    delay?: number,
    cb?: () => void,
    reverse?: boolean
    update?: (e: MotionEvent) => void,
}
interface StopMotionOptionPrimitiveI extends StopMotionOptionPrimitive {
    svg?: never,
    el?: never,
    p?: never
}

type FromTo = [number, number]
type DOMPropName = "x" | "y" | "o" | "s" | "scaleX" | "scaleY" | "r"
interface StopMotionOptionBasicDOMAnimation extends StopMotionOptionPrimitive {
    el: HTMLElement,
    p: {
        x?: [number, number, string] | [number, number]
        y?: [number, number, string] | [number, number]
        o?: FromTo
        s?: FromTo
        scaleX?: FromTo
        scaleY?: FromTo
        r?: FromTo | [number, number, string]
    },
    override?: boolean,
    svg?: never,
}
interface StopMotionUpdatePropsOption extends StopMotionOptionPrimitive {
    p?: {
        [K in DOMPropName]?: {
            start?: number,
            end?: number
        }
    },
    override?: boolean
}

interface StopMotionOptionSvg extends StopMotionOptionPrimitive {
    el: NodeList | HTMLElement,
    svg: {
        end: string,
        start?: string,
        type?: string
    },
    p?: never,
}

export type StopMotionOption = StopMotionOptionSvg | StopMotionOptionBasicDOMAnimation | StopMotionOptionPrimitiveI

let MotionId = 0
type MotionItem = {
    ticker: Ticker
    startTime?: number
}
export class MotionManager {

    motions: MotionItem[]
    frame: Frame;
    tickerStore: Map<number, Record<string, number>>
    frameFactory: FrameFactory;
    constructor(frameFactory: FrameFactory) {

        this.frameFactory = frameFactory;

        N.BM(this, ["raf"])
        this.motions = []

        this.frame = this.frameFactory.Frame({ callback: this.raf, priority: FramePriority.MOTION })
        this.frame.run()

        this.tickerStore = new Map()
    }

    add(ticker: Ticker) {
        this.motions.push({ ticker })
    }

    remove(id: number) {
        const i = N.binarySearch(this.motions.map(el => { return { id: el.ticker.id } }), id)

        if (i == -1) {
            console.warn("Motion remove jammed : id not in stack")
            return
        }

        const motions = this.motions.splice(i, 1)
        if (motions.length === 0) return
        const { ticker } = motions[0]
        const vars = ticker.vars

        this.tickerStore.set(ticker.id, vars)
    }

    raf(e: FrameEvent) {
        for (let i = this.motions.length - 1; i >= 0; i--) {
            const item = this.motions[i]
            const ticker = item.ticker

            item.startTime = item.startTime || e.elapsed

            const t = N.Clamp(e.elapsed - item.startTime, 0, ticker.d)
            if (ticker.d == 0) {
                ticker.prog = 1
                ticker.progE = 1
            } else {
                ticker.prog = N.Clamp(t / ticker.d, 0, 1)
            }
            ticker.progE = ticker.calc!(ticker.prog)
            ticker.update({ progress: ticker.prog, easeProgress: ticker.progE })

            if (ticker.prog === 1) {
                this.remove(ticker.id)
                ticker.cb && ticker.cb()
            }
        }
    }
}

export class MotionFactory {
    motionManager: MotionManager;
    constructor(motionManager: MotionManager) {
        this.motionManager = motionManager
        N.BM(this, ["Motion", "Film"])
    }

    Motion(options: StopMotionOption) {
        return new Motion(options, this.motionManager)
    }
    Film() {
        return new Film(this.motionManager)
    }
}

export class Motion {
    ticker: Ticker[];
    delay!: Delay;
    promise: Promise<void>;
    promiseRelease!: (value: void | PromiseLike<void>) => void;
    id?: number;
    motionManager: MotionManager;

    constructor(option: StopMotionOption, motionManager: MotionManager) {
        this.motionManager = motionManager
        this.ticker = TickerFactory.createTicker(option, this.motionManager)

        this.promise = new Promise<void>(res => {
            this.promiseRelease = res
        })
    }

    pause() {
        this.delay && this.delay.stop()
        for (const ticker of this.ticker) {
            this.motionManager.remove(ticker.id)
        }

        // this.id = undefined
        return this
    }
    play(prop?: StopMotionUpdatePropsOption) {
        this.pause()

        for (const ticker of this.ticker) {
            ticker.updateProps(prop)
        }

        const delay = this.ticker[0].delay || 0
        this.delay = this.motionManager.frameFactory.Delay({
            delay,
            callback: () => {
                for (const ticker of this.ticker) {
                    this.motionManager.add(ticker)
                }
            }
        })
        this.delay.run()

        this.promise = new Promise<void>(res => {
            this.promiseRelease = res
        })

        return this.promise
    }
}

class TickerFactory {
    static createTicker(props: StopMotionOption, motionManager: MotionManager) {
        let ticker: Ticker[]
        if (props.svg && false) {
            props.svg
            // TODO
        } else if (props.p) {
            const elements = N.Select(props.el)
            ticker = Object.values(elements as HTMLElement[]).map(el => new TickerDOMAnimation({ ...props, el: el }, motionManager))
        } else {
            ticker = [new Ticker(props, motionManager)]
        }

        return ticker
    }
}

interface TickerI {
    update: (e: MotionEvent) => void
    updateProps: (props?: StopMotionUpdatePropsOption) => void
}

class Ticker implements TickerI {
    reverse: boolean;
    cb: (() => void) | undefined;
    ease: EaseFunctionName | Ease4Arg;
    delay: number;
    d: number;
    calc: (t: number) => number;
    prog: number = 0
    progE: number = 0
    updateFunc?: (e: MotionEvent) => void;

    id: number

    vars: { [key: string]: number } = {}
    motionManager: MotionManager;
    constructor(props: StopMotionOptionPrimitive, motionManager: MotionManager) {
        this.motionManager = motionManager
        this.d = props.d || 0
        this.delay = props.delay || 0
        this.cb = props.cb
        this.reverse = props.reverse || false
        this.ease = props.e || EaseEnum.linear
        this.calc = typeof this.ease === "string" ? Ease[this.ease] : Ease4(this.ease)
        this.updateFunc = props.update

        MotionId++
        this.id = MotionId

        if (this.reverse === true) {
            const ease = this.calc
            // this.calc = (t: number) => 1 - ease(t)
        }
    }

    update(e: MotionEvent) {
        if (this.updateFunc !== undefined) {
            this.updateFunc(e)
        }
    }

    updateProps(props?: StopMotionUpdatePropsOption) {
        if (!props) return
        MotionId++
        this.id = MotionId
        this.d = props.d || this.d
        this.delay = props.delay || this.delay
        this.ease = props.e || this.ease
        this.cb = props.cb || this.cb
        this.reverse = props.reverse || this.reverse
        this.updateFunc = props.update

        this.calc = typeof this.ease === "string" ? Ease[this.ease] : Ease4(this.ease)

        // if (this.reverse === true) {
        //     const ease = this.calc
        //     // this.calc = (t: number) => 1 - ease(t)
        // }
    }
}

type DOMProp = {
    curr: number,
    start: number,
    end: number,
    unit: string
}

class TickerDOMAnimation extends Ticker implements TickerI {

    props = new Map<DOMPropName, DOMProp>()
    el: HTMLElement;
    override: boolean | undefined;
    constructor(props: StopMotionOptionBasicDOMAnimation, motionManager: MotionManager) {
        super(props, motionManager)

        this.el = props.el

        this.override = props.override || false
        for (const [key, value] of Object.entries(props.p)) {
            const k = key as DOMPropName & string;

            const from = value[0]
            const to = value[1]
            const unit = value[2] || "%"


            this.props.set(k, {
                curr: this.reverse ? to : from,
                start: from,
                end: to,
                unit
            })
        }
    }

    override update(e: MotionEvent) {
        super.update(e)
        for (const [key, prop] of this.props.entries()) {
            prop.curr = N.Lerp(prop.start, prop.end, e.easeProgress)
            this.vars[key] = prop.curr
        }
        const table = this.props;

        const x = table.has("x"), y = table.has("y")
        const translate = x || y
        const opacity = table.has("o")
        const scale = table.has("s")
        const scaleX = table.has("scaleX")
        const scaleY = table.has("scaleY")
        const rotate = table.has("r")

        if (!this.el) return
        const element = this.el

        if (translate) {
            N.Class.add(element, "stop-motion__translate")
            if (x) {
                const value = this.props.get("x")!
                element.style.setProperty("--stop-motion-x", value.curr + value.unit)
            }
            if (y) {
                const value = this.props.get("y")!
                element.style.setProperty("--stop-motion-y", value.curr + value.unit)
            }
        }

        if (opacity) {
            N.Class.add(element, "stop-motion__opacity")
            const value = this.props.get("o")!
            element.style.setProperty("--stop-motion-opacity", value.curr + "")
        }

        if (scale || scaleX || scaleY) N.Class.add(element, "stop-motion__scale")
        if (scale) {
            const scaleValue = this.props.get("s")!.curr + ""
            element.style.setProperty("--stop-motion-scaleX", scaleValue)
            element.style.setProperty("--stop-motion-scaleY", scaleValue)
        } else if (scaleX) {
            const scaleValue = this.props.get("scaleX")!.curr + ""
            element.style.setProperty("--stop-motion-scaleX", scaleValue)
        } else if (scaleY) {
            const scaleValue = this.props.get("scaleY")!.curr + ""
            element.style.setProperty("--stop-motion-scaleY", scaleValue)

        }

        if (rotate) {
            N.Class.add(element, "stop-motion__rotate")
            const prop = this.props.get("r")!
            const rotateValue = prop.curr + (prop.unit === "%" ? "deg" : prop.unit)
            element.style.setProperty("--stop-motion-rotate", rotateValue)
        }
    }


    override updateProps(arg?: StopMotionUpdatePropsOption) {
        const id = N.Ga(this.el, "data-stop-motion")
        !!id && this.motionManager.remove(+id)
        const currProps = !!id && this.motionManager.tickerStore.get(+id) || {}
        !!id && this.motionManager.tickerStore.delete(+id)
        super.updateProps(arg)

        this.override = arg?.override || this.override

        this.el.setAttribute("data-stop-motion", `${this.id}`)

        for (const [key, prop] of this.props.entries()) {
            prop.end = this.reverse ? prop.start : prop.end

            if (!this.override) {
                const value = currProps[key]
                if (value) prop.curr = value
            }
            prop.start = prop.curr

            if (arg && arg.p && arg.p[key]) {
                if (!!arg.p[key]?.end) {
                    const end = arg.p[key]!.end!
                    prop.end = end
                }
                if (arg.p[key]?.start) {
                    const start = arg.p[key]!.start!
                    prop.start = start
                }
            }
        }
    }

}
const Svg = {
    getLength: (e: Element) => {
        if ("circle" === e.tagName) return 2 * Math.PI * (+N.Ga(e, "r")!)
        if ('line' === e.tagName) {
            let a, b, c, d;
            a = +N.Ga(e, 'x1')!
            b = +N.Ga(e, "x2")!
            c = +N.Ga(e, 'y1')!
            d = +N.Ga(e, 'y2')!

            return Math.sqrt((a -= b) * a + (c -= d) * c)
        }
        if ("polyline" !== e.tagName) return (e as SVGGeometryElement).getTotalLength()
        let poly = e as SVGPolylineElement, n = poly.points.numberOfItems
        let length = 0, previousItem = poly.points.getItem(0);
        for (let index = 1; index < n; index++) {
            let item = poly.points.getItem(index)
            length += Math.sqrt((item.x - previousItem.x) ** 2 + (item.y - previousItem.y) ** 2)
            previousItem = item
        }
        return length
    },
    split: (pointsString: string) => {
        const s: Array<string | number> = [],
            r = pointsString.split(" ");
        for (const partial of r) {
            let part = partial.split(',')
            for (const p of part) {
                if (isNaN(+p)) {
                    s.push(p)
                } else {
                    s.push(+p)
                }
            }
        }
        return s
    }
}

export class Film {

    stopMotions: Motion[]
    on: boolean
    motionManager: MotionManager;

    constructor(motionManager: MotionManager) {
        this.motionManager = motionManager
        this.stopMotions = []
        this.on = false
    }

    from(props: StopMotionOption) {

        const stopMotion = new Motion(props, this.motionManager)
        this.stopMotions.push(stopMotion)
        return this
    }

    getPromise() {
        return Promise.all(this.stopMotions.map(motion => motion.promise))
    }

    play(props?: StopMotionUpdatePropsOption) {
        const promises = this.stopMotions.map(motion => motion.play(props))

        return Promise.all(promises)
    }

    pause() {
        for (let i = this.stopMotions.length - 1; i >= 0; i--) {
            const stopMotion = this.stopMotions[i]
            stopMotion.pause()
        }
    }

    reset() {
        for (let i = this.stopMotions.length - 1; i >= 0; i--) {
            const motion = this.stopMotions[i]
            motion.pause()
        }

        this.stopMotions = []
    }
}
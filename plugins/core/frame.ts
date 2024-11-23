import { OrderedMap } from "~/utils/namhai"
import { N } from "~/utils/namhai"

enum FramePriority {
    FIRST = 0,

    DELAY = 50,
    MOTION = 100,
    MAIN = 500,

    LAST = 10000
}

type FrameEvent = {
    elapsed: number,
    delta: number
}

type FrameItem = {
    id: number,
    cb: (e: FrameEvent) => void,
    startTime?: number
}

class TabManager {
    array: {
        stop: () => void,
        resume: (delta: number) => void
    }[]
    pause: number
    constructor() {
        this.array = []
        this.pause = 0

        N.BM(this, ["update"])
        document.addEventListener("visibilitychange", this.update)
    }
    add(arg: { stop: () => void, resume: (delta: number) => void }) {
        this.array.push(arg)
    }

    // calcule le temps entre le moment ou pas visible a visible, puis actionne, tOff() ou tOn(r)
    update(e: Event) {
        const t = e.timeStamp;
        let dT = 0

        if (document.hidden) {
            this.pause = t
        } else {
            dT = t - this.pause
        }
        for (let index = this.array.length - 1; 0 <= index; --index) {
            if (document.hidden) {
                this.array[index].stop()
            } else {
                this.array[index].resume(dT)
            }
        }
    }
}

class FrameManager {
    now: number = 0;
    on: boolean;

    private stack: OrderedMap<number, FrameItem[]>;

    constructor(tab: TabManager) {
        N.BM(this, ['update', 'stop', 'resume'])

        this.stack = new OrderedMap<number, FrameItem[]>()
        this.stack.set(FramePriority.FIRST, [])
        this.stack.set(FramePriority.MAIN, [])
        this.stack.set(FramePriority.LAST, [])


        this.on = true
        tab.add({ stop: this.stop, resume: this.resume })
        this.raf()
        // isClient && this.raf()
    }

    resume(delta = 0) {
        this.on = true
        for (const key of this.stack.orderedKeys) {
            const stack = this.stack.get(key)!
            for (const frameItem of stack) {
                frameItem.startTime! += delta
            }
        }
        this.now += delta
    }
    stop() {
        this.on = false
    }

    add(frameItem: FrameItem, priority: number) {
        if (!this.stack.has(priority)) {
            this.stack.set(priority, [])
        }
        const stack = this.stack.get(priority)!
        stack.push(frameItem)
        if (priority === FramePriority.MAIN && stack.length > 10000) console.warn("Main raf stack congested", stack.length)
    }

    remove(id: number, priority: number) {
        if (!this.stack.has(priority)) {
            console.error("Raf remove jammed : priority stack doesn't exist")
            return
        }
        const stack = this.stack.get(priority)!
        const i = N.binarySearch(stack, id)

        if (i == -1) {
            console.warn("Raf remove jammed : id not in stack")
            return
        }
        stack.splice(i, 1)
    }

    update(t: number) {
        const delta = t - (this.now || t - 16)
        this.now = t

        if (Math.floor(1 / delta * 1000) < 20) {
            console.warn("Huge frame drop")
        }

        if (this.on) {
            for (const key of this.stack.orderedKeys) {
                const stack = this.stack.get(key)!

                for (let index = stack.length - 1; index >= 0; index--) {
                    const frameItem = stack[index]
                    if (!frameItem.startTime) {
                        frameItem.startTime = t
                    }

                    const elapsed = t - frameItem.startTime
                    frameItem.cb({ elapsed, delta })
                }
            }
        }

        this.raf()
    }

    private raf() {
        requestAnimationFrame(this.update)
    }


}

class FrameFactory {
    FrameManager: FrameManager
    constructor(FrameManager: FrameManager) {
        this.FrameManager = FrameManager
        N.BM(this, ["Frame", "Delay", "Timer"])
    }
    Frame(options: Omit<ConstructorParameters<typeof Frame>[0], "FrameManager">) {
        return new Frame({ ...options, FrameManager: this.FrameManager })
    }
    Delay(options: Omit<ConstructorParameters<typeof Delay>[0], "FrameManager">) {
        return new Delay({ ...options, FrameManager: this.FrameManager })
    }
    Timer(options: Omit<ConstructorParameters<typeof Timer>[0], "FrameManager">) {
        return new Timer({ ...options, FrameManager: this.FrameManager })
    }
}

let FrameId = 0
class Frame {
    readonly callback: (e: FrameEvent) => void;
    readonly priority: number;
    private killed: boolean;
    on: boolean
    id?: number
    FrameManager!: FrameManager

    constructor(options: { callback: (e: FrameEvent) => void, priority?: number, FrameManager: FrameManager }) {
        N.BM(this, ["stop", "run", "kill"])
        this.FrameManager = options.FrameManager
        this.callback = options.callback
        this.priority = options.priority || FramePriority.MAIN

        this.on = false
        this.killed = false
    }

    run(startTime?: number) {
        if (this.on || this.killed) return this
        this.on = true
        FrameId++
        this.id = FrameId
        const frameItem: FrameItem = {
            id: this.id,
            cb: this.callback,
            startTime: startTime ? this.FrameManager.now - startTime : undefined
        }

        this.FrameManager.add(frameItem, this.priority)
        return this
    }

    stop() {
        if (!this.on) return this
        this.on = false

        this.id && this.FrameManager.remove(this.id, this.priority)
        return this
    }

    kill() {
        this.stop()
        this.killed = true
        return this
    }
}

class Delay {
    readonly cb: (lateStart?: number) => void;
    readonly delay: number;
    private frame: Frame;
    constructor(options: { delay: number, callback: (lateStart?: number) => void, FrameManager: FrameManager }) {
        const { callback, delay, FrameManager } = options

        N.BM(this, ["update", "stop", "run"])
        this.cb = options.callback
        this.delay = options.delay

        this.frame = new Frame({ callback: this.update, priority: FramePriority.DELAY, FrameManager })

    }

    run() {
        if (this.delay === 0) return this.cb()

        this.frame.run()
    }

    stop() {
        this.frame.stop()
    }

    update(e: FrameEvent) {
        const t = N.Clamp(e.elapsed, 0, this.delay)

        if (t >= this.delay) {
            this.stop()
            const lateStart = e.elapsed - this.delay
            this.cb(lateStart)
        }
    }
}

class Timer {
    private ticker: Delay
    constructor(options: { callback: () => void, delay: number, FrameManager: FrameManager }) {
        const { callback, delay = 200, FrameManager } = options
        this.ticker = new Delay({ delay, callback, FrameManager })
    }

    tick() {
        this.ticker.stop()
        this.ticker.run()
    }

    stop() {
        this.ticker.stop()
    }
}

export { Frame, Delay, Timer, FramePriority, TabManager, FrameManager, FrameFactory }
export type { FrameItem, FrameEvent }
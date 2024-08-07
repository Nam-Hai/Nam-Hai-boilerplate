import { OrderedMap } from "~/plugins/core/utils"

const isClient = typeof window !== "undefined"

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

const Tab = new class {
    array: {
        stop: () => void,
        resume: (delta: number) => void
    }[]
    pause: number
    constructor() {
        this.array = []
        this.pause = 0
        N.BM(this, ["v"])

        isClient && document.addEventListener("visibilitychange", this.v)
    }
    add(arg: { stop: () => void, resume: (delta: number) => void }) {
        this.array.push(arg)
    }

    // calcule le temps entre le moment ou pas visible a visible, puis actionne, tOff() ou tOn(r)
    v(e: Event) {
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

const FrameManager = new class {
    now: number = 0;
    _on: boolean;
    private set on(on: boolean) {
        this._on = on
    }

    public get on(): boolean {
        return this._on
    };

    private stack: OrderedMap<number, FrameItem[]>;

    constructor() {
        N.BM(this, ['update', 'stop', 'resume'])

        console.log('Frame Manager init');
        this.stack = new OrderedMap<number, FrameItem[]>()
        this.stack.set(FramePriority.FIRST, [])
        this.stack.set(FramePriority.MAIN, [])
        this.stack.set(FramePriority.LAST, [])


        this._on = true
        Tab.add({ stop: this.stop, resume: this.resume })
        isClient && this.raf()
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
        const i = binarySearch(stack, id)

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
            // console.log(this.stack.get(FramePriority.MAIN)!.length);
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

let FrameId = 0
class Frame {
    readonly cb: (e: FrameEvent) => void;
    readonly priority: number;
    private killed: boolean;
    on: boolean
    id?: number

    constructor(cb: (e: FrameEvent) => void, priority: number = FramePriority.MAIN) {
        N.BM(this, ["stop", "run", "kill"])
        this.cb = cb
        this.priority = priority

        this.on = false
        this.killed = false

    }

    run(startTime?: number) {
        if (this.on || this.killed) return
        this.on = true
        FrameId++
        this.id = FrameId
        const frameItem: FrameItem = {
            id: this.id,
            cb: this.cb,
            startTime: startTime ? FrameManager.now - startTime : undefined
        }
        // if (startTime !== undefined) {
        //     frameItem.startTime = FrameManager.now - startTime
        // }

        FrameManager.add(frameItem, this.priority)
    }

    stop() {
        if (!this.on) return
        this.on = false

        this.id && FrameManager.remove(this.id, this.priority)
    }

    kill() {
        this.stop()
        this.killed = true
    }
}

class Delay {
    readonly cb: (lateStart?: number) => void;
    readonly delay: number;
    private frame: Frame;
    constructor(delay: number, callback: (lateStart?: number) => void) {
        N.BM(this, ["update", "stop", "run"])
        this.cb = callback
        this.delay = delay

        this.frame = new Frame(this.update, FramePriority.DELAY)
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
    constructor(callback: () => void, delay: number = 200) {
        this.ticker = new Delay(delay, callback)
    }

    tick() {
        this.ticker.stop()
        this.ticker.run()
    }

    stop() {
        this.ticker.stop()
    }
}



export function binarySearch(arr: { id: number }[], n: number): number {
    let left = 0
    let right = arr.length - 1

    while (left <= right) {
        const mid = Math.floor((right - left) / 2) + left
        const m = arr[mid].id

        if (n === m) {
            return mid;
        } else if (n < m) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    return left
}

export { Frame, Delay, Timer, FramePriority }
export type { FrameItem, FrameEvent }
import { BM, Is, Clamp } from "./utils";

function Now() {
    return (typeof performance === 'undefined' ? Date : performance).now();
}

const isClient = typeof window !== "undefined"

export enum RafPriority {
    FIRST = 0,

    // To be sure the Motions are computed before Regular rafs
    MOTION = 1,
    NORMAL = 2,

    LAST = 3
}

export type rafItem = {
    id: number,
    cb: (arg: { elapsed: number, delta: number }) => void,
    startTime?: number
}
export type rafEvent = {
    elapsed: number,
    delta: number
}

type TabArg = {
    stop: () => void,
    start: (delta: number) => void
}
const Tab = new class {
    arr: TabArg[]
    pause: number
    constructor() {
        this.arr = []
        this.pause = 0
        N.BM(this, ["v"])

        if (isClient) document.addEventListener("visibilitychange", this.v)
    }
    add(arg: { stop: () => void, start: (delta: number) => void }) {
        this.arr.push(arg)
    }

    // calcule le temps entre le moment ou pas visible a visible, puis actionne, tOff() ou tOn(r)
    v() {
        var t = performance.now();
        let dT: number = 0, s: 'stop' | 'start';
        // s = document.hidden ? (this.pause = t, "stop") : (r = t - this.pause, "start");

        if (document.hidden) {
            this.pause = t
            s = 'stop'
        } else {
            dT = t - this.pause
            s = 'start'
        }
        for (let index = this.arr.length - 1; 0 <= index; --index) {
            this.arr[index][s](dT)
        }
    }
}


function binarySearch(arr: { id: number }[], n: number): number {
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

    return -1
}

const Raf = new class {
    arr: [rafItem[], rafItem[], rafItem[], rafItem[]]
    on: boolean;
    now: number = 0;
    constructor() {
        // 4 stack for low, medium, high priority
        this.arr = [[], [], [], []]


        this.on = !0
        BM(this, ['update', 'stop', 'resume'])
        Tab.add({ stop: this.stop, start: this.resume })
        this.raf()
    }

    stop() {
        this.on = false
    }
    resume(delta: number) {
        for (const arr of this.arr) {
            for (const el of arr) {
                el.startTime! += delta
            }
        }
        this.now += delta
        this.on = true
    }

    add(rafItem: rafItem, priority: RafPriority) {
        this.arr[priority].push(rafItem)
        if (this.arr[2].length > 10000) console.warn("Main Raf congested", this.arr.length)
    }

    // take advantage to the fact we sorted the rafscallbacks
    remove(id: number, priority: RafPriority): void {
        const i = binarySearch(this.arr[priority], id)

        if (i == -1) {
            console.warn("Raf remove jammed")
            return
        }
        this.arr[priority].splice(i, 1)
    }

    update(t: number) {
        let d = t - this.now
        d = d > 40 ? 40 : d;
        this.now = t
        const _arr = this.arr

        if (Math.floor(1 / d * 1000) < 20) {
            console.debug("frame droped")
        }

        if (this.on) {
            for (const arr of _arr) {
                for (let index = arr.length - 1; index >= 0; index--) {
                    const el = arr[index]
                    if (!el.startTime) {
                        el.startTime = t
                    }
                    const s = t - el.startTime
                    el.cb({ elapsed: s, delta: d })
                }
            }
        }

        this.raf()
    }

    raf() {
        if (isClient) requestAnimationFrame(this.update)
    }
}

let RafId = 0;

class RafR {
    cb: (arg: { elapsed: number; delta: number; }) => void;
    on: boolean;
    id: number;
    killed: boolean;
    priority: RafPriority;
    constructor(callback: (arg: { elapsed: number, delta: number }) => void, priority: RafPriority = RafPriority.NORMAL) {
        this.cb = callback

        this.on = false
        this.killed = false
        this.id = RafId
        this.priority = priority
    }

    run(options?: { elapsed?: number }) {
        if (this.on || this.killed) return
        RafId++
        this.id = RafId
        this.on = true
        const startTime = options?.elapsed ? Raf.now - options.elapsed : undefined
        Raf.add({ id: this.id, cb: this.cb, startTime }, this.priority)
    }
    stop() {
        if (!this.on) return
        this.on = false

        Raf.remove(this.id, this.priority)
    }
    kill() {
        this.stop()
        this.killed = true
    }
}

class debugClock {
    last: number;
    constructor() {
        this.last = performance.now()
    }
    tick() {
        const t = performance.now()
        console.log("delta : ", t - this.last)
        this.last = t
    }
}
const DEBUG = new debugClock()

class Delay {
    cb: (late?: number) => void;
    delay: number;
    raf: RafR;
    constructor(callback: () => void, delay: number) {
        this.cb = callback
        this.delay = delay
        BM(this, ["update"])

        // might want to have the delay callbacks be called after all the rafs callbacks
        this.raf = new RafR(this.update, RafPriority.MOTION)
    }

    run() {
        0 === this.delay ? this.cb() : this.raf.run()
    }

    stop() {
        this.raf.stop()
    }

    update(e: rafEvent) {
        let t = e.elapsed
        t = Clamp(t, 0, this.delay)

        if (t / this.delay >= 1) {
            this.stop()
            const late = e.elapsed - this.delay
            this.cb(late)
        }
        // 1 === Clamp(t / this.delay, 0, 1) && ()
    }
}

const delay = async (cb: () => void, delay: number) => {
    await new Promise<void>(resolve => {
        (new Delay(() => { cb(); resolve() }, delay)).run()
    })
}

class Timer {
    timer: Delay
    constructor(callback: () => void, delay: number = 200) {
        this.timer = new Delay(callback, delay)
    }

    // reset delay
    tick() {
        this.timer.stop()
        this.timer.run()
    }

    stop() {
        this.timer.stop()
    }
}

export { Raf, RafR, Delay, delay, Timer } 

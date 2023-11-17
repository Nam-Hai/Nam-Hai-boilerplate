import { BM, Is, Clamp } from "./utils";

function Now() {
    return (typeof performance === 'undefined' ? Date : performance).now();
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

        document.addEventListener("visibilitychange", this.v)
    }
    add(arg: { stop: () => void, start: (delta: number) => void }) {
        this.arr.push(arg)
    }

    // calcule le temps entre le moment ou pas visible a visible, puis accionne, tOff() ou tOn(r)
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


const Raf = new class {
    arr: Array<{
        id: number,
        cb: (arg: { elapsed: number, delta: number }) => void,
        startTime: number
    } | rafItem>;
    on: boolean;
    now: number = 0;
    constructor() {
        this.arr = []
        this.on = !0
        BM(this, ['update', 'stop', 'resume'])
        Tab.add({ stop: this.stop, start: this.resume })
        this.raf()
    }

    stop() {
        this.on = false
    }
    resume(delta: number) {
        for (const el of this.arr) {
            el.startTime! += delta
        }
        this.now += delta
        this.on = true
    }

    add(rafItem: rafItem) {
        this.arr.push(rafItem)
        this.arr.sort((a, b) => -a.id + b.id)
        if (this.arr.length > 10000) console.warn("Raf congested", this.arr.length)
    }

    remove(id: number): void {
        this.arr = this.arr.filter(el => {
            return el.id != id
        })
    }

    update(t: number) {
        const d = t - this.now
        this.now = t
        const arr = this.arr
        if (this.on) {
            for (const el of arr) {
                if (!el.startTime) {
                    el.startTime = t
                }
                const s = t - el.startTime
                el.cb({ elapsed: s, delta: d })
            }
        }
        this.raf()
    }

    raf() {
        requestAnimationFrame(this.update)
    }
}

let RafId = 0;

class RafR {
    cb: (arg: { elapsed: number; delta: number; }) => void;
    on: boolean;
    id: number;
    killed: boolean;
    constructor(callback: (arg: { elapsed: number, delta: number }) => void, lastStack = false, firstStack = false) {
        // this.cb = (arg: rafEvent) => {
        //     // if (!this.on) return
        //     callback(arg)
        // }
        this.cb = callback

        this.on = false
        this.killed = false
        this.id = RafId
        this.id += firstStack ? 2000000 : 0

        this.id += lastStack ? -2000000 : 0
        RafId++
    }

    run() {
        if (this.on || this.killed) return
        this.on = true
        Raf.add({ id: this.id, cb: this.cb })
    }
    stop() {
        if (!this.on) return
        this.on = false
        Raf.remove(this.id)
    }
    kill() {
        this.stop()
        this.killed = true
    }
}

class Delay {
    cb: () => void;
    delay: number;
    raf: RafR;
    constructor(callback: () => void, delay: number) {
        this.cb = callback
        this.delay = delay
        BM(this, ["update"])

        // might want to have the delay callbacks be called after all the rafs callbacks
        this.raf = new RafR(this.update, false, false)
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

        1 === Clamp(t / this.delay, 0, 1) && (this.stop(), this.cb())
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

export default class Callstack {
    stack: Array<() => void>;
    constructor(arg?: (() => void) | Array<() => void>) {
        if (arg == undefined) this.stack = []
        else if (Array.isArray(arg)) this.stack = arg
        else this.stack = [arg]
    }

    add(callback: () => void) {
        this.stack.push(callback)
    }

    call() {
        for (let index = 0; index < this.stack.length; index++) {
            const callback = this.stack[index];
            callback()
        }
    }
}
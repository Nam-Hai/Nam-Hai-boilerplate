export default class Callstack {
    stack: Array<()=> void>;
    constructor(arg: undefined | (() => void) | Array<() => void>) {
        if(arg == undefined) this.stack = []
        else if (Array.isArray(arg)) this.stack = arg
        else this.stack = [arg]
    }

    add(callback: ()=>void){
        this.stack.push(callback)
    }

    call(){
        this.stack.forEach(callback=>{
            callback()
        })
    }
}
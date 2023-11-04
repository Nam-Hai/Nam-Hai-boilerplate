//@ts-ignore
import { Vec2 } from 'ogl'

export class PointSim {
    position: Vec2
    velocity: Vec2
    acc: Vec2
    forces: Array<Force>

    constructor(x: number, y: number) {
        this.position = new Vec2(x, y)

        this.velocity = new Vec2(0, 0)
        this.acc = new Vec2(0, 0)

        this.forces = []
    }

    addForce(force: Force) {
        this.forces.push(force)
    }

    update() {
        this.applyForce()
        this.velocity.add(this.acc)
        this.position.add(this.velocity)
    }

    applyForce() {
        this.acc.set(0, 0)

        for (const force of this.forces) {
            this.acc.add(force.force())
        }
    }
}

interface Force {
    force: () => Vec2
}

export class SpringForce implements Force {
    point: Vec2
    l0: Vec2
    k: number
    on: boolean
    constructor(point: Vec2, l0: Vec2, k: number = 0.05) {
        this.point = point
        this.l0 = l0

        this.on = true
        this.k = k
    }

    force() {
        if (!this.on) return new Vec2(0, 0)
        const f = this.l0.clone()
        const a = f.sub(this.point).multiply(this.k)
        return a
    }
}

export class DragForce implements Force {
    velocity: Vec2
    on: boolean
    constructor(velocity: Vec2) {
        this.velocity = velocity
        this.on = true
    }

    force() {
        if (!this.on) return new Vec2(0, 0)
        return this.velocity.clone().multiply(-0.2)
    };
}
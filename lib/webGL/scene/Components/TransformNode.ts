
import { Transform } from 'ogl'

import { CanvasNode } from '../utils/types';

export class TransformNode extends CanvasNode {

    constructor(gl: any) {
        super(gl)

        this.mount()
    }

    mount() {
        this.node = new Transform()
    }
}
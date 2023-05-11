import { useFlowProvider } from '@nam-hai/water-flow';
import { N } from '~/plugins/namhai.client';
import { RouteLocationNormalized } from 'vue-router';
// @ts-ignore
import { Renderer, Camera, Transform } from 'ogl'
import IndexCanvas, { CanvasPage } from './Pages/indexCanvas';

export default class Canvas {
    renderer: any;
    gl: any;
    camera: any;
    scene: any;

    size: globalThis.Ref<{ width: number; height: number; }>;
    ro: any;

    index?: IndexCanvas;
    mapRouteObject: { [key: string]: () => CanvasPage; };
    nextPage: CanvasPage | undefined;
    currentPage!: CanvasPage;

    constructor() {
        this.mapRouteObject = {
            'index': this.createIndexCanvas
        };
        this.renderer = new Renderer({
            alpha: true,
            antialias: true,
            dpr: devicePixelRatio,
        });

        this.gl = this.renderer.gl


        this.camera = new Camera(this.gl);
        this.camera.position.z = 5;

        this.scene = new Transform();
        N.BM(this, ["resize"]);


        this.size = ref({ width: 0, height: 0 })

        this.ro = new N.ROR(this.resize)
    }

    async init() {
        this.ro.on();

        const flowProvider = useFlowProvider()
        this.onChange(flowProvider.getRouteFrom())
        this.currentPage = this.nextPage!
    }

    resize({ vh, vw, scale }: { vh: number, vw: number, scale: number }) {
        this.renderer.setSize(vw, vh);

        this.camera.perspective({
            // aspect: this.sizePixel.width / this.sizePixel.height,
            aspect: vw / vh
        });
        const fov = (this.camera.fov * Math.PI) / 180;

        const height = 2 * Math.tan(fov / 2) * this.camera.position.z;

        this.size.value = {
            height: height,
            width: height * this.camera.aspect,
        }
    }

    onChange(route: RouteLocationNormalized) {
        const createPage = this.mapRouteObject[route.name?.toString() || ''] || null
        this.nextPage = createPage()
    }

    createIndexCanvas() {
        this.index = new IndexCanvas({ gl: this.gl, scene: this.scene, camera: this.camera })
        return this.index
    }

    destroy() {
        this.ro.off()
    }
}
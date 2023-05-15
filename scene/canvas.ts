import { useFlowProvider } from '@nam-hai/water-flow';
import { RouteLocationNormalized } from 'vue-router';
// @ts-ignore
import { Renderer, Camera, Transform } from 'ogl'
import IndexCanvas, { CanvasPage } from './Pages/indexCanvas';
import FallbackCanvas from './Pages/fallbackCanvas';
import { ROR } from '~/plugins/core/resize';

type routeMapType = 'index'

export default class Canvas {
    renderer: any;
    gl: any;
    camera: any;
    scene: any;

    ro: any;

    mapRouteObject: { [K in routeMapType | 'fallback']: () => CanvasPage; };
    nextPage: CanvasPage | undefined;
    currentPage!: CanvasPage;

    index?: IndexCanvas;
    fallback?: FallbackCanvas;
    map: Map<string, () => CanvasPage>;
    size: { width: number; height: number; };

    constructor() {
        this.renderer = new Renderer({
            alpha: true,
            // antialias: true,
            dpr: devicePixelRatio,
        });
        this.gl = this.renderer.gl

        this.mapRouteObject = {
            index: this.createIndexCanvas,
            fallback: this.createFallbackCanvas
        };
        this.map = new Map([
            ['index', this.createIndexCanvas],
            ['fallback', this.createFallbackCanvas]
        ])



        this.camera = new Camera(this.gl);
        this.camera.position.z = 5;

        this.scene = new Transform();
        N.BM(this, ["resize"]);


        this.size = reactive({
            width: 0,
            height: 0
        })

        this.ro = new ROR(this.resize)
    }

    async init() {
        this.ro.on();
        const flowProvider = useFlowProvider()
        this.onChange(flowProvider.getRouteFrom())
        this.currentPage = this.nextPage!

        this.currentPage.init()
    }

    resize({ vh, vw, scale }: { vh: number, vw: number, scale: number }) {

        this.renderer.setSize(vw, vh);

        this.camera.perspective({
            // aspect: this.sizePixel.width / this.sizePixel.height,
            aspect: vw / vh
        });
        const fov = (this.camera.fov * Math.PI) / 180;

        const height = 2 * Math.tan(fov / 2) * this.camera.position.z;

        this.size.height = height
        this.size.width = height * this.camera.aspect
    }

    onChange(route: RouteLocationNormalized) {
        const routeName = route.name?.toString() || ''

        const createPage = this.map.get(routeName) || this.createFallbackCanvas
        this.nextPage = createPage.bind(this)()
    }

    createIndexCanvas() {
        this.index = new IndexCanvas({ gl: this.gl, scene: this.scene, camera: this.camera })
        return this.index
    }
    createFallbackCanvas() {
        this.fallback = new FallbackCanvas({ gl: this.gl, scene: this.scene, camera: this.camera })
        return this.fallback
    }

    destroy() {
        this.ro.off()
    }
}
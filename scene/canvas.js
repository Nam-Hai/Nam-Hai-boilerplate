import {
  Renderer,
  Camera,
  Transform,
} from "ogl";
import { useFlowProvider } from "@nam-hai/water-flow";
import { N } from "~/helpers/namhai-utils";
import { ROR } from "~/plugins/core/resize";

export default class Canvas {
  constructor() {
    this.pages = {
      index: null,
      example2: null
    }
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

    this.ro = new ROR(this.resize)
  }

  async init() {
    this.ro.on();

    const flowProvider = useFlowProvider()
    this.onChange(flowProvider.getRouteFrom())
    this.currentCanvasPage = this.nextCanvasPage
  }

  resize({ vh, vw, scale }) {
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

  onChange(route) {
    const page = null
    if (!page) return
    this.nextCanvasPage = new page({ gl: this.gl, scene: this.scene, camera: this.camera, titleMSDF: this.titleMSDF })
    this.pages[route.name] = this.nextCanvasPage
  }

  destroy() {
    this.ro.off()
  }
};

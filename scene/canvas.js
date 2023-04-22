import {
  Renderer,
  Box,
  Camera,
  Program,
  Plane,
  Transform,
  Texture,
  Mesh,
} from "ogl";
import { basicFrag } from "./shaders/BasicFrag";
import { basicVer } from "./shaders/BasicVer";
import { N } from "~/helpers/namhai-utils";

export default class Canvas {
  constructor({ canvas }) {
    this.renderer = new Renderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      dpr: devicePixelRatio,
    });
    this.gl = this.renderer.gl;

    this.camera = new Camera(this.gl);
    this.camera.position.z = 5;

    this.scene = new Transform();

    this.onResize();

    N.BM(this, ["update", "onResize", "onScroll"]);

    // this.raf = new N.RafR(this.update);
    const { $RafR, $ROR} = useNuxtApp()
    this.raf = new $RafR(this.update);
    this.ro = new $ROR(this.onResize)

    this.mesh = this.createMedia("2.jpg", 300);
    this.mesh.setParent(this.scene);

    this.init();
    this.addEventListener();
  }
  async init() {
    this.raf.run();
    this.ro.on();
  }
  addEventListener() {
    // document.addEventListener('wheel', this.onScroll)
  }

  onScroll(e) {
    this.scroll.target += e.deltaY / 100;
  }

  onResize(e) {
    console.log(e);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.sizePixel = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.camera.perspective({
      aspect: this.sizePixel.width / this.sizePixel.height,
    });
    const fov = (this.camera.fov * Math.PI) / 180;

    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    this.size = {
      height: height,
      width: height * this.camera.aspect,
    };

    if(!this.mesh) return
    const w = 300;
    let meshScale = (this.size.width * w * e.scale) / this.sizePixel.width;
    this.mesh.scale.set(meshScale, meshScale, meshScale);
  }

  update(e) {
    this.renderer.render({
      scene: this.scene,
      camera: this.camera
    });
  }

  createMedia(src, w, h = w) {
    let image = new Image();
    let texture = new Texture(this.gl);
    image.crossOrigin = "anonymous";
    image.onload = () => {
      texture.image = image;
    };
    image.src = src;

    // let geometry = new Plane(this.gl);
    let geometry = new Box(this.gl)
    let program = new Program(this.gl, {
      fragment: basicFrag,

      vertex: basicVer,
      uniforms: {
        tMap: { value: texture },
      },
      cullFace: null,
    });

    this.texture = texture

    let mesh = new Mesh(this.gl, { geometry, program });
    let width = (this.size.width * w) / this.sizePixel.width;
    let height = (this.size.width * h) / this.sizePixel.width;
    mesh.scale.set(width, height, width);
    return mesh;
  }

  destroy() {
    this.raf.stop()
  }
}



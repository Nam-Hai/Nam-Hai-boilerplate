// @ts-ignore
import { Vec2, Program, Mesh, Color, Plane } from "ogl";
import { ResizeEvent } from "~/plugins/core/resize";
import { RafR, rafEvent } from "~/plugins/core/raf";
import Callstack from "../utils/Callstack";

const { vh, vw, showCanvas, preloaderComplete, canvasTopMaskBefore } =
  useStore();
export class MediaLanding {
  gl: any;
  position: any;
  scale: any;
  uResolution: { value: [number, number] };
  mesh: any;
  canvasSize: { width: number; height: number };
  ro: any;
  uSizePixel: { value: number[] };
  size: any;
  coord: { x: number; y: number };
  grid: { width: number; height: number };
  raf: RafR;
  offset: any;
  direction: string | undefined;
  tMap: { value: any };
  uScaleOffset: { value: number[] };
  uIntrinsecRatio: number;
  uTranslateOffset: { value: number[] };
  uAlpha: { value: number };
  velo: number;
  callStack: Callstack;

  constructor(
    gl: any,
    options: {
      id: number;
      texture: any;
      grid: { width: number; height: number };
      direction?: "vertical";
    }
  ) {
    N.BM(this, ["onResize", "update"]);
    this.gl = gl;

    this.tMap = { value: options.texture };
    this.direction = options.direction;
    this.uResolution = {
      value: [vw.value * devicePixelRatio, vh.value * devicePixelRatio],
    };
    this.canvasSize = { width: 1, height: 1 };
    this.uSizePixel = { value: [1, 1] };
    this.uIntrinsecRatio = options.texture.image
      ? options.texture.image.width / options.texture.image.height
      : 1;
    this.uScaleOffset = {
      value: [
        this.uSizePixel.value[0] / this.uSizePixel.value[1] <
        this.uIntrinsecRatio
          ? this.uSizePixel.value[0] /
            (this.uSizePixel.value[1] * this.uIntrinsecRatio)
          : 1,
        this.uSizePixel.value[0] / this.uSizePixel.value[1] <
        this.uIntrinsecRatio
          ? 1
          : (this.uSizePixel.value[1] * this.uIntrinsecRatio) /
            this.uSizePixel.value[0],
      ],
    };
    this.uTranslateOffset = {
      value: [
        this.uSizePixel.value[0] / this.uSizePixel.value[1] <
        this.uIntrinsecRatio
          ? 0.5 *
            (1 -
              (this.uSizePixel.value[0] / this.uSizePixel.value[1]) *
                this.uIntrinsecRatio)
          : 0,
        this.uSizePixel.value[0] / this.uSizePixel.value[1] <=
        this.uIntrinsecRatio
          ? 0
          : (1 -
              (this.uSizePixel.value[1] * this.uIntrinsecRatio) /
                this.uSizePixel.value[0]) *
            0.5,
      ],
    };
    this.grid = options.grid;

    this.coord = {
      x: options.id % this.grid.width,
      y: Math.floor(options.id / this.grid.width),
    };

    const geometry = new Plane(this.gl);

    const tl = useTL();
    this.uAlpha = { value: 1 };
    this.velo = 1;
    const unSubShow = watch(showCanvas, (b) => {
      tl.pause();
      tl.arr = [];
      const fromVelo = this.velo;

      const ease = b ? "io2" : "io2";
      const from = this.uAlpha.value;
      const to = +b;
      tl.from({
        d: 1000,
        delay: b ? 0 : 700,
        e: ease,
        update: ({ progE, prog }) => {
          this.uAlpha.value = N.Lerp(from, to, prog);
        },
      })
        .from({
          d: 1000,
          e: ease,
          delay: b ? 700 : 0,
          update: ({ progE, prog }) => {
            this.velo = N.Lerp(fromVelo, to, progE);
          },
        })
        .play();
    });

    const program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        tMap: this.tMap,
        uResolution: this.uResolution,
        uSizePixel: this.uSizePixel,
        uScaleOffset: this.uScaleOffset,
        uTranslateOffset: this.uTranslateOffset,
        uAlpha: this.uAlpha,
        uTopMaskBefore: canvasTopMaskBefore,
      },
    });

    this.mesh = new Mesh(this.gl, {
      geometry,
      program,
    });

    this.size = new Vec2(
      this.canvasSize[this.getSide("width")] / this.grid.width,
      this.canvasSize[this.getSide("height")] / this.grid.height
    );

    this.ro = useROR(this.onResize);
    this.raf = useRafR(this.update);
    const { canvasSize, unWatch } = useCanvasSize((cSize) => {
      this.canvasSize = cSize;
      this.ro.trigger();
    });

    this.mesh.scale.set(this.size.x, this.size.y, 1);
    this.mesh.position.set(
      this.coord.x * this.size.x - this.size.x * (this.grid.width / 2 - 0.5),
      this.coord.y * this.size.y - this.size.y * (this.grid.height / 2 - 0.5),
      0
    );

    this.callStack = new Callstack([
      () => unWatch(),
      () => this.raf.stop(),
      () => this.ro.off(),
      () => unSubShow(),
    ]);
  }

  getSide(side: "height" | "width") {
    if (this.direction != "vertical") return side;
    return "height";
  }

  init() {
    this.raf.run();

    useTL()
      .from({
        d: 4000,
        e: "o1",
        update: ({ progE }) => {
          this.velo = N.Lerp(-1, 1, progE);

          this.uAlpha.value = progE;
        },
      })
      .from({
        d: 2000,
        update: () => {},
        cb: () => {
          preloaderComplete.value = true;
        },
      })
      .play();
  }
  update(e: rafEvent) {
    this.coord.y += e.delta / 1000 + ((1 - this.velo) * 200) / 1000;

    if (this.coord.y > 11) this.coord.y -= 12;
    this.mesh.position.set(
      this.coord.x * this.size.x - this.size.x * (this.grid.width / 2 - 0.5),
      this.coord.y * this.size.y - this.size.y * -0.5,
      0
    );
  }

  onResize(e: ResizeEvent) {
    this.size = new Vec2(
      this.canvasSize[this.getSide("width")] / this.grid.width,
      this.canvasSize[this.getSide("height")] / this.grid.height
    );

    this.uSizePixel.value = [
      (this.size.x / this.canvasSize.width) * e.vw,
      (this.size.y / this.canvasSize.height) * e.vh,
    ];
    this.mesh.scale.set(this.size.x, this.size.y, 1);
    this.mesh.position.set(
      this.coord.x * this.size.x - this.size.x * (this.grid.width / 2 - 0.5),
      this.coord.y * this.size.y - this.size.y * (this.grid.height / 2 - 0.5),
      0
    );

    this.uScaleOffset.value = [
      this.uSizePixel.value[0] / this.uSizePixel.value[1] < this.uIntrinsecRatio
        ? this.uSizePixel.value[0] /
          (this.uSizePixel.value[1] * this.uIntrinsecRatio)
        : 1,
      this.uSizePixel.value[0] / this.uSizePixel.value[1] < this.uIntrinsecRatio
        ? 1
        : (this.uSizePixel.value[1] * this.uIntrinsecRatio) /
          this.uSizePixel.value[0],
    ];
    this.uTranslateOffset.value = [
      this.uSizePixel.value[0] / this.uSizePixel.value[1] < this.uIntrinsecRatio
        ? 0.5 *
          (1 -
            this.uSizePixel.value[0] /
              (this.uSizePixel.value[1] * this.uIntrinsecRatio))
        : 0,
      this.uSizePixel.value[0] / this.uSizePixel.value[1] <=
      this.uIntrinsecRatio
        ? 0
        : (1 -
            (this.uSizePixel.value[1] * this.uIntrinsecRatio) /
              this.uSizePixel.value[0]) *
          0.5,
    ];
  }
}

const vertex = /* glsl */ `#version 300 es
precision highp float;

in vec3 position;
in vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec2 vUv;
out vec4 mP;
out vec4 P;

void main() {
    vUv = uv;

    P = vec4(position, 1.);
    mP = modelViewMatrix * vec4(position, 1.);


    gl_Position = projectionMatrix * mP;
}`;

const fragment = /* glsl */ `#version 300 es
precision highp float;

uniform sampler2D tMap;
uniform float uId;

uniform vec2 uSizePixel;
uniform vec2 uResolution;
uniform float uIntrinsecRatio;
uniform vec2 uScaleOffset;
uniform vec2 uTranslateOffset;
uniform float uTopMaskBefore;

uniform float uAlpha;

in vec2 vUv;
in vec4 mP;
in vec4 P;
out vec4 FragColor;


void main() {


    vec4 color = texture(tMap, vUv * uScaleOffset + uTranslateOffset);
    color.rgb = mix(color.rgb, vec3(1., 1., 1.), 1. - uTopMaskBefore);
    if(color.a == 0.){
        color = vec4(1.);
    }
    float fog = mP.z / (8. - (1. - uAlpha) * 6.) + 1.6 - 0.5 * (1. - uAlpha);
    fog = clamp(fog, 0., 1.);
    // float fog = mP.z / (7. + uAlpha * 5.) + 1.8 - 1.19 * (1. - uAlpha);
    // color = vec4(fog);

    // color

    // border
    if(vUv.x < 1. / uSizePixel.x || vUv.y < 4. / uSizePixel.y) {
        color = vec4(0.8);
        // color.r = 1.;
        color.a = 1.;
    }
    
    color.a = 1.;
    color.rgb = mix(color.rgb, vec3(1.), 1.- fog);
    FragColor = color;
}
`;

import { ROR, ResizeEvent } from "~/plugins/core/resize";
import { MediaLanding } from "./MediaLanding";

// @ts-ignore
import { Transform, Texture } from "ogl";

const POISSON = 11;
function poissonRandom(mean: number) {
  const L = Math.exp(-mean);
  let p = 1.0;
  let k = 0;

  do {
    k++;
    p *= Math.random();
  } while (p > L);

  return k - 1;
}

export class GridMedia {
  gl: any;
  group: any;
  mediasLeft: MediaLanding[];
  groupBottom: any;
  groupLeft: any;
  mediasBottom: MediaLanding[];
  groupRight: any;
  groupTop: any;
  mediasRight: MediaLanding[];
  mediasTop: MediaLanding[];
  ro: ROR;
  canvasSize: { width: number; height: number };

  constructor(gl: any, options: {}) {
    N.BM(this, ["onResize"]);
    this.gl = gl;
    this.group = new Transform();
    this.groupBottom = new Transform();
    this.groupLeft = new Transform();
    this.groupRight = new Transform();
    this.groupTop = new Transform();

    this.groupBottom.setParent(this.group);
    this.groupLeft.setParent(this.group);
    this.groupRight.setParent(this.group);
    this.groupTop.setParent(this.group);

    const manifest = useManifest();
    let mediaIndex = 0;
    let distance = poissonRandom(POISSON);
    this.mediasBottom = N.Arr.create(60).map((el, index) => {
      mediaIndex++;
      let texture = new Texture(this.gl);
      if (mediaIndex >= distance) {
        mediaIndex = 0;
        distance = poissonRandom(POISSON);
        texture = manifest.getBackground();
      }

      const media = new MediaLanding(this.gl, {
        id: index,
        texture,
        grid: { width: 5, height: 3 },
      });
      media.mesh.setParent(this.groupBottom);
      return media;
    });

    this.mediasTop = N.Arr.create(60).map((el, index) => {
      mediaIndex++;
      let texture = new Texture(this.gl);

      if (mediaIndex >= distance) {
        mediaIndex = 0;
        distance = poissonRandom(POISSON);
        texture = manifest.getBackground();
      }
      const media = new MediaLanding(this.gl, {
        id: index,
        texture,
        grid: { width: 5, height: 3 },
      });
      media.mesh.setParent(this.groupTop);
      return media;
    });
    this.mediasLeft = N.Arr.create(48).map((el, index) => {
      mediaIndex++;
      let texture = new Texture(this.gl);
      if (mediaIndex >= distance) {
        mediaIndex = 0;
        texture = manifest.getBackground();
        distance = poissonRandom(POISSON);
      }
      const media = new MediaLanding(this.gl, {
        id: index,
        texture,
        grid: { width: 4, height: 3 },
        direction: "vertical",
      });
      media.mesh.setParent(this.groupLeft);
      return media;
    });
    this.mediasRight = N.Arr.create(48).map((el, index) => {
      mediaIndex++;
      let texture = new Texture(this.gl);
      if (mediaIndex >= distance) {
        mediaIndex = 0;
        texture = manifest.getBackground();
        distance = poissonRandom(POISSON);
      }
      const media = new MediaLanding(this.gl, {
        id: index,
        texture,
        grid: { width: 4, height: 3 },
        direction: "vertical",
      });
      media.mesh.setParent(this.groupRight);
      return media;
    });

    this.ro = useROR(this.onResize);
    const { canvasSize, unWatch } = useCanvasSize((canvasSize) => {
      this.canvasSize = canvasSize;
      this.ro.trigger();
    });
    this.canvasSize = canvasSize;
  }

  init() {
    for (const media of this.mediasBottom) {
      media.init();
    }

    for (const media of this.mediasLeft) {
      media.init();
    }
    for (const media of this.mediasRight) {
      media.init();
    }
    for (const media of this.mediasTop) {
      media.init();
    }
  }

  onResize(e: ResizeEvent) {
    this.groupBottom.rotation.x = -Math.PI / 2;
    this.groupBottom.position.set(0, -this.canvasSize.height / 2, 0);
    this.groupTop.rotation.x = Math.PI / 2;
    this.groupTop.rotation.z = Math.PI;
    this.groupTop.position.set(0, this.canvasSize.height / 2, 0);

    this.groupLeft.rotation.set(0, Math.PI / 2, -Math.PI / 2);
    this.groupLeft.position.x = -this.canvasSize.width / 2;

    this.groupRight.rotation.set(
      0,
      -Math.PI / 2,
      Math.PI / 2
      // 0
    );
    this.groupRight.position.x = this.canvasSize.width / 2;
  }
}

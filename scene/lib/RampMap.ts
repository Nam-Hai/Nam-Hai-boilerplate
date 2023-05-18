// @ts-ignore
import { Color } from "ogl";
import palettes from "../utils/palettes";

type RampMapOptions = {
  hex: string,
  x: number
}

export default class RampMap {
  resolution: number;
  data: RampMapOptions[];
  private points: { x: number; hex: string; color: any; }[];
  gradientData!: Uint8Array;
  constructor(data: RampMapOptions[], resolution: number = 1000) {
    this.resolution = resolution;
    this.data = data;
    this.points = this._updatePoints();
    this.sortPoints();
    this.computeDataImage()
  }

  _updatePoints() {
    return this.data.map((d) => {
      return {
        x: d.x,
        hex: d.hex,
        color: new Color(d.hex),
      };
    });
  }

  update() {
    this.points = this._updatePoints();
    this.sortPoints();
    this.computeDataImage()
  }

  private sortPoints() {
    return this.points.sort((a, b) => a.x - b.x);
  }

  private computeDataImage() {
    let colors = [];
    for (let i = 0; i < this.resolution; i++) {
      const c = this.getAt(i / this.resolution);
      colors.push(c);
    }

    const gradientData = new Uint8Array(colors.length * 4);
    for (let i = 0; i < colors.length; i++) {
      const c = colors[i];
      gradientData[i * 4] = c.r * 255;
      gradientData[i * 4 + 1] = c.g * 255;
      gradientData[i * 4 + 2] = c.b * 255;
      gradientData[i * 4 + 3] = 255;
    }

    this.gradientData = gradientData
  }

  getAt(t: number) {
    t = N.Clamp(t, 0, 1);

    let color;
    color = this.points[0].color;
    for (const point of this.points) {
      if (t < point.x) break;
      color = point.color;
    }
    return color;
  }

  add(options: RampMapOptions) {
    const randomColor = palettes[Math.floor(Math.random() * palettes.length)];
    console.log(randomColor);

    this.points.push({
      hex: randomColor,
      x: options.x,
      color: new Color(randomColor),
    });

    this.data = this.pointToData();
    this.update()
  }
  pointToData() {
    return this.points.map((p) => {
      return { hex: p.hex, x: p.x };
    });
  }

  remove() {
    this.points.pop();

    this.data = this.pointToData();
  }
}

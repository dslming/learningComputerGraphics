
export default class Line {
  constructor() {
    this.falg = true
  }

  static getPixelColor(x, y, imgWidth, imgData) {
    const w = imgWidth
    const d = imgData

    var color = []
    color[0] = d[(y * w + x) * 4]
    color[1] = d[(y * w + x) * 4 + 1]
    color[2] = d[(y * w + x) * 4 + 2]
    color[3] = d[(y * w + x) * 4 + 3]
    let ret = Line.rgbToHex(color)
    return ret
  }

  static setPixel(x, y, color, imgWidth, imgData) {
    const w = imgWidth
    const d = imgData
    const hexColor = Line.hexToRgba(color)
    d[(y * w + x) * 4 + 0] = hexColor[0]
    d[(y * w + x) * 4 + 1] = hexColor[1]
    d[(y * w + x) * 4 + 2] = hexColor[2]
    d[(y * w + x) * 4 + 3] = 255
  }

  static rgbToHex(c) {
    const [r, g, b, a] = c
    return ((r << 16) | (g << 8) | b).toString(16);
  }

  static hexToRgba(hex) {
    let ret = []
    ret[0] = parseInt("0x" + hex.slice(0, 2))
    ret[1] = parseInt("0x" + hex.slice(2, 4))
    ret[2] = parseInt("0x" + hex.slice(4, 6))
    return ret
  }

  drawLine({ start, end, color, lineWidth, imgData, imgWidth }) {
    let point = 2
    for (let x = start.x; x < end.x; x += 1) {
      if (x % point == 0 && this.falg == true) {
        Line.setPixel(x, start.y, color, imgWidth, imgData)
        continue
      }

      if (x % point == 1 && this.falg == false) {
        Line.setPixel(x, start.y, color, imgWidth, imgData)
        continue
      }
    }

    for (let y = start.y; y < end.y; y += 1) {
      if (y % point == 0 && this.falg == true) {
        Line.setPixel(start.x, y, color, imgWidth, imgData)
        continue
      }
      if (y % point == 1 && this.falg == false) {
        Line.setPixel(start.x, y, color, imgWidth, imgData)
        continue
      }
    }

    this.falg = !this.falg


  }
}

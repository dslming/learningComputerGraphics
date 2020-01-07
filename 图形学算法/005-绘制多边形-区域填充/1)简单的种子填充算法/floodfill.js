
class FloodFill {
  constructor({ bitmap, width, height }) {
    this.bitmap = bitmap
    this.width = width
    this.height = height
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

  static colorEquals(color1, color2, tolerance) {
    let diff = 0;
    diff = Math.abs(parseInt('0x' + color1) - parseInt('0x' + color2))
    return diff > tolerance
  }

  getPixelColor(x, y) {
    const w = this.width
    const d = this.bitmap.data

    var color = []
    color[0] = d[(y * w + x) * 4]
    color[1] = d[(y * w + x) * 4 + 1]
    color[2] = d[(y * w + x) * 4 + 2]
    color[3] = d[(y * w + x) * 4 + 3]
    let ret = FloodFill.rgbToHex(color)
    return ret
  }

  setPixel(x, y, color) {
    const w = this.width
    const d = this.bitmap.data
    const hexColor = FloodFill.hexToRgba(color)
    d[(y * w + x) * 4 + 0] = hexColor[0]
    d[(y * w + x) * 4 + 1] = hexColor[1]
    d[(y * w + x) * 4 + 2] = hexColor[2]
    d[(y * w + x) * 4 + 3] = 255
  }

  /**
   * 边界表示的4连通区域的递归填充算法(简单的种子填充算法)
   *
   * @param {*} (x,y) 多边形内任意一点
   * @param {*} boundaryColor 16进制颜色，边框颜色
   * @param {*} newColor 16进制颜色，需要填充的颜色
   */
  boundaryFill4(x, y, boundaryColor, newColor) {
    const color = this.getPixelColor(x, y)
    let ret1 = FloodFill.colorEquals(color, boundaryColor, 20)
    let ret2 = FloodFill.colorEquals(color, newColor, 20)

    if (ret1 && ret2) {
      this.setPixel(x, y, newColor);
      this.floodFill4(x + 1, y, boundaryColor, newColor);
      this.floodFill4(x - 1, y, boundaryColor, newColor);
      this.floodFill4(x, y + 1, boundaryColor, newColor);
      this.floodFill4(x, y - 1, boundaryColor, newColor);
    }
  }
}

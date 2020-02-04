class App {
  constructor() {
    this.data = []
    this.overCb = null
    this.position = {
      x: 0, y: 0, w: 100, h: 100
    }
  }

  setPosition({ x, y, w, h }) {
    this.position = {
      x, y, w, h
    }
  }

  setOverCb(cb) {
    this.overCb = cb
  }

  setData({ name, data }) {
    this.data.push({ name, data })
    if (this.data.length == 2) {
      console.error("start merges...");
      this.startMerge()
    }
  }

  /**
   *
   * @param {*} (x,y) img2 插入 img1的位置
   */
  startMerge() {
    // let { x, y } = this.position
    let { data: img1Data } = this.data.find((img) => { return img.name == "img1" })
    let { data: img2Data } = this.data.find((img) => { return img.name == "img2" })
    let imgData = img1Data

    let tempI = 0
    let x = 0
    let y = 0
    for (let i = 0, j = 0; i < imgData.data.length; i += 4, j++) {
      // 获取坐标
      x = j % imgData.width
      y = Number.parseInt(j / imgData.width)

      // 设置颜色
      if (x >= this.position.x &&
        y >= this.position.y &&
        y < this.position.y + this.position.h &&
        x < this.position.x + this.position.w
      ) {
        imgData.data[j * 4 + 0] = img2Data.data[tempI * 4 + 0]
        imgData.data[j * 4 + 1] = img2Data.data[tempI * 4 + 1]
        imgData.data[j * 4 + 2] = img2Data.data[tempI * 4 + 2]
        imgData.data[j * 4 + 3] = img2Data.data[tempI * 4 + 3]
        tempI++
      }
    }

    this.overCb(imgData)
  }

  getPixelColor(x, y) {
    const w = this.width
    const d = this.bitmap.data

    var color = []
    color[0] = d[(y * w + x) * 4]
    color[1] = d[(y * w + x) * 4 + 1]
    color[2] = d[(y * w + x) * 4 + 2]
    color[3] = d[(y * w + x) * 4 + 3]
    let ret = this.rgbToHex(color)
    return ret
  }

  setPixel(x, y, color) {
    const w = this.width
    // const d = this.bitmap.data
    const hexColor = this.hexToRgba(color)
    d[(y * w + x) * 4 + 0] = hexColor[0]
    d[(y * w + x) * 4 + 1] = hexColor[1]
    d[(y * w + x) * 4 + 2] = hexColor[2]
    d[(y * w + x) * 4 + 3] = 255
  }

  rgbToHex(c) {
    const [r, g, b, a] = c
    return ((r << 16) | (g << 8) | b).toString(16);
  }

  hexToRgba(hex) {
    let ret = []
    ret[0] = parseInt("0x" + hex.slice(0, 2))
    ret[1] = parseInt("0x" + hex.slice(2, 4))
    ret[2] = parseInt("0x" + hex.slice(4, 6))
    return ret
  }
}

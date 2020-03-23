export default class HotPoint {
  constructor(stage, index, position) {
    const mesh = this._getMeshSprite(index, position)
    mesh.name = `${index}`
    stage.scene.add(mesh);

    this.sprite = mesh
    this.click = false
    this.name = index
  }

  /**
   * 使用canvas绘制序号的纹理
   * @param {*} index 显示的序号
   */
  _getTextureByNumber(index) {
    const width = 64
    const height = 64

    // Number
    const canvas = document.createElement("canvas");
    const scale = 2
    canvas.width = width * scale
    canvas.height = width * scale
    const ctx = canvas.getContext("2d");
    const x = canvas.width / 2;
    const y = canvas.width / 2;
    const radius = canvas.width / 2 - 10;
    const startAngle = 0;
    const endAngle = Math.PI * 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.fill();

    var grd = ctx.createRadialGradient(x, y, radius - 10, x, y, radius);
    grd.addColorStop(0, "rgb(250,250,250)");
    grd.addColorStop(1, "rgb(230,230,230)");
    // ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.strokeStyle = grd
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.stroke();

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.font = "56px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${index}`, x, y);

    ctx.scale(scale, scale)
    const numberTexture = new THREE.CanvasTexture(
      canvas
    );
    return numberTexture
  }

  /**
   * 制作一个精灵
   * @param {*} index 显示的序号
   * @param {*} position
   */
  _getMeshSprite(index, position) {
    const spriteMaterial = new THREE.SpriteMaterial({
      map: this._getTextureByNumber(index),
      alphaTest: 0.5,
      transparent: true,
      depthTest: true,
      depthWrite: true
    });
    spriteMaterial.needsUpdate = false
    let sprite = new THREE.Sprite(spriteMaterial);
    sprite.name = "showInfo"
    sprite.position.set(position.x, position.y, position.z);
    sprite.scale.set(2, 2, 1);
    return sprite
  }

  changeColor(isActive) {
    const color = isActive ? 0x00d4fb : 0xffffff
    this.sprite.material.color.setHex(color)
  }
}

const THREE = (window as any).THREE
class Cargo{
    private mesh: { [key: string]: any[] } = {};
    constructor() {
    }

    public addAsset(name:any, asset:any) {
      if (this.mesh[name] === undefined) {
        this.mesh[name] = asset
        return true
      }
      return false
    }

    public getMesh(name:any) {
      return this.mesh[name] !== undefined ? this.mesh[name] : null
    }

    public getTexture(name:any) {
      return this.mesh[name] !== undefined ? this.mesh[name] : null
    }

    public getCubeTexture(name:any) {
      return this.mesh[name] !== undefined ? this.mesh[name] : null
    }
}

export default class AssetLoader {
  private path: any
  private manifesto: any;
  private callback: any;
  public cargo: Cargo;
  private assetCount: number;
  private assetTotal: any;
  private loaderText: any;
  private loaderMesh: any;
  private loaderCube: any;
  private language: any;
  private container: any;
  private progBar: any;
  private detailBox: any;
  private pct: any;

  /**
   * 
   * @param _path 资源的根路径
   * @param _manifesto 资源的名称和路径
   * @param _callback 加载完成的回掉
   */
  constructor(_path:any, _manifesto:any, _callback:any) {
    this.path = _path;
    this.manifesto = _manifesto;
    this.callback = _callback;
    this.language = document.location.href.indexOf('/us') > -1 ? 'us' : 'cn';
    this.cargo = new Cargo();
    /** 已经加载数量 */
    this.assetCount = 0;
    /** 总数量 */
    this.assetTotal = _manifesto.length;
    /** 加载文本 */
    this.loaderText = new THREE.TextureLoader();
    /**  */
    this.loaderMesh = new THREE.ObjectLoader();
    this.loaderCube = new THREE.CubeTextureLoader();
    this.container = document.getElementById('preloader');
    this.progBar = document.getElementById('preProg');
    this.detailBox = document.getElementById('preDetail');
  }
  
  start() {
    this.container && (this.container.className = 'visible')
    if (this.language === 'us') {
      this.detailBox && (this.detailBox.innerHTML = 'Loading assets')
    } else {
      this.detailBox && (this.detailBox.innerHTML = '加载中')
    }

    var ext;
    var loop = (i:any) => {
      ext = '.' + this.manifesto[i].ext;
      switch (this.manifesto[i].type) {
      case 'texture':
        this.loaderText.load(this.path + 'textures/' + this.manifesto[i].name + ext, (_obj:any) => {
          this.assetAquired(_obj, this.manifesto[i].name);
        }, undefined, (_err:any) => {
          this.assetFailed(_err, this.manifesto[i].name);
        })
        break;

      case 'mesh':
        this.loaderMesh.load(this.path + 'meshes/' + this.manifesto[i].name + '.json', (_obj:any) => {
          this.assetAquired(_obj, this.manifesto[i].name);
        }, undefined, (_err:any) => {
          this.assetFailed(_err, this.manifesto[i].name);
        });
        break;

      case 'cubetexture':
        this.loaderCube.setPath(this.path + 'textures/' + this.manifesto[i].name + '/');
        this.loaderCube.load([
          'xp' + ext,
          'xn' + ext,
          'yp' + ext,
          'yn' + ext,
          'zp' + ext,
          'zn' + ext
        ], (_obj:any) => {
          this.assetAquired(_obj, this.manifesto[i].name);
        }, undefined, (_err:any) => {
          this.assetFailed(_err, this.manifesto[i].name);
        });
        break;
      }
    };
    for (var i = 0; i < this.assetTotal; i++) {
      loop(i);
    }
  }
  
  remove() {
    this.container && (this.container.className = '')
  }
  
  assetAquired(_obj:any, _name:any) {
    this.cargo.addAsset(_name, _obj);
    this.assetCount++;
    this.pct = this.assetCount / this.assetTotal;
    this.progBar && (this.progBar.style.width = this.pct * 100 + '%')
    if (this.assetCount == this.assetTotal) {
      this.complete();
    }
  }
  
  assetFailed(_err:any, _name:any) {
    this.assetCount++;
    this.pct = this.assetCount / this.assetTotal;
    if (this.assetCount == this.assetTotal) {
      this.complete();
    }
  }
  
  complete() {
    this.container && (this.container.classList.remove('visible'))
    this.callback(this.cargo);
  }
}
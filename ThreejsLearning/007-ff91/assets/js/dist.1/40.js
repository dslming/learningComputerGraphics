var Cargo = function () {
  function Cargo() {
  }
  Cargo.prototype.addAsset = function (name, asset) {
    if (this[name] === undefined) {
      this[name] = asset;
      return true;
    }
    return false;
  };
  Cargo.prototype.getMesh = function (name) {
    return this[name] !== undefined ? this[name] : null;
  };
  Cargo.prototype.getTexture = function (name) {
    return this[name] !== undefined ? this[name] : null;
  };
  Cargo.prototype.getCubeTexture = function (name) {
    return this[name] !== undefined ? this[name] : null;
  };
  return Cargo;
}();
exports.Cargo = Cargo;
var AssetLoader = function () {
  function AssetLoader(_path, _manifesto, _callback) {
    this.path = _path;
    this.manifesto = _manifesto;
    this.callback = _callback;
    window['language'] = document.location.href.indexOf('/us') > -1 ? 'us' : 'cn';
    this.cargo = new Cargo();
    this.assetCount = 0;
    this.assetTotal = _manifesto.length;
    this.loaderText = new THREE.TextureLoader();
    this.loaderMesh = new THREE.ObjectLoader();
    this.loaderCube = new THREE.CubeTextureLoader();
    this.container = document.getElementById('preloader');
    this.progBar = document.getElementById('preProg');
    this.detailBox = document.getElementById('preDetail');
  }
  AssetLoader.prototype.start = function () {
    this.container.className = 'visible';
    if (window['language'] === 'us') {
      this.detailBox.innerHTML = 'Loading assets';
    } else {
      this.detailBox.innerHTML = '加载中';
    }
    var ext;
    var _loop_1 = function (i) {
      ext = '.' + this_1.manifesto[i].ext;
      switch (this_1.manifesto[i].type) {
      case 'texture':
        this_1.loaderText.load(this_1.path + 'textures/' + this_1.manifesto[i].name + ext, function (_obj) {
          this.assetAquired(_obj, this.manifesto[i].name);
        }.bind(this_1), undefined, function (_err) {
          this.assetFailed(_err, this.manifesto[i].name);
        }.bind(this_1));
        break;
      case 'mesh':
        this_1.loaderMesh.load(this_1.path + 'meshes/' + this_1.manifesto[i].name + '.json', function (_obj) {
          this.assetAquired(_obj, this.manifesto[i].name);
        }.bind(this_1), undefined, function (_err) {
          this.assetFailed(_err, this.manifesto[i].name);
        }.bind(this_1));
        break;
      case 'cubetexture':
        this_1.loaderCube.setPath(this_1.path + 'textures/' + this_1.manifesto[i].name + '/');
        this_1.loaderCube.load([
          'xp' + ext,
          'xn' + ext,
          'yp' + ext,
          'yn' + ext,
          'zp' + ext,
          'zn' + ext
        ], function (_obj) {
          this.assetAquired(_obj, this.manifesto[i].name);
        }.bind(this_1), undefined, function (_err) {
          this.assetFailed(_err, this.manifesto[i].name);
        }.bind(this_1));
        break;
      }
    };
    var this_1 = this;
    for (var i = 0; i < this.assetTotal; i++) {
      _loop_1(i);
    }
  };
  AssetLoader.prototype.remove = function () {
    this.container.className = '';
  };
  AssetLoader.prototype.assetAquired = function (_obj, _name) {
    this.cargo.addAsset(_name, _obj);
    this.assetCount++;
    this.pct = this.assetCount / this.assetTotal;
    this.progBar.style.width = this.pct * 100 + '%';
    if (this.assetCount == this.assetTotal) {
      this.complete();
    }
  };
  AssetLoader.prototype.assetFailed = function (_err, _name) {
    this.assetCount++;
    this.pct = this.assetCount / this.assetTotal;
    if (this.assetCount == this.assetTotal) {
      this.complete();
    }
  };
  AssetLoader.prototype.complete = function () {
    this.container.classList.remove('visible');
    this.callback(this.cargo);
  };
  return AssetLoader;
}();
exports.AssetLoader = AssetLoader;
export function normalize(val, min, max) {
  return Math.max(0, Math.min(1, (val - min) / (max - min)));
}

export function normalizeQuadIn(val, min, max) {
  return Math.pow(normalize(val, min, max), 2);
}
export function normalizeQuadOut(val, min, max) {
  var x = normalize(val, min, max);
  return x * (2 - x);
}

export function shuffle(array) {
  var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

export function mod(n, m) {
  return (n % m + m) % m;
}

export function scaleAndCenter(_geometry, _bounds, _center) {
  if (_center === void 0) {
    _center = 'xyz';
  }
  if (_bounds.x === undefined)
    _bounds.x = Infinity;
  if (_bounds.y === undefined)
    _bounds.y = Infinity;
  if (_bounds.z === undefined)
    _bounds.z = Infinity;
  if (_bounds.x === _bounds.y && _bounds.y === _bounds.z && _bounds.z === Infinity) {
    return null;
  }
  _geometry.computeBoundingBox();
  var geomMin = _geometry.boundingBox.min;
  var geomMax = _geometry.boundingBox.max;
  var width = geomMax.x - geomMin.x;
  var height = geomMax.z - geomMin.z;
  var depth = geomMax.y - geomMin.y;
  var avgX = _center.indexOf('x') > -1 ? (geomMax.x + geomMin.x) / 2 : 0;
  var avgY = _center.indexOf('y') > -1 ? (geomMax.y + geomMin.y) / 2 : 0;
  var avgZ = _center.indexOf('z') > -1 ? (geomMax.z + geomMin.z) / 2 : 0;
  _geometry.translate(-avgX, -avgY, -avgZ);
  var xDiff = _bounds.x / width;
  var yDiff = _bounds.y / height;
  var zDiff = _bounds.z / depth;
  var geoScale = Math.min(xDiff, yDiff, zDiff);
  _geometry.scale(geoScale, geoScale, geoScale);
}

export function zTween(_val, _target, _ratio) {
  return Math.abs(_target - _val) < 0.00001 ? _target : _val + (_target - _val) * Math.min(_ratio, 1);
}

export class Time{
  constructor(timeFactor) {
    this.fallBackRates = [
      60,
      40,
      30,
      20,
      15
    ];
    this.prev = 0;
    this.prevBreak = 0;
    this.delta = 0;
    this.timeFact = typeof timeFactor === 'undefined' ? 1 : timeFactor;
    this.frameCount = 0;
    this.fallBackIndex = 0;
    this.setFPS(60);
  }
  
  update(_newTime) {
    this.deltaBreak = Math.min(_newTime - this.prevBreak, 1);
    if (this.deltaBreak > this.spf) {
      this.delta = Math.min(_newTime - this.prev, 1);
      this.prev = _newTime;
      this.prevBreak = _newTime - this.deltaBreak % this.spf;
      return true;
    } else {
      return false;
    }
  }

  checkFPS () {
    if (this.delta > this.spf * 2) {
      this.frameCount++;
      console.log(this.frameCount);
      if (this.frameCount > 30) {
        this.frameCount = 0;
        this.fallBackIndex++;
        this.setFPS(this.fallBackRates[this.fallBackIndex]);
      }
    }
  }

  setFPS (_newVal) {
    this.fps = _newVal;
    this.spf = 1 / this.fps;
  }
}


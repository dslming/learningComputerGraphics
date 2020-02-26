define("AssetLoader", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var THREE = window.THREE;
    var Cargo = /** @class */ (function () {
        function Cargo() {
            this.mesh = {};
        }
        Cargo.prototype.addAsset = function (name, asset) {
            if (this.mesh[name] === undefined) {
                this.mesh[name] = asset;
                return true;
            }
            return false;
        };
        Cargo.prototype.getMesh = function (name) {
            return this.mesh[name] !== undefined ? this.mesh[name] : null;
        };
        Cargo.prototype.getTexture = function (name) {
            return this.mesh[name] !== undefined ? this.mesh[name] : null;
        };
        Cargo.prototype.getCubeTexture = function (name) {
            return this.mesh[name] !== undefined ? this.mesh[name] : null;
        };
        return Cargo;
    }());
    var AssetLoader = /** @class */ (function () {
        /**
         *
         * @param _path 资源的根路径
         * @param _manifesto 资源的名称和路径
         * @param _callback 加载完成的回掉
         */
        function AssetLoader(_path, _manifesto, _callback) {
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
        AssetLoader.prototype.start = function () {
            var _this = this;
            this.container && (this.container.className = 'visible');
            if (this.language === 'us') {
                this.detailBox && (this.detailBox.innerHTML = 'Loading assets');
            }
            else {
                this.detailBox && (this.detailBox.innerHTML = '加载中');
            }
            var ext;
            var loop = function (i) {
                ext = '.' + _this.manifesto[i].ext;
                switch (_this.manifesto[i].type) {
                    case 'texture':
                        _this.loaderText.load(_this.path + 'textures/' + _this.manifesto[i].name + ext, function (_obj) {
                            _this.assetAquired(_obj, _this.manifesto[i].name);
                        }, undefined, function (_err) {
                            _this.assetFailed(_err, _this.manifesto[i].name);
                        });
                        break;
                    case 'mesh':
                        _this.loaderMesh.load(_this.path + 'meshes/' + _this.manifesto[i].name + '.json', function (_obj) {
                            _this.assetAquired(_obj, _this.manifesto[i].name);
                        }, undefined, function (_err) {
                            _this.assetFailed(_err, _this.manifesto[i].name);
                        });
                        break;
                    case 'cubetexture':
                        _this.loaderCube.setPath(_this.path + 'textures/' + _this.manifesto[i].name + '/');
                        _this.loaderCube.load([
                            'xp' + ext,
                            'xn' + ext,
                            'yp' + ext,
                            'yn' + ext,
                            'zp' + ext,
                            'zn' + ext
                        ], function (_obj) {
                            _this.assetAquired(_obj, _this.manifesto[i].name);
                        }, undefined, function (_err) {
                            _this.assetFailed(_err, _this.manifesto[i].name);
                        });
                        break;
                }
            };
            for (var i = 0; i < this.assetTotal; i++) {
                loop(i);
            }
        };
        AssetLoader.prototype.remove = function () {
            this.container && (this.container.className = '');
        };
        AssetLoader.prototype.assetAquired = function (_obj, _name) {
            this.cargo.addAsset(_name, _obj);
            this.assetCount++;
            this.pct = this.assetCount / this.assetTotal;
            this.progBar && (this.progBar.style.width = this.pct * 100 + '%');
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
            this.container && (this.container.classList.remove('visible'));
            this.callback(this.cargo);
        };
        return AssetLoader;
    }());
    exports.default = AssetLoader;
});
define("Tool", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function normalize(val, min, max) {
        return Math.max(0, Math.min(1, (val - min) / (max - min)));
    }
    exports.normalize = normalize;
    function normalizeQuadIn(val, min, max) {
        return Math.pow(normalize(val, min, max), 2);
    }
    exports.normalizeQuadIn = normalizeQuadIn;
    function normalizeQuadOut(val, min, max) {
        var x = normalize(val, min, max);
        return x * (2 - x);
    }
    exports.normalizeQuadOut = normalizeQuadOut;
    function shuffle(array) {
        var m = array.length, t, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    }
    exports.shuffle = shuffle;
    function mod(n, m) {
        return (n % m + m) % m;
    }
    exports.mod = mod;
    function scaleAndCenter(_geometry, _bounds, _center) {
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
    exports.scaleAndCenter = scaleAndCenter;
    function zTween(_val, _target, _ratio) {
        return Math.abs(_target - _val) < 0.00001 ? _target : _val + (_target - _val) * Math.min(_ratio, 1);
    }
    exports.zTween = zTween;
    var Time = /** @class */ (function () {
        function Time(timeFactor) {
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
        Time.prototype.update = function (_newTime) {
            this.deltaBreak = Math.min(_newTime - this.prevBreak, 1);
            if (this.deltaBreak > this.spf) {
                this.delta = Math.min(_newTime - this.prev, 1);
                this.prev = _newTime;
                this.prevBreak = _newTime - this.deltaBreak % this.spf;
                return true;
            }
            else {
                return false;
            }
        };
        Time.prototype.checkFPS = function () {
            if (this.delta > this.spf * 2) {
                this.frameCount++;
                console.log(this.frameCount);
                if (this.frameCount > 30) {
                    this.frameCount = 0;
                    this.fallBackIndex++;
                    this.setFPS(this.fallBackRates[this.fallBackIndex]);
                }
            }
        };
        Time.prototype.setFPS = function (_newVal) {
            this.fps = _newVal;
            this.spf = 1 / this.fps;
        };
        return Time;
    }());
    exports.Time = Time;
});
define("Props", ["require", "exports", "Tool"], function (require, exports, Tool_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var THREE = window.THREE;
    var FF91Props = /** @class */ (function () {
        function FF91Props() {
        }
        FF91Props.Accel = 5;
        FF91Props.Decel = -10;
        FF91Props.MaxVel = 70 * 1610 / 3600;
        FF91Props.MaxTurn = Math.PI * 0.2;
        FF91Props.Length = 5.25;
        FF91Props.Width = 2.283;
        FF91Props.WheelTrack = 1.72;
        FF91Props.WheelBase = 3.2;
        FF91Props.WheelDiam = 0.78;
        FF91Props.WheelCirc = FF91Props.WheelDiam * Math.PI;
        return FF91Props;
    }());
    exports.FF91Props = FF91Props;
    // pc下 不同模式的相机参数
    var Desktop = [
        // 尺寸
        {
            name: 'dimensions',
            size: {
                w: 930,
                h: 480
            },
            position: {
                x: 2,
                y: -1,
                z: 1
            },
            // 方向
            orientation: {
                x: -45,
                y: 35,
                z: 30
            },
            camDist: 6,
            camPos: {
                x: 2,
                y: 0,
                z: 1
            },
            camRot: {
                x: -45,
                y: 20
            },
            camRotRange: {
                x: 10,
                y: 10
            }
        },
        // 电池
        {
            name: 'battery',
            size: {
                w: 1000,
                h: 550
            },
            position: {
                x: 0,
                y: 0,
                z: 2.3
            },
            orientation: {
                x: -90,
                y: 0,
                z: 0
            },
            camDist: 5.7,
            camPos: {
                x: 0,
                y: 0.5,
                z: 1
            },
            camRot: {
                x: 0,
                y: 80
            },
            camRotRange: {
                x: 40,
                y: 50
            }
        },
        // 动力
        {
            name: 'powertrain',
            size: {
                w: 800,
                h: 540
            },
            position: {
                x: 2,
                y: 1,
                z: 2.8
            },
            orientation: {
                x: 0,
                y: -90,
                z: 0
            },
            camDist: 5,
            camPos: {
                x: -1,
                y: 1,
                z: 1.5
            },
            camRot: {
                x: 80,
                y: 0
            },
            camRotRange: {
                x: 10,
                y: 30
            }
        },
        // 驾驶
        {
            name: 'steering',
            size: {
                w: 900,
                h: 570
            },
            position: {
                x: 2,
                y: 1,
                z: -2.75
            },
            orientation: {
                x: 0,
                y: -90,
                z: 0
            },
            camDist: 5,
            camPos: {
                x: -1,
                y: 1,
                z: -1.5
            },
            camRot: {
                x: 100,
                y: 0
            },
            camRotRange: {
                x: 10,
                y: 10
            }
        },
        // 前灯
        {
            name: 'front-lighting',
            size: {
                w: 930,
                h: 520
            },
            position: {
                x: 0,
                y: 2.8,
                z: 0
            },
            orientation: {
                x: 0,
                y: 90,
                z: 0
            },
            camDist: 5,
            camPos: {
                x: 1,
                y: 1.2,
                z: 0
            },
            camRot: {
                x: -90,
                y: -5
            },
            camRotRange: {
                x: 30,
                y: 0
            },
            inverted: true
        },
        // 尾灯
        {
            name: 'rear-lighting',
            size: {
                w: 900,
                h: 400
            },
            position: {
                x: 0,
                y: 2.8,
                z: 0
            },
            orientation: {
                x: 0,
                y: -90,
                z: 0
            },
            camDist: 4,
            camPos: {
                x: -1,
                y: 1.5,
                z: 0
            },
            camRot: {
                x: 90,
                y: -5
            },
            camRotRange: {
                x: 30,
                y: 10
            },
            inverted: true
        },
        // 空气动力学
        {
            name: 'aerodynamics',
            size: {
                w: 930,
                h: 490
            },
            position: {
                x: 0,
                y: 3,
                z: -2
            },
            orientation: {
                x: 0,
                y: 0,
                z: 0
            },
            camDist: 5,
            camPos: {
                x: 0,
                y: 1.5,
                z: 0
            },
            camRot: {
                x: 0,
                y: 0
            },
            camRotRange: {
                x: 10,
                y: 10
            }
        },
        // 自由浏览
        {
            name: 'free-viewing',
            size: {
                w: 465,
                h: 320
            },
            position: {
                x: 0,
                y: 0,
                z: 0
            },
            orientation: {
                x: 0,
                y: 0,
                z: 0
            },
            camDist: 6,
            camPos: {
                x: 0,
                y: 1,
                z: 0
            }
        }
    ];
    var Mobile = JSON.parse(JSON.stringify(Desktop));
    Mobile[1].camDist = 6.5;
    Mobile[2].position = {
        x: 0,
        y: 2.8,
        z: 0.9
    };
    Mobile[2].camPos = {
        x: -1,
        y: 1.5,
        z: 1
    };
    Mobile[3].position = {
        x: 2,
        y: 2.8,
        z: -1.5
    };
    Mobile[3].camRot = {
        x: 95,
        y: 0
    };
    Mobile[3].camPos = {
        x: -1,
        y: 1.5,
        z: -1.5
    };
    Mobile[5].position = {
        x: 0,
        y: 3,
        z: 0
    };
    Mobile[5].camDist = 5;
    Mobile[6].position = {
        x: 0,
        y: 3,
        z: 3
    };
    Mobile[6].camPos = {
        x: 0,
        y: 2,
        z: 0
    };
    Mobile[6].camDist = 9;
    Mobile[7].camDist = 8;
    var CardProps = /** @class */ (function () {
        function CardProps() {
            this.GOLDEN_RATIO = 1000;
            this.time = new Tool_1.Time(undefined);
            // 速度
            this.velocity = new THREE.Vector2();
            this.speed = 1;
            // 加速度
            this.accel = 0;
            this.pos = new THREE.Vector2();
            // 纵向推力
            this.longitMomentum = 0;
            // 横向推力
            this.lateralMomentum = 0;
            this.wAngleInner = 0;
            this.wAngleOuter = 0;
            this.wAngleTarg = 0;
            this.joyVec = new THREE.Vector2();
            this.keys = new Array();
            this.braking = false;
            this.headLights = 2;
            this.omega = 0;
            this.theta = 0;
        }
        CardProps.prototype.onKeyDown = function (evt) {
            if (this.keys.indexOf(evt.keyCode) === -1) {
                this.keys.push(evt.keyCode);
            }
        };
        CardProps.prototype.onKeyUp = function (evt) {
            this.keys.splice(this.keys.indexOf(evt.keyCode), 1);
        };
        CardProps.prototype.readKeyboardInput = function () {
            for (var i = 0; i < this.keys.length; i++) {
                switch (this.keys[i]) {
                    case 38:
                        this.accel += FF91Props.Accel;
                        this.accel *= Tool_1.normalizeQuadIn(this.speed, FF91Props.MaxVel, FF91Props.MaxVel - 10);
                        break;
                    case 40:
                        this.accel += FF91Props.Decel;
                        break;
                    case 37:
                        this.wAngleTarg += FF91Props.MaxTurn;
                        break;
                    case 39:
                        this.wAngleTarg -= FF91Props.MaxTurn;
                        break;
                }
            }
        };
        CardProps.prototype.onJoystickMove = function (_vec) {
            this.joyVec.x = _vec.x / -40;
            this.joyVec.y = _vec.y / -40;
            if (Math.abs(this.joyVec.x) > 0.85) {
                this.joyVec.y = 0;
            }
            if (Math.abs(this.joyVec.y) > 0.95) {
                this.joyVec.x = 0;
            }
        };
        CardProps.prototype.onKnobMove = function (_vec, _section) {
            this.joyVec.x = _vec.x / -150;
            this.joyVec.y = _vec.y / -150;
            if (_section === 5 && Math.abs(this.joyVec.x) < 0.1) {
                this.joyVec.x = 0;
            }
        };
        CardProps.prototype.readJoyStickInput = function () {
            this.wAngleTarg = this.joyVec.x * FF91Props.MaxTurn;
            if (this.joyVec.y >= 0) {
                this.accel = this.joyVec.y * FF91Props.Accel;
                this.accel *= Tool_1.normalizeQuadIn(this.speed, FF91Props.MaxVel, FF91Props.MaxVel - 10);
            }
            else {
                this.accel = this.joyVec.y * -FF91Props.Decel;
            }
        };
        CardProps.prototype.changeHeadlights = function (_new) {
            this.headLights = THREE.Math.clamp(Math.round(_new), 0, 4);
        };
        CardProps.prototype.update = function (_time) {
            if (this.time.update(_time) === false) {
                return false;
            }
            this.accel = 0;
            this.wAngleTarg = 0;
            if (this.keys.length > 0) {
                this.readKeyboardInput();
            }
            else if (this.joyVec.x != 0 || this.joyVec.y != 0) {
                this.readJoyStickInput();
            }
            this.accel *= this.time.delta;
            this.speed += this.accel;
            this.braking = this.accel < 0;
            if (this.speed < 0) {
                this.speed = 0;
                this.accel = 0;
            }
            this.frameDist = this.speed * this.time.delta;
            this.wAngleTarg *= Tool_1.normalizeQuadIn(this.speed, FF91Props.MaxVel + 10, 3);
            this.wAngleInner = Tool_1.zTween(this.wAngleInner, this.wAngleTarg, this.time.delta * 2);
            this.wAngleSign = this.wAngleInner > 0.001 ? 1 : this.wAngleInner < -0.001 ? -1 : 0;
            this.omega = this.wAngleInner * this.speed / FF91Props.WheelBase;
            this.theta += this.omega * this.time.delta;
            this.velocity.set(Math.cos(this.theta) * this.frameDist, -Math.sin(this.theta) * this.frameDist);
            this.pos.add(this.velocity);
            this.longitMomentum = Tool_1.zTween(this.longitMomentum, this.accel / this.time.delta, this.time.delta * 6);
            this.lateralMomentum = this.omega * this.speed;
            if (this.wAngleSign) {
                this.radFrontIn = FF91Props.WheelBase / Math.sin(this.wAngleInner);
                this.radBackIn = FF91Props.WheelBase / Math.tan(this.wAngleInner);
                this.radBackOut = this.radBackIn + FF91Props.WheelTrack * this.wAngleSign;
                this.wAngleOuter = Math.atan(FF91Props.WheelBase / this.radBackOut);
                this.radFrontOut = FF91Props.WheelBase / Math.sin(this.wAngleOuter);
            }
            else {
                this.radFrontOut = 100;
                this.radBackOut = 100;
                this.radBackIn = 100;
                this.radFrontIn = 100;
                this.wAngleOuter = 0;
            }
            return true;
        };
        CardProps.Mobile = Mobile;
        CardProps.Desktop = Desktop;
        return CardProps;
    }());
    exports.CardProps = CardProps;
});
define("shader/batt_vert.glsl", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = "\nprecision highp float;\n\nfloat normFloat(float n, float minVal, float maxVal){\n\treturn max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\nuniform vec3 cameraPosition;\nuniform mat4 modelMatrix;\nuniform mat4 viewMatrix;\nuniform mat4 projectionMatrix;\nuniform float progress;\n\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec3 offset;\nattribute float battID;\n\nvarying float brightness;\n\nvoid main() {\n\tfloat prog = normFloat(progress, battID, battID + 5.0);\n \tvec4 realPos = modelMatrix * vec4(offset + position * prog, 1.0);\n\tvec3 realNorm = normalize(vec3(modelMatrix * vec4(normal, 0.0)));\n\n\tvec3 lightVector = normalize(cameraPosition - realPos.xyz);\n\tbrightness = dot(realNorm, lightVector);\n\t// brightness = normFloat(brightness, 0.8, 0.3);\t// Front side\n\tbrightness = normFloat(-brightness, 0.8, 0.3);\t// Back side\n\tgl_Position = projectionMatrix * viewMatrix * realPos;\n}\n";
});
define("shader/batt_frag.glsl", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = "\nprecision highp float;\nvarying float brightness;\n\nvoid main() {\n\t// gl_FragColor = vec4(0.627, 0.443, 0.341, brightness); // Copper\n\tgl_FragColor = vec4(0.29, 0.82, 0.95, brightness);\t// Blue\n}\n";
});
define("Batts", ["require", "exports", "tslib", "Tool", "Props", "shader/batt_vert.glsl", "shader/batt_frag.glsl"], function (require, exports, tslib_1, Tool_2, Props_1, batt_vert_glsl_1, batt_frag_glsl_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    batt_vert_glsl_1 = tslib_1.__importDefault(batt_vert_glsl_1);
    batt_frag_glsl_1 = tslib_1.__importDefault(batt_frag_glsl_1);
    var THREE = window.THREE;
    var Power2 = window.Power2;
    var TweenLite = window.TweenLite;
    var Batts = /** @class */ (function () {
        function Batts(_parent, _object) {
            this.showing = false;
            this.parent = _parent;
            this.singleBatt = _object.getObjectByName('Batt');
            this.singleGeom = this.singleBatt.geometry;
            Tool_2.scaleAndCenter(this.singleGeom, { x: Props_1.FF91Props.WheelBase * 0.65 / 6 }, "");
            this.singleGeom.computeVertexNormals();
            this.cloneBatts();
        }
        Batts.prototype.cloneBatts = function () {
            this.stringGeom = new THREE.InstancedBufferGeometry();
            this.stringGeom.index = this.singleGeom.index;
            this.stringGeom.attributes.position = this.singleGeom.attributes.position;
            this.stringGeom.attributes.normal = this.singleGeom.attributes.normal;
            var offsets = [];
            var battID = [];
            var xSpacing = Props_1.FF91Props.WheelBase * 0.7 / 6;
            var zSpacing = Props_1.FF91Props.WheelTrack * 0.7 / 6;
            for (var x = 0, i = 0; x < 6; x++) {
                for (var z = 0; z < 6; z++, i++) {
                    offsets.push(-x * xSpacing, z * zSpacing, 0);
                    battID.push(i);
                }
            }
            this.stringGeom.addAttribute('offset', new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3));
            this.stringGeom.addAttribute('battID', new THREE.InstancedBufferAttribute(new Float32Array(battID), 1));
            this.stringMat = new THREE.RawShaderMaterial({
                uniforms: { progress: { value: 0 } },
                vertexShader: batt_vert_glsl_1.default,
                fragmentShader: batt_frag_glsl_1.default,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthTest: false,
                side: THREE.BackSide
            });
            this.progUniform = this.stringMat.uniforms['progress'];
            this.stringMesh = new THREE.Mesh(this.stringGeom, this.stringMat);
            this.stringMesh.applyMatrix(this.singleBatt.matrix);
            this.stringMesh.position.set(0.65, 0.35, -0.5);
            this.stringMesh.visible = false;
            this.parent.add(this.stringMesh);
        };
        Batts.prototype.show = function () {
            if (!this.showing) {
                this.showing = true;
                this.stringMesh.visible = true;
                TweenLite.killTweensOf(this);
                TweenLite.to(this.progUniform, 1, {
                    value: 36 + 4,
                    ease: Power2.easeInOut
                });
            }
        };
        Batts.prototype.hide = function () {
            var _this = this;
            if (this.showing) {
                this.showing = false;
                TweenLite.killTweensOf(this);
                TweenLite.to(this.progUniform, 1, {
                    value: 0,
                    ease: Power2.easeInOut,
                    onComplete: function () {
                        _this.stringMesh.visible = false;
                    }
                });
            }
        };
        ;
        return Batts;
    }());
    exports.default = Batts;
});
define("CameraControl", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var THREE = window.THREE;
    var CameraControl = /** @class */ (function () {
        function CameraControl(options) {
            this.forceUpdate = true;
            this.options = {
                distance: 90,
                focusPos: new THREE.Vector3(),
                rotation: new THREE.Vector3(),
                rotRange: {
                    xMax: Number.POSITIVE_INFINITY,
                    xMin: Number.NEGATIVE_INFINITY,
                    yMax: 90,
                    yMin: -90
                },
                distRange: {
                    max: Number.POSITIVE_INFINITY,
                    min: Number.NEGATIVE_INFINITY
                },
                fov: 45,
                eyeSeparation: 1.5,
                smartUpdates: false
            };
            this.readOptions(options);
            this.vpW = window.innerWidth;
            this.vpH = window.innerHeight;
            this.quatX = new THREE.Quaternion();
            this.quatY = new THREE.Quaternion();
            this.camHolder = new THREE.Object3D();
            this.gyro = { orient: 0 };
            if (window.orientation !== undefined) {
                this.defaultEuler = new THREE.Euler(90 * CameraControl.RADIANS, 180 * CameraControl.RADIANS, (180 + parseInt(window.orientation.toString(), 10)) * CameraControl.RADIANS);
            }
            else {
                this.defaultEuler = new THREE.Euler(0, 0, 0);
            }
        }
        CameraControl.prototype.readOptions = function (options) {
            var opt = this.options;
            for (var key in options) {
                if (key === 'rotRange') {
                    for (var key_1 in options.rotRange) {
                        opt.rotRange[key_1] = options.rotRange[key_1];
                    }
                }
                else if (key === 'distRange') {
                    for (var key_2 in options.distRange) {
                        opt.distRange[key_2] = options.distRange[key_2];
                    }
                }
                else if (key === 'focusPos') {
                    for (var key_3 in options.focusPos) {
                        opt.focusPos[key_3] = options.focusPos[key_3];
                    }
                }
                else if (key === 'rotation') {
                    for (var key_4 in options.rotation) {
                        opt.rotation[key_4] = options.rotation[key_4];
                    }
                }
                else {
                    opt[key] = options[key];
                }
            }
            this.distActual = opt.distance;
            this.distTarget = opt.distance;
            // 实际焦点
            this.focusActual = new THREE.Vector3(opt.focusPos.x, opt.focusPos.y, opt.focusPos.z);
            // 目标焦点
            this.focusTarget = this.focusActual.clone();
            this.rotActual = new THREE.Vector3(opt.rotation.x, opt.rotation.y, opt.rotation.z);
            this.rotTarget = this.rotActual.clone();
        };
        CameraControl.prototype.setDistance = function (dist) {
            this.distTarget = dist;
            this.distTarget = THREE.Math.clamp(this.distTarget, this.options.distRange.min, this.options.distRange.max);
            this.forceUpdate = true;
        };
        CameraControl.prototype.setDistRange = function (max, min) {
            this.options.distRange.max = max;
            this.options.distRange.min = min;
        };
        CameraControl.prototype.setRotation = function (_rotX, _rotY, _rotZ) {
            if (_rotX === void 0) {
                _rotX = 0;
            }
            if (_rotY === void 0) {
                _rotY = 0;
            }
            if (_rotZ === void 0) {
                _rotZ = 0;
            }
            this.rotActual.set(_rotX, _rotY, _rotZ);
            this.rotTarget.set(_rotX, _rotY, _rotZ);
            this.gyro.alpha = undefined;
            this.gyro.beta = undefined;
            this.gyro.gamma = undefined;
            this.forceUpdate = true;
        };
        CameraControl.prototype.setRotRange = function (xMax, xMin, yMax, yMin) {
            this.options.rotRange.xMax = xMax !== undefined ? xMax : this.options.rotRange.xMax;
            this.options.rotRange.xMin = xMin !== undefined ? xMin : this.options.rotRange.xMin;
            this.options.rotRange.yMax = yMax !== undefined ? yMax : this.options.rotRange.yMax;
            this.options.rotRange.yMin = yMin !== undefined ? yMin : this.options.rotRange.yMin;
        };
        CameraControl.prototype.clearRotRange = function () {
            this.options.rotRange.xMax = Number.POSITIVE_INFINITY;
            this.options.rotRange.xMin = Number.NEGATIVE_INFINITY;
            this.options.rotRange.yMax = Number.POSITIVE_INFINITY;
            this.options.rotRange.yMin = Number.NEGATIVE_INFINITY;
        };
        CameraControl.prototype.setFocusPos = function (_posX, _posY, _posZ) {
            if (_posX === void 0) {
                _posX = 0;
            }
            if (_posY === void 0) {
                _posY = 0;
            }
            if (_posZ === void 0) {
                _posZ = 0;
            }
            this.focusActual.set(_posX, _posY, _posZ);
            this.focusTarget.set(_posX, _posY, _posZ);
            this.forceUpdate = true;
        };
        CameraControl.prototype.getDistance = function () {
            return this.distTarget;
        };
        CameraControl.prototype.dolly = function (distance) {
            this.distTarget += distance;
            this.distTarget = THREE.Math.clamp(this.distTarget, this.options.distRange.min, this.options.distRange.max);
        };
        CameraControl.prototype.orbitBy = function (angleX, angleY) {
            this.rotTarget.x += angleX;
            this.rotTarget.y += angleY;
            this.rotTarget.x = THREE.Math.clamp(this.rotTarget.x, this.options.rotRange.xMin, this.options.rotRange.xMax);
            this.rotTarget.y = THREE.Math.clamp(this.rotTarget.y, this.options.rotRange.yMin, this.options.rotRange.yMax);
        };
        CameraControl.prototype.orbitTo = function (angleX, angleY) {
            console.error('orbitTo...');
            this.rotTarget.x = angleX;
            this.rotTarget.y = angleY;
            this.rotTarget.x = THREE.Math.clamp(this.rotTarget.x, this.options.rotRange.xMin, this.options.rotRange.xMax);
            this.rotTarget.y = THREE.Math.clamp(this.rotTarget.y, this.options.rotRange.yMin, this.options.rotRange.yMax);
        };
        CameraControl.prototype.pan = function (distX, distY) {
            console.error('pan...');
            this.focusTarget.x -= distX;
            this.focusTarget.y += distY;
        };
        CameraControl.prototype.onWindowResize = function (vpW, vpH) {
            console.error('onWindowResize...');
            this.vpW = vpW;
            this.vpH = vpH;
            this.forceUpdate = true;
        };
        CameraControl.prototype.onDeviceReorientation = function (orientation) {
            console.error('onDeviceReorientation...');
            this.gyro.orient = orientation * CameraControl.RADIANS;
            this.forceUpdate = true;
        };
        CameraControl.prototype.onGyroMove = function (alpha, beta, gamma) {
            console.error('onGyroMove...');
            var acc = this.gyro;
            acc.alpha = alpha;
            acc.beta = beta;
            acc.gamma = gamma;
        };
        CameraControl.prototype.follow = function (target) {
            console.error('follow...');
            this.distTarget = THREE.Math.clamp(this.distTarget, this.options.distRange.min, this.options.distRange.max);
            this.distActual += (this.distTarget - this.distActual) * 0.01;
            this.focusTarget.set(target.x, target.y + 1, target.z + this.distActual);
            this.focusActual.lerp(this.focusTarget, 0.01);
            this.camHolder.position.copy(this.focusActual);
            this.camHolder.lookAt(target);
        };
        CameraControl.prototype.changesOccurred = function () {
            console.error('changesOccurred...');
            if (this.options.smartUpdates && this.rotActual.manhattanDistanceTo(this.rotTarget) < 0.01 && Math.abs(this.distActual - this.distTarget) < 0.01 && this.focusActual.manhattanDistanceTo(this.focusTarget) < 0.01) {
                return false;
            }
            return true;
        };
        CameraControl.RADIANS = Math.PI / 180;
        CameraControl.AXIS_X = new THREE.Vector3(1, 0, 0);
        CameraControl.AXIS_Y = new THREE.Vector3(0, 1, 0);
        return CameraControl;
    }());
    exports.default = CameraControl;
});
define("Camera", ["require", "exports", "tslib", "CameraControl", "Tool"], function (require, exports, tslib_2, CameraControl_1, Tool_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    CameraControl_1 = tslib_2.__importDefault(CameraControl_1);
    var THREE = window.THREE;
    var Camera = /** @class */ (function (_super) {
        tslib_2.__extends(Camera, _super);
        function Camera(options) {
            var _this = _super.call(this, options) || this;
            _this.camera = new THREE.PerspectiveCamera(_this.options.fov, _this.vpW / _this.vpH, 0.1, 100);
            _this.camera.name = 'camera';
            return _this;
        }
        Camera.prototype.onWindowResize = function (vpW, vpH) {
            _super.prototype.onWindowResize.call(this, vpW, vpH);
            this.camera.aspect = this.vpW / this.vpH;
            this.camera.updateProjectionMatrix();
        };
        ;
        Camera.prototype.update = function () {
            if (!this.forceUpdate && !this.changesOccurred()) {
                return false;
            }
            // focusTarget (0, 1, 0)
            this.focusActual.lerp(this.focusTarget, 0.2);
            this.camera.position.copy(this.focusActual);
            if (this.gyro.alpha && this.gyro.beta && this.gyro.gamma) {
                // this.camera.setRotationFromEuler(this.defaultEuler);
                // this.camera.rotateZ(this.gyro.alpha * CameraControl.RADIANS);
                // this.camera.rotateX(this.gyro.beta * CameraControl.RADIANS);
                // this.camera.rotateY(this.gyro.gamma * CameraControl.RADIANS);
                // this.camera.rotation.z += this.gyro.orient;
            }
            else {
                // 每次减少 0.5
                this.rotActual.lerp(this.rotTarget, 0.2);
                // 鼠标移动方向和旋转方向相反,所以这里取负号
                this.quatX.setFromAxisAngle(CameraControl_1.default.AXIS_X, -THREE.Math.degToRad(this.rotActual.y));
                this.quatY.setFromAxisAngle(CameraControl_1.default.AXIS_Y, -THREE.Math.degToRad(this.rotActual.x));
                this.quatY.multiply(this.quatX);
                this.camera.quaternion.copy(this.quatY);
            }
            if (this.distActual !== this.distTarget) {
                this.distActual = Tool_3.zTween(this.distActual, this.distTarget, 0.05);
            }
            this.camera.translateZ(this.distActual);
            this.forceUpdate = false;
            return true;
        };
        return Camera;
    }(CameraControl_1.default));
    exports.default = Camera;
});
define("CameraDebug", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CAMERA_VIEW_WIDTH = 480 / 480 * 500;
    var CAMERA_VIEW_HEIGHT = 320 / 480 * 500;
    var THREE = window.THREE;
    var CameraDebug = /** @class */ (function () {
        function CameraDebug(userCamera, scene, renderer, vw, vh) {
            this.time = 0;
            this.renderer = renderer;
            this.scene = scene;
            this.userCamera = userCamera;
            // 给userCamera 加 help
            this.userCameraHelp = new THREE.CameraHelper(userCamera);
            this.userCameraHelp.name = 'userCameraHelp';
            scene.add(this.userCameraHelp);
            // 配置调试相机
            this.debugCamera = new THREE.PerspectiveCamera(30, CAMERA_VIEW_WIDTH / CAMERA_VIEW_HEIGHT, 1, 500);
            this.debugCamera.name = 'debugCamera';
            scene.add(this.debugCamera);
        }
        CameraDebug.prototype.update = function (dt) {
            this.time += dt;
            var AROUND_VECTOR = new THREE.Vector3(0, 30, 30);
            this.debugCamera.position.copy(AROUND_VECTOR);
            this.debugCamera.lookAt(0, 0, 0);
        };
        CameraDebug.prototype.draw = function () {
            this.renderer.clear();
            this.userCameraHelp.update();
            // user渲染器。setScissor （left ，positiveYUpBottom ，width ，height ）;
            this.renderer.setScissor(0, CAMERA_VIEW_HEIGHT, CAMERA_VIEW_WIDTH, CAMERA_VIEW_HEIGHT);
            this.renderer.setViewport(0, CAMERA_VIEW_HEIGHT, CAMERA_VIEW_WIDTH, CAMERA_VIEW_HEIGHT);
            this.renderer.render(this.scene, this.userCamera);
            // debug
            this.renderer.setScissor(0, 0, CAMERA_VIEW_WIDTH, CAMERA_VIEW_HEIGHT);
            this.renderer.setViewport(0, 0, CAMERA_VIEW_WIDTH, CAMERA_VIEW_HEIGHT);
            this.renderer.render(this.scene, this.debugCamera);
        };
        CameraDebug.prototype.run = function () {
            this.update(1 / 60);
            this.draw();
        };
        return CameraDebug;
    }());
    exports.default = CameraDebug;
});
define("CarWheels", ["require", "exports", "Tool", "Props"], function (require, exports, Tool_4, Props_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var THREE = window.THREE;
    var CarWheels = /** @class */ (function () {
        function CarWheels(_carWhole, _cargo) {
            this.maxWheelTurn = Math.PI / 9.69;
            this.carWhole = _carWhole;
            this.thread = _cargo.getTexture('thread');
            this.thread.minFilter = THREE.NearestFilter;
            this.thread.magFilter = THREE.LinearFilter;
            this.thread.format = THREE.RGBFormat;
            this.ogMatrix = new THREE.Matrix4().set(0.000788, 0, 0, -0.3939, 0, 0, 0.000788, -0.3939, 0, -0.000788, 0, 0.15, 0, 0, 0, 1);
            this.wPosFr = Props_2.FF91Props.WheelBase;
            this.wPosBk = 0;
            this.wPosLf = Props_2.FF91Props.WheelTrack / -2;
            this.wPosRt = Props_2.FF91Props.WheelTrack / 2;
            this.wPosY = Props_2.FF91Props.WheelDiam / 2;
            var wheelGeom = _cargo.getMesh('wheel');
            this.addWheels(wheelGeom.getObjectByName('Wheel'));
            // 刹车
            this.addBrakes(wheelGeom.getObjectByName('Brake'));
        }
        CarWheels.prototype.addWheels = function (_wheelGroup) {
            this.wheelFL = _wheelGroup;
            // 轮胎
            var meshRubber = this.wheelFL.getObjectByName('Tire');
            // 轮缘银
            var meshSilver = this.wheelFL.getObjectByName('RimsSilver');
            // 黑色轮辋
            var meshBlack = this.wheelFL.getObjectByName('RimsBlack');
            // 橡胶
            var geomRubber = meshRubber.geometry;
            // 银
            var geomSilver = meshSilver.geometry;
            // 黑
            var geomBlack = meshBlack.geometry;
            geomRubber.applyMatrix(this.ogMatrix);
            geomSilver.applyMatrix(this.ogMatrix);
            geomBlack.applyMatrix(this.ogMatrix);
            geomRubber.computeVertexNormals();
            geomSilver.computeVertexNormals();
            geomBlack.computeVertexNormals();
            var matRubber = new THREE.MeshLambertMaterial({
                color: 2105376,
                map: this.thread,
                side: THREE.DoubleSide
            });
            var matSilver = new THREE.MeshPhongMaterial({
                color: 10066329,
                shininess: 50,
                side: THREE.DoubleSide
            });
            var matBlack = new THREE.MeshPhongMaterial({
                color: 1118481,
                shininess: 50,
                side: THREE.DoubleSide
            });
            meshRubber.material = matRubber;
            meshSilver.material = matSilver;
            meshBlack.material = matBlack;
            this.wheelFL.position.set(this.wPosFr, this.wPosY, this.wPosLf);
            this.carWhole.add(this.wheelFL);
            this.wheelBL = this.wheelFL.clone();
            this.wheelBL.position.set(this.wPosBk, this.wPosY, this.wPosLf);
            this.carWhole.add(this.wheelBL);
            var iGeomRubber = geomRubber.clone().scale(1, 1, -1);
            var iGeomSilver = geomSilver.clone().scale(1, 1, -1);
            var iGeomBlack = geomBlack.clone().scale(1, 1, -1);
            iGeomRubber.computeVertexNormals();
            iGeomSilver.computeVertexNormals();
            iGeomBlack.computeVertexNormals();
            var iMeshRubber = new THREE.Mesh(iGeomRubber, matRubber);
            var iMeshSilver = new THREE.Mesh(iGeomSilver, matSilver);
            var iMeshBlack = new THREE.Mesh(iGeomBlack, matBlack);
            this.wheelFR = new THREE.Group();
            this.wheelFR.add(iMeshRubber);
            this.wheelFR.add(iMeshSilver);
            this.wheelFR.add(iMeshBlack);
            this.wheelFR.position.set(this.wPosFr, this.wPosY, this.wPosRt);
            this.carWhole.add(this.wheelFR);
            this.wheelBR = this.wheelFR.clone();
            this.wheelBR.position.set(this.wPosBk, this.wPosY, this.wPosRt);
            this.carWhole.add(this.wheelBR);
        };
        ;
        CarWheels.prototype.addBrakes = function (_brakeGroup) {
            this.brakeBL = _brakeGroup;
            var brMeshDisc = this.brakeBL.getObjectByName('Disc');
            var brMeshPads = this.brakeBL.getObjectByName('Pad');
            brMeshDisc.geometry.applyMatrix(this.ogMatrix);
            brMeshPads.geometry.applyMatrix(this.ogMatrix);
            brMeshDisc.material = new THREE.MeshPhongMaterial({
                color: 5592405,
                shininess: 100,
                flatShading: true
            });
            brMeshPads.material = new THREE.MeshPhongMaterial({
                color: 3355443,
                shininess: 50,
                flatShading: true
            });
            this.brakeBL.position.set(this.wPosBk, this.wPosY, this.wPosLf);
            this.carWhole.add(this.brakeBL);
            this.brakeFL = this.brakeBL.clone();
            this.brakeFL.position.set(this.wPosFr, this.wPosY, this.wPosLf);
            this.brakeFL.rotation.set(0, 0, Math.PI);
            this.carWhole.add(this.brakeFL);
            this.brakeFR = this.brakeBL.clone();
            this.brakeFR.position.set(this.wPosFr, this.wPosY, this.wPosRt);
            this.brakeFR.rotation.set(Math.PI, 0, Math.PI);
            this.carWhole.add(this.brakeFR);
            this.brakeBR = this.brakeBL.clone();
            this.brakeBR.position.set(this.wPosBk, this.wPosY, this.wPosRt);
            this.brakeBR.rotation.set(Math.PI, 0, 0);
            this.carWhole.add(this.brakeBR);
        };
        ;
        CarWheels.prototype.turnByRadiusRatio = function (_props) {
            this.rotOverall = -_props.frameDist / Props_2.FF91Props.WheelCirc * Math.PI * 2;
            this.rotFL = this.rotBL = this.rotFR = this.rotBR = Math.max(this.rotOverall, -this.maxWheelTurn);
            if (_props.wAngleSign !== 0) {
                this.ratioFO = _props.radFrontOut / _props.radBackIn;
                this.ratioBO = _props.radBackOut / _props.radBackIn;
                this.ratioFI = _props.radFrontIn / _props.radBackIn;
                this.ratioBI = 1;
                if (_props.wAngleSign == 1) {
                    this.rotFL *= this.ratioFI;
                    this.rotBL *= this.ratioBI;
                    this.rotFR *= this.ratioFO;
                    this.rotBR *= this.ratioBO;
                    this.wheelFL.rotation.y = _props.wAngleInner;
                    this.wheelFR.rotation.y = _props.wAngleOuter;
                    this.brakeFL.rotation.y = _props.wAngleInner;
                    this.brakeFR.rotation.y = -_props.wAngleOuter;
                }
                else {
                    this.rotFL *= this.ratioFO;
                    this.rotBL *= this.ratioBO;
                    this.rotFR *= this.ratioFI;
                    this.rotBR *= this.ratioBI;
                    this.wheelFL.rotation.y = _props.wAngleOuter;
                    this.wheelFR.rotation.y = _props.wAngleInner;
                    this.brakeFL.rotation.y = _props.wAngleOuter;
                    this.brakeFR.rotation.y = -_props.wAngleInner;
                }
                this.brakeBL.rotation.y = this.wheelBR.rotation.y = this.wheelBL.rotation.y = Tool_4.normalize(_props.speed, 22.2, 0) * _props.wAngleInner * -0.09;
                this.brakeBR.rotation.y = -this.wheelBL.rotation.y;
            }
            this.wheelFL.rotateZ(this.rotFL);
            this.wheelBL.rotateZ(this.rotBL);
            this.wheelFR.rotateZ(this.rotFR);
            this.wheelBR.rotateZ(this.rotBR);
        };
        ;
        CarWheels.prototype.update = function (props) {
            this.turnByRadiusRatio(props);
        };
        ;
        return CarWheels;
    }());
    exports.default = CarWheels;
});
define("shader/head_light_vert.glsl", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = "\nfloat normFloat(float n, float minVal, float maxVal){\n\treturn max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\n// Returns 1 if type matches val, 0 if not\nfloat checkType(float type, float val){\n\treturn step(val - 0.1, type) * step(type, val + 0.1);\n}\n // \u5149\u7684\u5F00\u5173 0, 0, 0\nuniform vec3 lightsT;\t// Lights Turn | x: anyTurn, y: left turn, z: right turn\n// \u5149\u7684\u5F3A\u5EA6,                                \u767D\u5929\u884C\u8F66\u706F\uFF0C \u5927\u706F\uFF0C     \u8FDC\u5149\u706F,   \u96FE\u5316\u706F\nuniform vec4 lightsS;\t// Lights Stat | x: daytime, y: loBeams, z: hiBeams, w: fogs\n// \u5728body.json\u4E2D\u5B9A\u4E49,\u706F\u7684\u9876\u70B9\u4F4D\u7F6E\u4FE1\u606F, 0: Daytime, 1: nightlights, 2: high, 3: right, 4: left\nattribute float type;\nvarying float wht;\nvarying float amb;\n\n// z-up position because Blender is weird like that\nvoid main() {\n\t// 0: Daytime running lights\n\twht = checkType(type, 0.0) * lightsS.x;\n\t\n\t// 1: nightlights \n\twht += checkType(type, 1.0) * lightsS.y;\n\t\n\t// // 2: high beams\n\twht += checkType(type, 2.0) * lightsS.z;\n\t\n\t// // 3: right turn signal\n\twht += checkType(type, 3.0) * (1.0 + lightsT.x) * lightsS.x;\n\t// amb = checkType(type, 3.0) * lightsT.z;\n\t\n\t// 4: left turn signal\n\twht += checkType(type, 4.0) * (1.0 - lightsT.x) * lightsS.x;\n\t// amb += checkType(type, 4.0) * lightsT.y;\n\n\t// 5: fog lamps\n\twht += checkType(type, 5.0) * lightsS.w;\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );\n}\n";
});
define("shader/head_light_frag.glsl", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = "\n#define RED vec3(1.0, 0.1, 0.1) // red\n#define AMB vec3(1.0, 0.6, 0.1)\t// amber\n#define WHT vec3(1.0, 1.0, 1.0)\t// white\n\nvarying float wht;\nvarying float amb;\nvoid main() {\n\tgl_FragColor = vec4((WHT*wht + AMB * amb), 1.0);\n\t// gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n}\n";
});
define("shader/tail_light_vert.glsl", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = "\n#define NIGHTLIGHT 0.4\n\nfloat normFloat(float n, float minVal, float maxVal){\n\treturn max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\n// Returns 1 if type matches val, 0 if not\nfloat checkType(float type, float val){\n\treturn step(val - 0.1, type) * step(type, val + 0.1);\n}\n\nuniform vec3 lightsT;\nuniform vec3 lightsO;\nattribute float type;\n\nvarying float redVal;\nvarying float ambVal;\nvarying float whtVal;\nvarying float brightness;\n\nvoid main(){\n\tbrightness = 1.0;\n\n\t// Type 0: Reverse light?\n\n\t// Type 1: Right blinker\n\tambVal = checkType(type, 1.0) * lightsT.z;\n\n\t// Type 2: Left blinker\n\tambVal += checkType(type, 2.0) * lightsT.y;\n\n\t// Type 3: Side brakelights & side nightlights\n\tredVal = checkType(type, 3.0) * (NIGHTLIGHT + lightsO.x * (1.0 - NIGHTLIGHT));\n\n\t// Type 4: Center brakelight\n\tredVal += checkType(type, 4.0) * lightsO.x;\n\n\t// Type 5: Center nightlight\n\tredVal += checkType(type, 5.0) * NIGHTLIGHT;\n\n\t// Type 6: Lower foglights off\n\tredVal += checkType(type, 6.0) * NIGHTLIGHT * 0.2;\n\n\t// Type 7: Lower foglights on\n\tredVal += checkType(type, 7.0) * NIGHTLIGHT * 1.5;\n\t\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );\n}\n";
});
define("shader/tail_grid_vert.glsl", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = "\n#define NIGHTLIGHT 0.4\n#define NIGHTLIGHT 0.4\n\nfloat normFloat(float n, float minVal, float maxVal){\n\treturn max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\n// Returns 1 if type matches val, 0 if not\nfloat checkType(float type, float val){\n\treturn step(val - 0.1, type) * step(type, val + 0.1);\n}\n\nuniform vec3 lightsT;\nuniform vec3 lightsO;\nattribute float type;\n\nvarying float redVal;\nvarying float ambVal;\nvarying float whtVal;\nvarying float brightness;\n\nvoid main(){\n\n \tvec4 realPos = modelMatrix * vec4(position, 1.0);\n\tvec3 realNorm = normalize(vec3(modelMatrix * vec4(normal, 0.0)));\n\n\tvec3 lightVector = normalize(cameraPosition - realPos.xyz);\n\tbrightness = dot(realNorm, lightVector);\n\tbrightness = normFloat(brightness, 0.3, 0.2) + 0.5;\n\tbrightness *= brightness * brightness;\n\t\n\t// Type 0: FF logo\t\n\tredVal = checkType(type, 0.0);\n\t// FF brightens on stop light\n\tredVal += redVal * lightsO.x;\n\n\t// Type 1: center grid\n\tredVal += checkType(type, 1.0) * NIGHTLIGHT;\n\n\t// Type 2: Right blinker\n\tredVal += (checkType(type, 2.0) * NIGHTLIGHT) * step(0.0, lightsT.x);\n\tambVal = checkType(type, 2.0) * lightsT.z;\n\n\t// Type 3: Left blinker\n\tredVal += (checkType(type, 3.0) * NIGHTLIGHT) * step(lightsT.x, 0.0);\n\tambVal += checkType(type, 3.0) * lightsT.y;\n\t\n\tbrightness = clamp(brightness, 0.0, 1.0);\n\n\tgl_Position = projectionMatrix * viewMatrix * realPos;\n}\n";
});
define("shader/tail_grid_frag.glsl", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = "\n#define RED_COLOR vec3(1.0, 0.1, 0.1) // red\n#define AMB_COLOR vec3(1.0, 0.6, 0.1)\t// amber\n#define WHT vec3(1.0, 1.0, 1.0)\t// white\n\nvarying float redVal;\nvarying float ambVal;\nvarying float whtVal;\nvarying float brightness;\n\nvoid main() {\n\tgl_FragColor = vec4((RED_COLOR * redVal + AMB_COLOR * ambVal) * brightness, 1.0);\n}\n";
});
define("shader/flare_vert.glsl", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = "\n#define PI 3.1415926\n#define PI 3.1415926\n\nuniform float vpH;\nuniform float size;\nuniform float brightness;\nvarying float opacity;\n\n// Normalizes a value between 0 - 1\nfloat normFloat(float n, float minVal, float maxVal){\n    return max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\nvoid main() {\n    vec4 realPos = modelMatrix * vec4(position, 1.0);\n    vec3 realNorm = normalize(vec3(modelMatrix * vec4(normal, 0.0)));\n\n    vec3 lightVector = normalize(cameraPosition - realPos.xyz);\n    opacity = dot(realNorm, lightVector);\n    opacity = normFloat(opacity, 0.5, 1.0) * brightness;\n\n    vec4 mvPosition = viewMatrix * realPos;\n    gl_Position = projectionMatrix * mvPosition;\n    gl_PointSize = max((vpH * size / -mvPosition.z) * opacity, 0.0);\n}\n";
});
define("shader/flare_frag.glsl", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = "\nuniform vec3 color;\nuniform sampler2D texture;\n\nvarying float opacity;\n\n// Normalizes a value between 0 - 1\nfloat normFloat(float n, float minVal, float maxVal){\n    return max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\nvoid main() {\n\t// Additive\n    gl_FragColor = texture2D( texture, gl_PointCoord);\n    gl_FragColor.a = normFloat(opacity, 0.01, 0.1);\n}\n";
});
define("shader/turn_bar_vert.glsl", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = "\nuniform vec3 lightsT;\nvarying float brightness;\nvarying vec2 vUV;\n\n// Normalizes a value between 0 - 1\nfloat normFloat(float n, float minVal, float maxVal){\n    return max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\nvoid main() {\n\tvUV = uv;\n    vec4 realPos = modelMatrix * vec4(position, 1.0);\n    vec3 realNorm = normalize(vec3(modelMatrix * vec4(normal, 0.0)));\n\n    vec3 lightVector = normalize(cameraPosition - realPos.xyz);\n    float diffuse = dot(realNorm, lightVector);\n    brightness = step(2000.0, position.y) * lightsT.z + step(position.y, 2000.0) * lightsT.y;\n    brightness *= normFloat(diffuse, 0.0, 0.5);\n\n    vec4 mvPosition = viewMatrix * realPos;\n    gl_Position = projectionMatrix * mvPosition;\n}\n";
});
define("shader/turn_bar_frag.glsl", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = "\nuniform sampler2D texture;\nvarying float brightness;\nvarying vec2 vUV;\n\n// Normalizes a value between 0 - 1\nfloat normFloat(float n, float minVal, float maxVal){\n    return max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\nvoid main() {\n\t// Additive\n    gl_FragColor = texture2D( texture, vUV) * brightness;\n\n\t// Subtractive\n\t// gl_FragColor = texture2D( texture, gl_PointCoord ) - vec4( color, 1.0 );\n\t// gl_FragColor *= opacity;\n\n\t// Multip\n\t/* gl_FragColor = -texture2D( texture, gl_PointCoord ) * opacity;\n\tgl_FragColor *= 1.0 - vec4( color, 1.0 );\n\tgl_FragColor += 1.0; */\n}\n";
});
define("carLights", ["require", "exports", "tslib", "shader/head_light_vert.glsl", "shader/head_light_frag.glsl", "shader/tail_light_vert.glsl", "shader/tail_grid_vert.glsl", "shader/tail_grid_frag.glsl", "shader/flare_vert.glsl", "shader/flare_frag.glsl", "shader/turn_bar_vert.glsl", "shader/turn_bar_vert.glsl", "shader/turn_bar_frag.glsl"], function (require, exports, tslib_3, head_light_vert_glsl_1, head_light_frag_glsl_1, tail_light_vert_glsl_1, tail_grid_vert_glsl_1, tail_grid_frag_glsl_1, flare_vert_glsl_1, flare_frag_glsl_1, turn_bar_vert_glsl_1, turn_bar_vert_glsl_2, turn_bar_frag_glsl_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    head_light_vert_glsl_1 = tslib_3.__importDefault(head_light_vert_glsl_1);
    head_light_frag_glsl_1 = tslib_3.__importDefault(head_light_frag_glsl_1);
    tail_light_vert_glsl_1 = tslib_3.__importDefault(tail_light_vert_glsl_1);
    tail_grid_vert_glsl_1 = tslib_3.__importDefault(tail_grid_vert_glsl_1);
    tail_grid_frag_glsl_1 = tslib_3.__importDefault(tail_grid_frag_glsl_1);
    flare_vert_glsl_1 = tslib_3.__importDefault(flare_vert_glsl_1);
    flare_frag_glsl_1 = tslib_3.__importDefault(flare_frag_glsl_1);
    turn_bar_vert_glsl_1 = tslib_3.__importDefault(turn_bar_vert_glsl_1);
    turn_bar_vert_glsl_2 = tslib_3.__importDefault(turn_bar_vert_glsl_2);
    turn_bar_frag_glsl_1 = tslib_3.__importDefault(turn_bar_frag_glsl_1);
    var THREE = window.THREE;
    var CarLights = /** @class */ (function () {
        function CarLights(_carChassis, _cargo) {
            this.lfTimer = 0;
            this.rtTimer = 0;
            this.carChassis = _carChassis;
            this.lightsCtrlTurn = new THREE.Vector3();
            this.lightsCtrlOther = new THREE.Vector3();
            this.lightsCtrlHead = new THREE.Vector4();
            this.prevHeadlightState = undefined;
            this.prevTurnState = undefined;
            this.addMeshMaterials();
            this.addHeadFlares(_cargo.getTexture('flareHead'));
            this.addStopMesh(_cargo.getTexture('lightStop'));
            this.addTurnFlares(_cargo.getTexture('flareTurn'), _cargo.getTexture('lightTurn'));
        }
        CarLights.prototype.addMeshMaterials = function () {
            var headLights = this.carChassis.getObjectByName('HeadLights');
            var tailLights = this.carChassis.getObjectByName('TailLights');
            var tailGrid = this.carChassis.getObjectByName('TailGrid');
            tailGrid.geometry.computeVertexNormals();
            headLights.material = new THREE.ShaderMaterial({
                uniforms: {
                    lightsT: { value: this.lightsCtrlTurn },
                    lightsS: { value: this.lightsCtrlHead }
                },
                vertexShader: head_light_vert_glsl_1.default,
                fragmentShader: head_light_frag_glsl_1.default
            });
            tailLights.material = new THREE.ShaderMaterial({
                uniforms: {
                    lightsT: { value: this.lightsCtrlTurn },
                    lightsO: { value: this.lightsCtrlOther }
                },
                vertexShader: tail_light_vert_glsl_1.default,
                fragmentShader: tail_grid_frag_glsl_1.default
            });
            tailGrid.material = new THREE.ShaderMaterial({
                uniforms: {
                    lightsT: { value: this.lightsCtrlTurn },
                    lightsO: { value: this.lightsCtrlOther }
                },
                vertexShader: tail_grid_vert_glsl_1.default,
                fragmentShader: tail_grid_frag_glsl_1.default
            });
        };
        CarLights.prototype.addHeadFlares = function (_tex) {
            this.headFlareMat = new THREE.ShaderMaterial({
                uniforms: {
                    texture: { value: _tex },
                    vpH: { value: window.innerHeight },
                    size: { value: 1.5 },
                    brightness: { value: 1 }
                },
                vertexShader: flare_vert_glsl_1.default,
                fragmentShader: flare_frag_glsl_1.default,
                blending: THREE.AdditiveBlending,
                transparent: true,
                depthTest: false
            });
            var posArray = new Float32Array([
                4000,
                1875,
                1700,
                4300,
                1800,
                1700,
                4000,
                1875,
                -1700,
                4300,
                1800,
                -1700
            ]);
            var normArray = new Float32Array([
                0.87,
                0.22,
                0.44,
                0.87,
                0.22,
                0.44,
                0.87,
                0.22,
                -0.44,
                0.87,
                0.22,
                -0.44
            ]);
            var flareHeadGeom = new THREE.BufferGeometry();
            flareHeadGeom.addAttribute('position', new THREE.BufferAttribute(posArray, 3));
            flareHeadGeom.addAttribute('normal', new THREE.BufferAttribute(normArray, 3));
            this.flareHeadPoints = new THREE.Points(flareHeadGeom, this.headFlareMat);
            this.flareHeadPoints.name = 'flareHeadPoints';
            this.carChassis.add(this.flareHeadPoints);
        };
        CarLights.prototype.addStopMesh = function (_tex) {
            this.meshStopGlow = this.carChassis.getObjectByName('Stop');
            this.meshStopGlow.material = new THREE.ShaderMaterial({
                uniforms: { texture: { value: _tex } },
                vertexShader: turn_bar_vert_glsl_2.default,
                fragmentShader: turn_bar_frag_glsl_1.default,
                blending: THREE.AdditiveBlending,
                transparent: true,
                depthTest: false
            });
            ;
        };
        CarLights.prototype.addTurnFlares = function (_tex1, _tex2) {
            var posArray = new Float32Array([
                -4755,
                2227,
                -1269,
                -4703,
                2222,
                -1326,
                -4649,
                2215,
                -1381,
                -4590,
                2208,
                -1436,
                -4526,
                2200,
                -1492,
                -4459,
                2192,
                -1548,
                -4386,
                2182,
                -1604,
                -4718,
                2182,
                -1264,
                -4668,
                2179,
                -1321,
                -4301,
                2175,
                -1658,
                -4614,
                2175,
                -1377,
                -4556,
                2168,
                -1433,
                -4494,
                2163,
                -1489,
                -4429,
                2158,
                -1545,
                -4358,
                2151,
                -1600,
                -4266,
                2147,
                -1653,
                -4675,
                2136,
                -1260,
                -4627,
                2134,
                -1316,
                -4575,
                2132,
                -1373,
                -4520,
                2130,
                -1428,
                -4461,
                2128,
                -1485,
                -4400,
                2126,
                -1540,
                -4329,
                2123,
                -1597
            ]);
            var normArray = new Float32Array([
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4
            ]);
            this.turnPointMaterial = this.headFlareMat.clone();
            this.turnPointMaterial.uniforms['texture'].value = _tex1;
            this.turnPointMaterial.uniforms['size'].value = 0.1;
            this.turnPointMaterial.uniforms['brightness'].value = 1;
            var leftTurnGrid = new THREE.BufferGeometry();
            leftTurnGrid.addAttribute('position', new THREE.BufferAttribute(posArray, 3));
            leftTurnGrid.addAttribute('normal', new THREE.BufferAttribute(normArray, 3));
            this.turnLeftPoints = new THREE.Points(leftTurnGrid, this.turnPointMaterial);
            this.turnLeftPoints.visible = false;
            this.carChassis.add(this.turnLeftPoints);
            posArray = new Float32Array([
                -4755,
                2227,
                1269,
                -4703,
                2222,
                1326,
                -4649,
                2215,
                1381,
                -4590,
                2208,
                1436,
                -4526,
                2200,
                1492,
                -4459,
                2192,
                1548,
                -4386,
                2182,
                1604,
                -4718,
                2182,
                1264,
                -4668,
                2179,
                1321,
                -4301,
                2175,
                1658,
                -4614,
                2175,
                1377,
                -4556,
                2168,
                1433,
                -4494,
                2163,
                1489,
                -4429,
                2158,
                1545,
                -4358,
                2151,
                1600,
                -4266,
                2147,
                1653,
                -4675,
                2136,
                1260,
                -4627,
                2134,
                1316,
                -4575,
                2132,
                1373,
                -4520,
                2130,
                1428,
                -4461,
                2128,
                1485,
                -4400,
                2126,
                1540,
                -4329,
                2123,
                1597
            ]);
            normArray = new Float32Array([
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4
            ]);
            var rightTurnGrid = new THREE.BufferGeometry();
            rightTurnGrid.addAttribute('position', new THREE.BufferAttribute(posArray, 3));
            rightTurnGrid.addAttribute('normal', new THREE.BufferAttribute(normArray, 3));
            this.turnRightPoints = new THREE.Points(rightTurnGrid, this.turnPointMaterial);
            this.turnRightPoints.visible = false;
            this.carChassis.add(this.turnRightPoints);
            this.carChassis.getObjectByName('Turn').material = new THREE.ShaderMaterial({
                uniforms: {
                    texture: { value: _tex2 },
                    lightsT: { value: this.lightsCtrlTurn }
                },
                vertexShader: turn_bar_vert_glsl_1.default,
                fragmentShader: turn_bar_frag_glsl_1.default,
                blending: THREE.AdditiveBlending,
                transparent: true,
                depthTest: false
            });
        };
        CarLights.prototype.turnSignalsBlink = function (_angle, _tDelta) {
            this.lightsCtrlTurn.x = Math.sign(_angle);
            if (_angle > 0) {
                this.lfTimer = (this.lfTimer + _tDelta * 2) % 2;
                this.rtTimer = 0;
                this.lightsCtrlTurn.y = this.lfTimer > 1 ? 0 : 1;
                this.lightsCtrlTurn.z = 0;
            }
            else if (_angle < 0) {
                this.lfTimer = 0;
                this.rtTimer = (this.rtTimer + _tDelta * 2) % 2;
                this.lightsCtrlTurn.y = 0;
                this.lightsCtrlTurn.z = this.rtTimer > 1 ? 0 : 1;
            }
            this.turnLeftPoints.visible = this.lightsCtrlTurn.y ? true : false;
            this.turnRightPoints.visible = this.lightsCtrlTurn.z ? true : false;
        };
        CarLights.prototype.turnSignalsClear = function () {
            this.lightsCtrlTurn.set(0, 0, 0);
            this.lfTimer = 0;
            this.rtTimer = 0;
            this.turnLeftPoints.visible = false;
            this.turnRightPoints.visible = false;
        };
        CarLights.prototype.headlightsChanged = function (_newState) {
            console.error(_newState);
            switch (_newState) {
                // 全部关闭 lightsCtrlHead: lightsS
                case 0:
                    this.lightsCtrlHead.set(0, 0, 0, 0);
                    this.flareHeadPoints.visible = false;
                    break;
                // 白天行车灯
                case 1:
                    this.lightsCtrlHead.set(1, 0, 0, 0);
                    this.flareHeadPoints.visible = false;
                    break;
                // 白天行车灯 + 大灯 
                case 2:
                    this.lightsCtrlHead.set(1, 1, 0, 0);
                    this.flareHeadPoints.visible = true;
                    break;
                // 白天行车灯 + 大灯 + 远光灯
                case 3:
                    this.lightsCtrlHead.set(1, 1, 1, 0);
                    this.flareHeadPoints.visible = true;
                    break;
                // 白天行车灯 + 大灯 + 远光灯 + 雾灯
                case 4:
                    this.lightsCtrlHead.set(1, 1, 1, 1);
                    this.flareHeadPoints.visible = true;
                    break;
            }
            this.prevHeadlightState = _newState;
        };
        CarLights.prototype.onWindowResize = function (_vpH) {
            this.headFlareMat.uniforms['vpH'].value = _vpH;
            this.turnPointMaterial.uniforms['vpH'].value = _vpH;
        };
        CarLights.prototype.update = function (_props) {
            if (_props.wAngleTarg !== 0) {
                this.turnSignalsBlink(_props.wAngleTarg, _props.time.delta);
            }
            else if (this.lightsCtrlTurn.x !== 0) {
                this.turnSignalsClear();
            }
            if (this.prevHeadlightState !== _props.headLights) {
                this.headlightsChanged(_props.headLights);
            }
            if (_props.braking && !this.meshStopGlow.visible) {
                this.meshStopGlow.visible = true;
                this.lightsCtrlOther.x = 1;
            }
            else if (!_props.braking && this.meshStopGlow.visible) {
                this.meshStopGlow.visible = false;
                this.lightsCtrlOther.x = 0;
            }
        };
        return CarLights;
    }());
    exports.default = CarLights;
});
define("shader/motor_vert.glsl", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = "\nprecision highp float;\n\nfloat normFloat(float n, float minVal, float maxVal){\n\treturn max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\nuniform vec3 cameraPosition;\nuniform mat4 modelMatrix;\nuniform mat4 viewMatrix;\nuniform mat4 projectionMatrix;\nuniform float progress;\n\nattribute vec3 position;\n\nvarying float prog;\nvarying vec3 viewPos;\nvarying vec3 camPos;\n\nvoid main() {\n\tvec4 realPos = modelMatrix * vec4(position, 1.0);\n\t\n\tviewPos = realPos.xyz;\n\tcamPos = cameraPosition;\n\tprog = ((progress * 0.5) - 0.25);\n\tprog = normFloat(position.x, prog + 0.01, prog);\n\n\tgl_Position = projectionMatrix * viewMatrix * realPos;\n}\n";
});
define("shader/motor_frag.glsl", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = "\n#extension GL_OES_standard_derivatives : enable\nprecision highp float;\n\nvarying float prog;\nvarying vec3 viewPos;\nvarying vec3 camPos;\n\nfloat normFloat(float n, float minVal, float maxVal){\n\treturn max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\nvoid main() {\n\tvec3 xTangent = dFdx( viewPos );\n\tvec3 yTangent = dFdy( viewPos );\n\tvec3 faceNormal = normalize( cross( xTangent, yTangent ) );\n\tvec3 lightVector = normalize(camPos - faceNormal);\n\n\tfloat alpha = dot(faceNormal, lightVector);\n\talpha = normFloat(alpha, 0.5, 1.0) * prog;\n\t// alpha = normFloat(alpha, 1.0, 0.5) * prog;\n\n\tgl_FragColor = vec4(0.627, 0.443, 0.341, alpha);\n}\n";
});
define("Motors", ["require", "exports", "tslib", "shader/motor_vert.glsl", "shader/motor_frag.glsl", "Tool", "Props"], function (require, exports, tslib_4, motor_vert_glsl_1, motor_frag_glsl_1, Tool_5, Props_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    motor_vert_glsl_1 = tslib_4.__importDefault(motor_vert_glsl_1);
    motor_frag_glsl_1 = tslib_4.__importDefault(motor_frag_glsl_1);
    var THREE = window.THREE;
    var Power2 = window.Power2;
    var TweenLite = window.TweenLite;
    var Motors = /** @class */ (function () {
        function Motors(_parent, _object) {
            this.showing = false;
            this.parent = _parent;
            this.motorFrontSm = _object.getObjectByName('MotorFront');
            this.geomFront = this.motorFrontSm.geometry;
            this.motorBackR = _object.getObjectByName('MotorBack');
            this.geomBack = this.motorBackR.geometry;
            this.buildMotors();
        }
        Motors.prototype.buildMotors = function () {
            Tool_5.scaleAndCenter(this.geomFront, { z: Props_3.FF91Props.WheelTrack / 6 }, 'xz');
            Tool_5.scaleAndCenter(this.geomBack, { z: Props_3.FF91Props.WheelTrack / 4 }, 'xz');
            var wPosY = Props_3.FF91Props.WheelDiam / 2;
            var wPosF = Props_3.FF91Props.WheelBase / 2;
            this.motorBackL = this.motorBackR.clone(true);
            this.motorBackL.scale.x = -1;
            this.motorBackL.rotateZ(Math.PI);
            this.motorBackL.position.set(-wPosF, wPosY, 0);
            this.motorBackR.position.set(-wPosF, wPosY, 0);
            this.motorFrontLg = this.motorBackR.clone(true);
            this.motorFrontLg.scale.y = -1;
            this.motorFrontLg.scale.x = -1;
            this.motorFrontLg.position.set(wPosF, wPosY, 0);
            this.motorFrontSm.position.set(wPosF, wPosY, -0.1);
            this.material = new THREE.RawShaderMaterial({
                uniforms: { progress: { value: 0 } },
                vertexShader: motor_vert_glsl_1.default,
                fragmentShader: motor_frag_glsl_1.default,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthTest: false
            });
            this.progUniform = this.material.uniforms['progress'];
            this.motorFrontSm.material = this.motorFrontLg.material = this.motorBackR.material = this.motorBackL.material = this.material;
            this.group = new THREE.Group();
            this.group.visible = false;
            this.group.add(this.motorBackR);
            this.group.add(this.motorBackL);
            this.group.add(this.motorFrontSm);
            this.group.add(this.motorFrontLg);
            this.group.scale.set(2000, 2000, 2000);
            this.group.position.setX(wPosF);
            this.parent.add(this.group);
        };
        Motors.prototype.show = function () {
            if (!this.showing) {
                this.showing = true;
                this.group.visible = true;
                TweenLite.killTweensOf(this);
                TweenLite.to(this.progUniform, 2, {
                    value: 1,
                    ease: Power2.easeOut
                });
            }
        };
        Motors.prototype.hide = function () {
            var _this = this;
            if (this.showing) {
                this.showing = false;
                TweenLite.killTweensOf(this);
                TweenLite.to(this.progUniform, 1, {
                    value: 0,
                    ease: Power2.easeInOut,
                    onComplete: function () {
                        _this.group.visible = false;
                    }
                });
            }
        };
        ;
        return Motors;
    }());
    exports.default = Motors;
});
define("CarBody", ["require", "exports", "tslib", "CarWheels", "carLights", "Motors", "Batts"], function (require, exports, tslib_5, CarWheels_1, carLights_1, Motors_1, Batts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    CarWheels_1 = tslib_5.__importDefault(CarWheels_1);
    carLights_1 = tslib_5.__importDefault(carLights_1);
    Motors_1 = tslib_5.__importDefault(Motors_1);
    Batts_1 = tslib_5.__importDefault(Batts_1);
    var THREE = window.THREE;
    var CarBody = /** @class */ (function () {
        function CarBody(_scene, _cargo) {
            this.parent = _scene;
            this.carWhole = new THREE.Group();
            this.carWhole.name = 'car';
            this.carWhole.position.x = -1.56;
            this.parent.add(this.carWhole);
            // 底座
            this.carChassis = this.buildCarChassis(_cargo.getMesh('body'), _cargo.getCubeTexture('envReflection'));
            this.carChassis.name = 'carChassis';
            this.carWhole.add(this.carChassis);
            this.addShadow(_cargo.getTexture('shadow'));
            this.carLights = new carLights_1.default(this.carChassis, _cargo);
            this.carWheels = new CarWheels_1.default(this.carWhole, _cargo);
            this.carMotors = new Motors_1.default(this.carChassis, _cargo.getMesh('xrays'));
            this.carBatts = new Batts_1.default(this.carWhole, _cargo.getMesh('xrays'));
        }
        CarBody.prototype.buildCarChassis = function (bodyGeom, _cubeText) {
            bodyGeom.scale.set(0.0005, 0.0005, 0.0005);
            bodyGeom.position.set(1.56, 0, 0);
            this.envCube = _cubeText;
            this.envCube.format = THREE.RGBFormat;
            this.matBodySilver = new THREE.MeshStandardMaterial({
                color: 12303291,
                metalness: 0.7,
                roughness: 0.7
            });
            // if (window['EXT_STLOD_SUPPORT'] === false) {
            //   this.envCube.minFilter = THREE.LinearFilter;
            //   this.matBodySilver.metalness = 0.05;
            //   this.matBodySilver.roughness = 0.8;
            //   this.matBodySilver.color = new THREE.Color(7829367);
            // }
            this.matBodyBlack = new THREE.MeshLambertMaterial({
                color: 2236962,
                reflectivity: 0.8,
                envMap: this.envCube
            });
            this.matGlassTinted = new THREE.MeshLambertMaterial({
                color: 6710886,
                reflectivity: 1,
                envMap: this.envCube
            });
            this.matUndercarriage = new THREE.MeshBasicMaterial({ color: 0 });
            this.matGlassTransp = new THREE.MeshLambertMaterial({
                color: 6710886,
                reflectivity: 1,
                envMap: this.envCube,
                transparent: true,
                blending: THREE.AdditiveBlending
            });
            bodyGeom.getObjectByName('BodyBlack').material = this.matBodyBlack;
            bodyGeom.getObjectByName('BodySilver').material = this.matBodySilver;
            bodyGeom.getObjectByName('GlassTransparent').material = this.matGlassTransp;
            bodyGeom.getObjectByName('GlassTinted').material = this.matGlassTinted;
            bodyGeom.getObjectByName('Undercarriage').material = this.matUndercarriage;
            return bodyGeom;
        };
        CarBody.prototype.addShadow = function (_shad) {
            var shadowPlane = new THREE.PlaneBufferGeometry(6.5, 6.5, 1, 1);
            shadowPlane.rotateX(-Math.PI / 2);
            shadowPlane.translate(1.56, 0, 0);
            var shadowMat = new THREE.MeshBasicMaterial({
                map: _shad,
                blending: THREE.MultiplyBlending,
                transparent: true
            });
            var shadowMesh = new THREE.Mesh(shadowPlane, shadowMat);
            this.carWhole.add(shadowMesh);
        };
        CarBody.prototype.onWindowResize = function (vpH) {
            this.carLights.onWindowResize(vpH);
        };
        CarBody.prototype.update = function (props) {
            // this.carWhole.rotation.y = props.theta;
            // if (props.longitMomentum !== 0) {
            //   this.carChassis.rotation.z = props.longitMomentum * 0.0015;
            // }
            // this.carChassis.rotation.x = props.lateralMomentum * 0.002;
            this.carWheels.update(props);
            this.carLights.update(props);
        };
        return CarBody;
    }());
    exports.default = CarBody;
});
define("shader/skybox_vert.glsl", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = "\nvarying vec3 vWorldPosition;\n\nvec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n\treturn normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n}\n\nvoid main() {\n\tvWorldPosition = transformDirection( position, modelMatrix );\n\tvec3 transformed = vec3( position );\n\tvec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );\n\tgl_Position = projectionMatrix * mvPosition;\n\tgl_Position.z = gl_Position.w; // set z to camera.far\n}\n";
});
define("shader/skybox_frag.glsl", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = "\n#define DARK_BLUE vec3(0.063, 0.075, 0.094)\n// 6\u4E2A\u9762\u7684\u8D34\u56FE\u7EB9\u7406\nuniform samplerCube tCube;\n// tFlip = -1\nuniform float tFlip;\nuniform vec3 color;\n\nvarying vec3 vWorldPosition;\n\nvoid main() {\n\t// float multiColor = DARK_BLUE * light;\n\tgl_FragColor = textureCube( tCube, vec3( tFlip * vWorldPosition.x, vWorldPosition.yz ) );\n\tgl_FragColor.rgb *= color;\n}\n";
});
define("Skybox", ["require", "exports", "tslib", "shader/skybox_vert.glsl", "shader/skybox_frag.glsl"], function (require, exports, tslib_6, skybox_vert_glsl_1, skybox_frag_glsl_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    skybox_vert_glsl_1 = tslib_6.__importDefault(skybox_vert_glsl_1);
    skybox_frag_glsl_1 = tslib_6.__importDefault(skybox_frag_glsl_1);
    var THREE = window.THREE;
    var TweenLite = window.TweenLite;
    var Skybox = /** @class */ (function () {
        function Skybox(_scene, _color) {
            var boxGeom = new THREE.BoxBufferGeometry(1, 1, 1);
            this.boxMat = new THREE.ShaderMaterial({
                uniforms: {
                    tCube: { value: null },
                    tFlip: { value: -1 },
                    color: { value: _color }
                },
                vertexShader: skybox_vert_glsl_1.default,
                fragmentShader: skybox_frag_glsl_1.default,
                side: THREE.BackSide,
                depthTest: true,
                depthWrite: false,
                fog: false
            });
            // this.boxMat = new THREE.MeshStandardMaterial({ color: 0xffffff })
            var boxMesh = new THREE.Mesh(boxGeom, this.boxMat);
            boxMesh.name = 'boxMesh';
            // boxGeom.removeAttribute('normal');
            // boxGeom.removeAttribute('uv');
            _scene.add(boxMesh);
            boxMesh.onBeforeRender = function (renderer, scene, camera) {
                this.matrixWorld.copyPosition(camera.matrixWorld);
            };
        }
        Skybox.prototype.updateLight = function (_newVal) {
            this.boxMat.uniforms.light.value = _newVal;
        };
        ;
        Skybox.prototype.setCubeTexture = function (_cubeTex) {
            // this.boxMat.envMap = _cubeTex
            this.boxMat.uniforms.tCube.value = _cubeTex;
        };
        return Skybox;
    }());
    exports.default = Skybox;
});
define("ViewTour", ["require", "exports", "tslib", "CarBody", "Skybox", "Props"], function (require, exports, tslib_7, CarBody_1, Skybox_1, Props_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    CarBody_1 = tslib_7.__importDefault(CarBody_1);
    Skybox_1 = tslib_7.__importDefault(Skybox_1);
    var THREE = window.THREE;
    var TweenLite = window.TweenLite;
    // var Card_1 = require('./30');
    // var CardProps = require('./2');
    // var Props_1 = require('./1');
    // var Body_1 = require('./26');
    // var Floor_1 = require('./33');
    // var Skybox_1 = require('./35');
    var ViewTour = /** @class */ (function () {
        function ViewTour(_scene, _renderer, _cam, _vp) {
            this.sceneWGL = _scene;
            this.rendererWGL = _renderer;
            this.sceneCSS = new THREE.Scene();
            this.rendererCSS = new THREE.CSS3DRenderer();
            this.rendererCSS.setSize(_vp.x, _vp.y);
            this.continer = document.getElementById('CSSCanvas');
            this.continer.appendChild(this.rendererCSS.domElement);
            var camOptions = {
                distance: 6,
                focusPos: {
                    x: 0,
                    y: 1,
                    z: 0
                },
                rotation: {
                    x: -90,
                    y: 0
                },
                distRange: {
                    max: 7,
                    min: 5
                },
                rotRange: {
                    xMax: Number.POSITIVE_INFINITY,
                    xMin: Number.NEGATIVE_INFINITY,
                    yMax: 90,
                    yMin: 0
                },
                smartUpdates: true
            };
            this.cam = _cam;
            this.cam.readOptions(camOptions);
            this.mobileView = _vp.x <= _vp.y * 1.2 ? true : false;
            this.sectionPrev = this.sectionActive = -1;
            // this.card = new Card_1.default(this.sceneCSS);
            this.carProps = new Props_4.CardProps();
            this.dirLight = new THREE.DirectionalLight(0, 0.7);
            this.dirLight.name = 'dirLight';
            this.dirLight.position.set(0, 1, 1);
            this.sceneWGL.add(this.dirLight);
            this.ambLight = new THREE.AmbientLight(0, 0.5);
            this.ambLight.name = 'ambLight';
            this.sceneWGL.add(this.ambLight);
            this.skybox = new Skybox_1.default(this.sceneWGL, this.dirLight.color);
        }
        ViewTour.prototype.moveCamera = function (_cardProps) {
            var _this = this;
            if (this.sectionActive === -1)
                return;
            var targetAX = this.cam.rotActual.x;
            var targetAY = Math.max(this.cam.rotActual.y, 0);
            var minY = 0;
            if (_cardProps.camRot !== undefined) {
                targetAY = _cardProps.camRot.y;
                minY = targetAY < 0 ? targetAY : 0;
                var angleXDist = THREE.Math.euclideanModulo(_cardProps.camRot.x - this.cam.rotActual.x + 180, 360) - 180;
                targetAX += angleXDist < -180 ? angleXDist + 360 : angleXDist;
            }
            if (targetAX !== this.cam.rotActual.x || targetAY !== this.cam.rotActual.y) {
                TweenLite.to(this.cam.rotTarget, 2, {
                    x: targetAX,
                    y: targetAY
                });
            }
            var range = _cardProps.camRotRange;
            if (range !== undefined) {
                this.cam.setRotRange(targetAX + range.x, targetAX - range.x, Math.min(targetAY + range.y, 90), Math.max(targetAY - range.y, minY));
            }
            else {
                this.cam.setRotRange(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 90, 0);
            }
            TweenLite.to(this.cam.focusTarget, 2, _cardProps.camPos);
            TweenLite.to(this.cam, 2, {
                distTarget: _cardProps.camDist,
                onComplete: function () {
                    _this.cam.setDistRange(_cardProps.camDist + 1, _cardProps.camDist - 1);
                }
            });
        };
        ;
        ViewTour.prototype.initMeshes = function (_cargo) {
            var xrayMesh = _cargo.getMesh('xrays');
            this.car = new CarBody_1.default(this.sceneWGL, _cargo);
            // this.floor = new Floor_1.default(this.sceneWGL, this.carProps.pos, _cargo);
            this.skybox.setCubeTexture(_cargo.getCubeTexture('envSkybox'));
            var freeProps = this.mobileView ? Props_4.CardProps.Mobile[7] : Props_4.CardProps.Desktop[7];
            TweenLite.to(this.dirLight.color, 3, {
                r: 1,
                g: 1,
                b: 1
            });
            TweenLite.to(this.ambLight.color, 3, {
                r: 1,
                g: 1,
                b: 1
            });
            TweenLite.to(this.cam.rotTarget, 3, {
                x: -125,
                y: 5
            });
            TweenLite.to(this.cam.focusTarget, 3, { y: freeProps.camPos.y }); // (0, 1, 0)
            TweenLite.to(this.cam, 3, { distTarget: freeProps.camDist }); // 8
            this.cam.setDistRange(freeProps.camDist + 1, freeProps.camDist - 1);
        };
        ViewTour.prototype.goToSection = function (index) {
            // var sectProps = this.mobileView ? CardProps.Mobile[index] : CardProps.Desktop[index];
            // this.sectionPrev = this.sectionActive;
            // this.sectionActive = index;
            // if (sectProps.inverted === true) {
            //   TweenLite.to(this.dirLight.color, 1, {
            //     r: 0.063,
            //     g: 0.075,
            //     b: 0.094
            //   });
            //   TweenLite.to(this.ambLight.color, 1, {
            //     r: 0.063,
            //     g: 0.075,
            //     b: 0.094
            //   });
            // } else {
            //   TweenLite.to(this.dirLight.color, 1, {
            //     r: 1,
            //     g: 1,
            //     b: 1
            //   });
            //   TweenLite.to(this.ambLight.color, 1, {
            //     r: 1,
            //     g: 1,
            //     b: 1
            //   });
            // }
            // if (this.sectionPrev === 1) {
            //   this.car.carBatts.hide();
            // } else if (this.sectionPrev === 2) {
            //   this.car.carMotors.hide();
            // }
            // switch (index) {
            // case 0:
            //   break;
            // case 1:
            //   this.car.carBatts.show();
            //   break;
            // case 2:
            //   this.car.carMotors.show();
            //   break;
            // case 3:
            // case 4:
            // case 5:
            //   TweenLite.to(this.carProps, 3, {
            //     speed: 0,
            //     ease: Power2.easeOut
            //   });
            //   break;
            // case 6:
            //   break;
            // case 7:
            //   this.card.hide();
            //   break;
            // }
            // this.card.show(index, sectProps);
            // this.moveCamera(sectProps);
        };
        ViewTour.prototype.enterFreeDriving = function (sectProps) {
            TweenLite.to(this.cam.focusTarget, 1, sectProps.camPos);
            this.cam.setRotRange(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 90, 0);
        };
        ViewTour.prototype.knobMoved = function (_knobPos) {
            this.cam.forceUpdate = true;
            this.carProps.onKnobMove(_knobPos, this.sectionActive);
        };
        ViewTour.prototype.frontLightsClicked = function (_index) {
            this.cam.forceUpdate = true;
            this.carProps.changeHeadlights(_index);
        };
        ViewTour.prototype.onWindowResize = function (_vp) {
            // this.rendererCSS.setSize(_vp.x, _vp.y);
            // if (this.sectionActive === -1)
            //   return;
            if (_vp.x <= _vp.y * 1.2 && this.mobileView !== true) {
                this.mobileView = true;
                this.moveCamera(Props_4.CardProps.Mobile[this.sectionActive]);
                this.card.setPosition(Props_4.CardProps.Mobile[this.sectionActive].position);
            }
            else if (_vp.x > _vp.y * 1.2 && this.mobileView !== false) {
                this.mobileView = false;
                this.moveCamera(Props_4.CardProps.Desktop[this.sectionActive]);
                this.card.setPosition(Props_4.CardProps.Desktop[this.sectionActive].position);
            }
        };
        ViewTour.prototype.update = function (t) {
            if (this.carProps.speed > 0 || this.carProps.wAngleInner !== 0 || this.carProps.longitMomentum !== 0) {
                this.cam.forceUpdate = true;
            }
            if (this.cam.update() === false) {
                return false;
            }
            this.carProps.update(t);
            this.car.update(this.carProps);
            // 直线光与镜头方向一致
            this.dirLight.position.copy(this.cam.camera.position);
            // this.dirLight.position.y += 1;
            this.rendererWGL.render(this.sceneWGL, this.cam.camera);
            // this.cam.camera.position.multiplyScalar(this.carProps.GOLDEN_RATIO);
            // this.rendererCSS.render(this.sceneCSS, this.cam.camera);
            return true;
        };
        return ViewTour;
    }());
    exports.default = ViewTour;
});
define("ff91", ["require", "exports", "tslib", "Camera", "ViewTour", "AssetLoader"], function (require, exports, tslib_8, Camera_1, ViewTour_1, AssetLoader_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Camera_1 = tslib_8.__importDefault(Camera_1);
    ViewTour_1 = tslib_8.__importDefault(ViewTour_1);
    AssetLoader_1 = tslib_8.__importDefault(AssetLoader_1);
    var THREE = window.THREE;
    var Hammer = window.Hammer;
    var Control = /** @class */ (function () {
        function Control() {
            var _this = this;
            this.mousePrev = new THREE.Vector2();
            this.disableRender = false;
            // 场景
            this.sceneWGL = new THREE.Scene();
            this.sceneWGL.name = 'sceneWGL';
            // 渲染
            this.vp = new THREE.Vector2(window.innerWidth, window.innerHeight);
            this.rendererWGL = new THREE.WebGLRenderer({ antialias: true });
            this.rendererWGL.setPixelRatio(window.devicePixelRatio);
            this.rendererWGL.setSize(this.vp.x, this.vp.y);
            this.rendererWGL.autoClear = false;
            this.rendererWGL.autoUpdate = false;
            this.rendererWGL.autoClearStencil = false;
            this.container = document.getElementById("GLCanvas");
            this.container.appendChild(this.rendererWGL.domElement);
            // 相机
            var camOptions = {
                distance: this.vp.y > 550 ? 8 : 6,
                rotRange: {
                    xMin: -30,
                    xMax: 30,
                    yMin: -30,
                    yMax: 30
                },
                distRange: {
                    max: 20,
                    min: 3
                }
            };
            this.cam = new Camera_1.default(camOptions);
            this.cam.rotTarget.x = THREE.Math.randFloatSpread(30);
            this.cam.rotTarget.y = THREE.Math.randFloatSpread(30);
            this.sceneWGL.add(this.cam.camera);
            // 资源加载
            var manifesto = [
                // Cube textures
                { name: "envReflection", type: "cubetexture", ext: "jpg" },
                { name: "envSkybox", type: "cubetexture", ext: "jpg" },
                // Car lights
                { name: "flareHead", type: "texture", ext: "jpg" },
                { name: "flareTurn", type: "texture", ext: "jpg" },
                { name: "lightTurn", type: "texture", ext: "jpg" },
                { name: "lightStop", type: "texture", ext: "jpg" },
                // Car geometry
                { name: "body", type: "mesh", ext: "json" },
                { name: "wheel", type: "mesh", ext: "json" },
                { name: "xrays", type: "mesh", ext: "json" },
                // Car textures
                { name: "thread", type: "texture", ext: "jpg" },
                { name: "shadow", type: "texture", ext: "jpg" },
                { name: "led", type: "texture", ext: "png" },
            ];
            this.assetLoader = new AssetLoader_1.default("./static/", manifesto, function () {
                // console.error('load over...')
                _this.viewTour = new ViewTour_1.default(_this.sceneWGL, _this.rendererWGL, _this.cam, _this.vp);
                _this.viewTour.initMeshes(_this.assetLoader.cargo);
                _this.disableRender = true;
                window.addEventListener('wheel', _this.firstZoomRef, false);
                window.addEventListener('wheel', _this.gestureWheel.bind(_this), false);
                _this.initHammer();
                _this.hammer.on('pinch', _this.firstZoomRef);
                // 相机调试
                // this.cameraDebug = new CameraDebug(this.cam.camera, this.sceneWGL, this.rendererWGL, this.vp.x, this.vp.y)
            });
            this.assetLoader.start();
            this.firstZoomRef = this.hammerFirstZoom.bind(this);
        }
        Control.prototype.update = function (t) {
            this.disableRender && (this.viewTour.update(t));
            // this.cameraDebug && this.cameraDebug.run()
        };
        Control.prototype.initHammer = function () {
            this.hammer = new Hammer(document.getElementById('CSSCanvas'));
            this.hammer.get('pan').set({
                direction: Hammer.DIRECTION_ALL,
                threshold: 1
            });
            this.hammer.get('pinch').set({ enable: true });
            this.hammer.on('pan', this.hammerPan.bind(this));
            // this.hammer.on('pan', this.hammerFirstPan.bind(this));
            this.hammer.on('panstart', this.hammerPanStart.bind(this));
            this.hammer.on('panend', this.hammerPanEnd.bind(this));
            this.hammer.on('pinch', this.hammerPinch.bind(this));
            this.hammer.on('pinchstart', this.hammerPinchStart.bind(this));
        };
        // 鼠标每次移动的坐标
        Control.prototype.hammerPan = function (event) {
            if (!this.disableHammer) {
                var angleX = (event.center.x - this.mousePrev.x) / this.vp.x * 80;
                var angleY = (event.center.y - this.mousePrev.y) / this.vp.y * 80;
                this.cam.orbitBy(angleX, angleY);
                // 记录这次的坐标位置
                this.mousePrev.set(event.center.x, event.center.y);
            }
            else {
                // this.cardControls.knobMoved(event.center.x - this.mousePrev.x, event.center.y - this.mousePrev.y);
            }
        };
        Control.prototype.hammerPanStart = function (event) {
            this.mousePrev.set(event.center.x, event.center.y);
        };
        Control.prototype.hammerPanEnd = function (event) {
            this.disableHammer = false;
            // this.cardControls.knobReleased();
        };
        Control.prototype.hammerPinchStart = function (event) {
            this.zoom = this.cam.getDistance();
            console.error(event);
        };
        Control.prototype.hammerPinch = function (event) {
            this.cam.setDistance(this.zoom / event.scale);
            console.error(event, 'hammerPinch');
        };
        Control.prototype.hammerFirstZoom = function (event) {
            // console.error(event, 'hammerFirstZoom')
            // this.gA.uiEvent('vehicle-zoom', '3DTour');
            this.hammer.off('pinch', this.firstZoomRef);
            window.removeEventListener('wheel', this.firstZoomRef, false);
        };
        Control.prototype.hammerFirstPan = function (event) {
            // this.gA.uiEvent('vehicle-move', '3DTour');
            // this.hammer.off('pan', this.hammerFirstPan.bind(this));
        };
        Control.prototype.gestureWheel = function (event) {
            console.error('gestureWheel');
            switch (event.deltaMode) {
                case WheelEvent.DOM_DELTA_PIXEL:
                    this.cam.dolly(event.deltaY * 0.002);
                    break;
                case WheelEvent.DOM_DELTA_LINE:
                    this.cam.dolly(event.deltaY * 0.2);
                    break;
                case WheelEvent.DOM_DELTA_PAGE:
                    this.cam.dolly(event.deltaY * 0.4);
                    break;
            }
        };
        return Control;
    }());
    exports.Control = Control;
});
//# sourceMappingURL=ff91.js.map
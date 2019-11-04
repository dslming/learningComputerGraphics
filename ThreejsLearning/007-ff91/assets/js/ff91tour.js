/******/ (function (modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
    window.lm = {}
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if (installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
            /******/
}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
            /******/
};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
        /******/
}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function (value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function (exports, name, getter) {
/******/ 		if (!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
        /******/
});
            /******/
}
        /******/
};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function (module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
        /******/
};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 36);
    /******/
})
/************************************************************************/
/******/([
/* 0 */
/***/ (function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            // Converts a value to 0 - 1 from its min - max bounds
            function normalize(val, min, max) {
                return Math.max(0, Math.min(1, (val - min) / (max - min)));
            }
            exports.normalize = normalize;
            // Converts a value to 0 - 1 from its min - max bounds in quadratic in form
            function normalizeQuadIn(val, min, max) {
                return Math.pow(normalize(val, min, max), 2.0);
            }
            exports.normalizeQuadIn = normalizeQuadIn;
            // Converts a value to 0 - 1 from its min - max bounds in quadratic out form
            function normalizeQuadOut(val, min, max) {
                var x = normalize(val, min, max);
                return x * (2.0 - x);
            }
            exports.normalizeQuadOut = normalizeQuadOut;
            // Tween to target using Zeno's Paradox
            // If distance between _val & _target is very small, return _target
            function zTween(_val, _target, _ratio) {
                return Math.abs(_target - _val) < 1e-5 ? _target : _val + (_target - _val) * Math.min(_ratio, 1.0);
            }
            exports.zTween = zTween;
            // Keeps track of time in seconds
            // and caps rendering to match desired FPS
            var Time = /** @class */ (function () {
                function Time(timeFactor) {
                    this.fallBackRates = [60, 40, 30, 20, 15];
                    this.prev = 0;
                    this.prevBreak = 0;
                    this.delta = 0;
                    this.timeFact = (typeof timeFactor === "undefined") ? 1 : timeFactor;
                    this.frameCount = 0;
                    this.fallBackIndex = 0;
                    this.setFPS(60);
                }
                Time.prototype.update = function (_newTime) {
                    this.deltaBreak = Math.min(_newTime - this.prevBreak, 1.0);
                    // Update time if enough time has passed
                    if (this.deltaBreak > this.spf) {
                        this.delta = Math.min(_newTime - this.prev, 1.0);
                        this.prev = _newTime;
                        this.prevBreak = _newTime - (this.deltaBreak % this.spf);
                        // this.checkFPS();
                        // Returns true to render frame
                        return true;
                    }
                    else {
                        // Returns false to skip frame
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
            // Fisher-Yates Shuffle
            function shuffle(array) {
                var m = array.length, t, i;
                // While there remain elements to shuffle
                while (m) {
                    // Pick a remaining element
                    i = Math.floor(Math.random() * m--);
                    // And swap it with the current element.
                    t = array[m];
                    array[m] = array[i];
                    array[i] = t;
                }
                return array;
            }
            exports.shuffle = shuffle;
            function mod(n, m) {
                return ((n % m) + m) % m;
            }
            exports.mod = mod;
            // Scales and centers _geometry
            // _bounds defines the bounding box to fit
            // _center defines whether to center on x, y, or z
            function scaleAndCenter(_geometry, _bounds, _center) {
                if (_center === void 0) { _center = "xyz"; }
                if (_bounds.x === undefined)
                    _bounds.x = Infinity;
                if (_bounds.y === undefined)
                    _bounds.y = Infinity;
                if (_bounds.z === undefined)
                    _bounds.z = Infinity;
                if (_bounds.x === _bounds.y && _bounds.y === _bounds.z && _bounds.z === Infinity) {
                    return null;
                }
                // Get bounds
                _geometry.computeBoundingBox();
                var geomMin = _geometry.boundingBox.min;
                var geomMax = _geometry.boundingBox.max;
                var width = geomMax.x - geomMin.x;
                var height = geomMax.z - geomMin.z; // Switch Y-Z because 
                var depth = geomMax.y - geomMin.y; // Blender is z-up, Three is y-up
                // Translate origin to center
                var avgX = _center.indexOf("x") > -1 ? (geomMax.x + geomMin.x) / 2 : 0;
                var avgY = _center.indexOf("y") > -1 ? (geomMax.y + geomMin.y) / 2 : 0;
                var avgZ = _center.indexOf("z") > -1 ? (geomMax.z + geomMin.z) / 2 : 0;
                _geometry.translate(-avgX, -avgY, -avgZ);
                // Scale to fit within smallest side length
                var xDiff = _bounds.x / width;
                var yDiff = _bounds.y / height;
                var zDiff = _bounds.z / depth;
                var geoScale = Math.min(xDiff, yDiff, zDiff);
                _geometry.scale(geoScale, geoScale, geoScale);
            }
            exports.scaleAndCenter = scaleAndCenter;


            /***/
}),
/* 1 */
/***/ (function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var utils_1 = __webpack_require__(0);
            // FF 91 Constants
            var FF91 = /** @class */ (function () {
                function FF91() {
                }
                FF91.Accel = 5; // m/s^2
                FF91.Decel = -10; // m/s^2
                FF91.MaxVel = (70 * 1610) / 3600; // 70m/h ~= 31.3m/s
                FF91.MaxTurn = Math.PI * 0.20; // Max angle of wheel turn
                // Dimensions
                FF91.Length = 5.250; // From nose to tail
                FF91.Width = 2.283; // From L to R mirror
                FF91.WheelTrack = 1.72; // L to R wheels
                FF91.WheelBase = 3.200; // F to B wheels
                FF91.WheelDiam = 0.780; // Wheel diameter
                FF91.WheelCirc = FF91.WheelDiam * Math.PI; // Wheel circumference
                return FF91;
            }());
            exports.FF91 = FF91;
            var CarProps = /** @class */ (function () {
                function CarProps() {
                    this.time = new utils_1.Time();
                    this.velocity = new THREE.Vector2();
                    this.speed = 1;
                    this.accel = 0;
                    this.pos = new THREE.Vector2();
                    // Momentim
                    this.longitMomentum = 0;
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
                CarProps.prototype.onKeyDown = function (evt) {
                    // Add key to list if they don't exist yet
                    if (this.keys.indexOf(evt.keyCode) === -1) {
                        this.keys.push(evt.keyCode);
                    }
                };
                CarProps.prototype.onKeyUp = function (evt) {
                    //Otherwise, remove from keys list
                    this.keys.splice(this.keys.indexOf(evt.keyCode), 1);
                };
                CarProps.prototype.readKeyboardInput = function () {
                    for (var i = 0; i < this.keys.length; i++) {
                        switch (this.keys[i]) {
                            case 38: // Up
                                this.accel += FF91.Accel;
                                // Simulate wind resistance as we reach top speed
                                this.accel *= utils_1.normalizeQuadIn(this.speed, FF91.MaxVel, FF91.MaxVel - 10);
                                break;
                            case 40: // Down
                                this.accel += FF91.Decel;
                                break;
                            case 37: // Left
                                this.wAngleTarg += FF91.MaxTurn;
                                break;
                            case 39: // Right
                                this.wAngleTarg -= FF91.MaxTurn;
                                break;
                        }
                    }
                };
                /////////////////////////////// JOYSTICK EVENTS ///////////////////////////////
                // When joystick is moved on screen
                CarProps.prototype.onJoystickMove = function (_vec) {
                    this.joyVec.x = _vec.x / -40;
                    this.joyVec.y = _vec.y / -40;
                    if (Math.abs(this.joyVec.x) > 0.85) {
                        this.joyVec.y = 0;
                    }
                    if (Math.abs(this.joyVec.y) > 0.95) {
                        this.joyVec.x = 0;
                    }
                };
                // When knob is moved in a card
                CarProps.prototype.onKnobMove = function (_vec, _section) {
                    this.joyVec.x = _vec.x / -150;
                    this.joyVec.y = _vec.y / -150;
                    if (_section === 5 && Math.abs(this.joyVec.x) < 0.1) {
                        this.joyVec.x = 0;
                    }
                };
                CarProps.prototype.readJoyStickInput = function () {
                    this.wAngleTarg = this.joyVec.x * FF91.MaxTurn;
                    //Accelerating
                    if (this.joyVec.y >= 0) {
                        this.accel = this.joyVec.y * FF91.Accel;
                        // Simulate wind resistance as we reach top speed
                        this.accel *= utils_1.normalizeQuadIn(this.speed, FF91.MaxVel, FF91.MaxVel - 10);
                    }
                    // Braking
                    else {
                        this.accel = this.joyVec.y * -FF91.Decel;
                    }
                };
                /////////////////////////////// LIGHTS ///////////////////////////////
                CarProps.prototype.changeHeadlights = function (_new) {
                    console.error(_new, 'changeHeadlights')
                    this.headLights = THREE.Math.clamp(Math.round(_new), 0, 4);
                };
                /////////////////////////////// UPDATE ///////////////////////////////
                CarProps.prototype.update = function (_time) {
                    // Update time, skips according to FPS
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
                    ///////////////// PHYSICS, YO! /////////////////
                    this.accel *= this.time.delta;
                    this.speed += this.accel;
                    this.braking = (this.accel < 0);
                    if (this.speed < 0) {
                        this.speed = 0;
                        this.accel = 0;
                    }
                    this.frameDist = this.speed * this.time.delta;
                    // Limit turn angle as speed increases
                    this.wAngleTarg *= utils_1.normalizeQuadIn(this.speed, FF91.MaxVel + 10.0, 3.0);
                    this.wAngleInner = utils_1.zTween(this.wAngleInner, this.wAngleTarg, this.time.delta * 2);
                    this.wAngleSign = this.wAngleInner > 0.001 ? 1 : this.wAngleInner < -0.001 ? -1 : 0;
                    // Theta is based on speed, wheelbase & wheel angle
                    this.omega = this.wAngleInner * this.speed / FF91.WheelBase;
                    this.theta += this.omega * this.time.delta;
                    // Calc this frame's XY velocity
                    this.velocity.set(Math.cos(this.theta) * this.frameDist, -Math.sin(this.theta) * this.frameDist);
                    // Add velocity to total position
                    this.pos.add(this.velocity);
                    // Fake some momentum
                    this.longitMomentum = utils_1.zTween(this.longitMomentum, this.accel / this.time.delta, this.time.delta * 6);
                    this.lateralMomentum = this.omega * this.speed;
                    if (this.wAngleSign) {
                        // Calculate 4 wheel turning radius if angle
                        this.radFrontIn = FF91.WheelBase / Math.sin(this.wAngleInner);
                        this.radBackIn = FF91.WheelBase / Math.tan(this.wAngleInner);
                        this.radBackOut = this.radBackIn + (FF91.WheelTrack * this.wAngleSign);
                        this.wAngleOuter = Math.atan(FF91.WheelBase / this.radBackOut);
                        this.radFrontOut = FF91.WheelBase / Math.sin(this.wAngleOuter);
                    }
                    else {
                        // Otherwise, just assign a very large radius.
                        this.radFrontOut = 100;
                        this.radBackOut = 100;
                        this.radBackIn = 100;
                        this.radFrontIn = 100;
                        this.wAngleOuter = 0;
                    }
                    return true;
                };
                return CarProps;
            }());
            exports.CarProps = CarProps;


            /***/
}),
/* 2 */
/***/ (function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var Desktop = [{
                name: "dimensions",
                size: { w: 930, h: 480 },
                position: { x: 2, y: -1, z: 1 },
                orientation: { x: -45, y: 35, z: 30 },
                camDist: 6,
                camPos: { x: 2, y: 0, z: 1 },
                camRot: { x: -45, y: 20 },
                camRotRange: { x: 10, y: 10 },
            }, {
                name: "battery",
                size: { w: 1000, h: 550 },
                position: { x: 0, y: 0, z: 2.3 },
                orientation: { x: -90, y: 0, z: 0 },
                camDist: 5.7,
                camPos: { x: 0, y: 0.5, z: 1 },
                camRot: { x: 0, y: 80 },
                camRotRange: { x: 40, y: 50 },
            }, {
                name: "powertrain",
                size: { w: 800, h: 540 },
                position: { x: 2, y: 1.0, z: 2.8 },
                orientation: { x: 0, y: -90, z: 0 },
                camDist: 5,
                camPos: { x: -1, y: 1, z: 1.5 },
                camRot: { x: 80, y: 0 },
                camRotRange: { x: 10, y: 30 },
            }, {
                name: "steering",
                size: { w: 900, h: 570 },
                position: { x: 2, y: 1.0, z: -2.75 },
                orientation: { x: 0, y: -90, z: 0 },
                camDist: 5,
                camPos: { x: -1, y: 1, z: -1.5 },
                camRot: { x: 100, y: 0 },
                camRotRange: { x: 10, y: 10 },
            }, {
                name: "front-lighting",
                size: { w: 930, h: 520 },
                position: { x: 0, y: 2.8, z: 0 },
                orientation: { x: 0, y: 90, z: 0 },
                camDist: 5,
                camPos: { x: 1, y: 1.2, z: 0 },
                camRot: { x: -90, y: -5 },
                camRotRange: { x: 30, y: 0 },
                inverted: true,
            }, {
                name: "rear-lighting",
                size: { w: 900, h: 400 },
                position: { x: 0, y: 2.8, z: 0 },
                orientation: { x: 0, y: -90, z: 0 },
                camDist: 4,
                camPos: { x: -1, y: 1.5, z: 0 },
                camRot: { x: 90, y: -5 },
                camRotRange: { x: 30, y: 10 },
                inverted: true,
            }, {
                name: "aerodynamics",
                size: { w: 930, h: 490 },
                position: { x: 0, y: 3, z: -2 },
                orientation: { x: 0, y: 0, z: 0 },
                camDist: 5,
                camPos: { x: 0, y: 1.5, z: 0 },
                camRot: { x: 0, y: 0 },
                camRotRange: { x: 10, y: 10 },
            }, {
                name: "free-viewing",
                size: { w: 465, h: 320 },
                position: { x: 0, y: 0.0, z: 0 },
                orientation: { x: 0, y: 0, z: 0 },
                camDist: 6,
                camPos: { x: 0, y: 1.0, z: 0 },
            }];
            exports.Desktop = Desktop;
            // Mobile props are the same as desktop, with a few exceptions
            var Mobile = JSON.parse(JSON.stringify(Desktop));
            exports.Mobile = Mobile;
            // Dimensions
            Mobile[1].camDist = 6.5;
            // Powertrain
            Mobile[2].position = { x: 0, y: 2.8, z: 0.9 };
            Mobile[2].camPos = { x: -1, y: 1.5, z: 1 };
            // Steering
            Mobile[3].position = { x: 2, y: 2.8, z: -1.5 };
            Mobile[3].camRot = { x: 95, y: 0 };
            Mobile[3].camPos = { x: -1, y: 1.5, z: -1.5 };
            // Rear Lighting
            Mobile[5].position = { x: 0, y: 3, z: 0 };
            Mobile[5].camDist = 5;
            // Aerodynamics
            Mobile[6].position = { x: 0, y: 3, z: 3 };
            Mobile[6].camPos = { x: 0, y: 2, z: 0 };
            Mobile[6].camDist = 9;
            Mobile[7].camDist = 8;
            var GOLDEN_RATIO = 285;
            exports.GOLDEN_RATIO = GOLDEN_RATIO;


            /***/
}),
/* 3 */
/***/ (function (module, exports) {

            // removed by extract-text-webpack-plugin

            /***/
}),
/* 4 */
/***/ (function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var viewTour_1 = __webpack_require__(38);
            var viewPreload_1 = __webpack_require__(37);
            var nav_1 = __webpack_require__(32);
            var CardControls_1 = __webpack_require__(31);
            var assetLoader_1 = __webpack_require__(40);
            var Monoc_1 = __webpack_require__(42);
            var analytics_1 = __webpack_require__(39);
            var CardProps = __webpack_require__(2);
            /*
            This class is in charge of all event listeners,
            preloads assets
            manages views
            */
            var Controls = /** @class */ (function () {
                function Controls() {
                    // Device features
                    this.devMode = true;
                    this.zoom = 1;
                    this.disableHammer = false;
                    this.disableRender = false;
                    this.gAActive = -1; // Tracks active section,跟踪活动部分
                    this.gAKnob = false; // Tracks first knob move,第一节轨道移动
                    // Scene setup
                    this.gA = new analytics_1.default("UA-63053901-2");
                    this.vp = new THREE.Vector2(window.innerWidth, window.innerHeight);
                    this.sceneWGL = new THREE.Scene();
                    this.sceneWGL.name = 'sceneWGL'
                    window.scene = this.sceneWGL
                    this.sceneWGL.background = new THREE.Color(0x000000);
                    this.rendererWGL = new THREE.WebGLRenderer({ antialias: true });
                    this.rendererWGL.setSize(this.vp.x, this.vp.y);
                    if (this.devMode) {
                        this.stats = new Stats();
                        this.stats.showPanel(1);
                        document.body.appendChild(this.stats.dom);
                    }
                    document.getElementById("GLCanvas").appendChild(this.rendererWGL.domElement);
                    this.backBtn = document.getElementById("backBtn");
                    this.backBtn.addEventListener("click", this.backToFF.bind(this), false);
                    // Camera setup
                    this.camOptions = {
                        distance: this.vp.y > 550 ? 8 : 6,
                        rotRange: { xMin: -30, xMax: 30, yMin: -30, yMax: 30 },
                        distRange: { max: 20, min: 3 }
                    };
                    this.cam = new Monoc_1.default(this.camOptions);
                    this.cam.rotTarget.x = THREE.Math.randFloatSpread(30);
                    this.cam.rotTarget.y = THREE.Math.randFloatSpread(30);
                    this.viewPreload = new viewPreload_1.default(this.sceneWGL, this.rendererWGL, this.cam, this.vp);
                    // this.viewActive = this.viewPreload;
                    this.mousePrev = new THREE.Vector2();
                    this.cardControls = new CardControls_1.default(this);
                    this.mouseMoveRef = this.onMouseMove.bind(this);
                    this.firstZoomRef = this.hammerFirstZoom.bind(this);
                    window.addEventListener("resize", this.onWindowResize.bind(this), false);
                    window.addEventListener("wheel", this.gestureWheel.bind(this), false);
                    window.addEventListener("mousemove", this.mouseMoveRef, false);
                    this.initPreloader();
                    this.initHammer();
                }
                /////////////////////////////////////// INITIATORS ////////////////////////////////////////
                // Initialize touch listeners
                Controls.prototype.initHammer = function () {
                    this.hammer = new Hammer(document.getElementById("CSSCanvas"));
                    this.hammer.get("pan").set({ direction: Hammer.DIRECTION_ALL, threshold: 1 });
                    this.hammer.get("pinch").set({ enable: true });
                    this.hammer.on("pan", this.hammerPan.bind(this));
                    this.hammer.on("pan", this.hammerFirstPan.bind(this));
                    this.hammer.on("panstart", this.hammerPanStart.bind(this));
                    this.hammer.on("panend", this.hammerPanEnd.bind(this));
                    this.hammer.on("pinch", this.hammerPinch.bind(this));
                    this.hammer.on("pinchstart", this.hammerPinchStart.bind(this));
                };
                // 01. Preload assets
                Controls.prototype.initPreloader = function () {
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
                    var path = "./assets/";
                    this.assetLoader = new assetLoader_1.AssetLoader(path, manifesto, this.preloadComplete.bind(this));
                    this.assetLoader.start();
                };
                // 02: Preloading has completed
                Controls.prototype.preloadComplete = function (_cargo) {
                    this.gA.uiEvent("click-begin", "3DTour");
                    window.removeEventListener("mousemove", this.mouseMoveRef, false);
                    this.viewPreload.exitAnimation(this.initTourView.bind(this));
                };
                // 03: Initialize tour view
                Controls.prototype.initTourView = function () {
                    this.gA.pageView(CardProps.Desktop[7].name);
                    this.backBtn.classList.remove("inverted");
                    this.nav = new nav_1.default(this);
                    this.viewTour = new viewTour_1.default(this.sceneWGL, this.rendererWGL, this.cam, this.vp);
                    this.viewActive = this.viewTour;
                    this.viewActive.initMeshes(this.assetLoader.cargo);
                    this.viewPreload = null;
                    // Tracks first zoom interaction
                    window.addEventListener("wheel", this.firstZoomRef, false);
                    this.hammer.on("pinch", this.firstZoomRef);
                };
                /////////////////////////////////////// TOUCH LISTENERS ////////////////////////////////////////
                Controls.prototype.hammerPan = function (event) {
                    if (!this.disableHammer) {
                        // Orbit camera
                        this.cam.orbitBy((event.center.x - this.mousePrev.x) / this.vp.x * 90, (event.center.y - this.mousePrev.y) / this.vp.y * 90);
                        this.mousePrev.set(event.center.x, event.center.y);
                    }
                    else {
                        // Move knob
                        this.cardControls.knobMoved(event.center.x - this.mousePrev.x, event.center.y - this.mousePrev.y);
                    }
                };
                Controls.prototype.hammerPanEnd = function (event) {
                    this.disableHammer = false;
                    this.cardControls.knobReleased();
                };
                Controls.prototype.hammerPinchStart = function (event) {
                    this.zoom = this.cam.getDistance();
                };
                Controls.prototype.hammerPinch = function (event) {
                    // this.cam.distTarget = ;
                    this.cam.setDistance(this.zoom / event.scale);
                };
                Controls.prototype.hammerPanStart = function (event) {
                    this.mousePrev.set(event.center.x, event.center.y);
                };
                // Analytics team wants to record first zoom interaction
                Controls.prototype.hammerFirstZoom = function (event) {
                    this.gA.uiEvent("vehicle-zoom", "3DTour");
                    this.hammer.off("pinch", this.firstZoomRef);
                    window.removeEventListener("wheel", this.firstZoomRef, false);
                };
                // Analytics team wants to record first pan interaction
                Controls.prototype.hammerFirstPan = function (event) {
                    this.gA.uiEvent("vehicle-move", "3DTour");
                    this.hammer.off("pan", this.hammerFirstPan.bind(this));
                };
                /////////////////////////////////////// NAV ////////////////////////////////////////
                // Clicked on nav item
                Controls.prototype.navClicked = function (_index) {
                    // Send section name pageview to analytics
                    this.gAActive = _index;
                    this.gA.pageView(CardProps.Desktop[this.gAActive].name);
                    this.viewTour.goToSection(_index);
                    if (_index === 4 || _index === 5) {
                        this.backBtn.classList.add("inverted");
                    }
                    else {
                        this.backBtn.classList.remove("inverted");
                    }
                    // Reset knob event
                    this.gAKnob = false;
                };
                Controls.prototype.backToFF = function () {
                    this.outboundGA("back to ff");
                    if (window["language"] === "us") {
                        window.location.href = "https://www.ff.com/";
                    }
                    else {
                        window.location.href = "https://www.ff.com/cn/";
                    }
                };
                Controls.prototype.outboundGA = function (label) {
                    this.gA.uiEvent(label);
                };
                Controls.prototype.mobileNavOpened = function () {
                    this.disableRender = true;
                };
                Controls.prototype.mobileNavClosed = function () {
                    this.disableRender = false;
                };
                /////////////////////////////////////// CARD EVENTS ////////////////////////////////////////
                Controls.prototype.knobMouseDown = function () {
                    this.disableHammer = true;
                };
                Controls.prototype.knobMouseMoved = function (_knobPos) {
                    this.viewTour.knobMoved(_knobPos);
                    // Trigger knob event only once
                    if (this.gAKnob === false) {
                        var eventName = "";
                        switch (this.gAActive) {
                            case 2:
                                eventName = "powertrain-interaction";
                                break;
                            case 3:
                                eventName = "steering-interaction";
                                break;
                            case 5:
                                eventName = "rear-light-interaction";
                                break;
                        }
                        this.gA.uiEvent(eventName, "3DTour");
                        this.gAKnob = true;
                    }
                };
                Controls.prototype.knobMouseUp = function () {
                    this.disableHammer = false;
                };
                Controls.prototype.frontLightsChanged = function (_index) {
                    this.viewTour.frontLightsClicked(_index);
                    var eventName = "";
                    switch (_index) {
                        case 0:
                            eventName = "frontlights-off";
                            break;
                        case 1:
                            eventName = "frontlights-daytime";
                            break;
                        case 2:
                            eventName = "frontlights-lowbeams";
                            break;
                        case 3:
                            eventName = "frontlights-hibeams";
                            break;
                        case 4:
                            eventName = "frontlights-foglamps";
                            break;
                    }
                    this.gA.uiEvent(eventName, "3DTour");
                };
                // Click on CloseX button
                Controls.prototype.exitSection = function () {
                    // Tell nav to enter free driving
                    this.nav.navClick(7, null);
                };
                /////////////////////////////////////// WINDOW LISTENERS ////////////////////////////////////////
                // User scrolls down
                Controls.prototype.gestureWheel = function (event) {
                    // Dolly cam
                    switch (event.deltaMode) {
                        case WheelEvent.DOM_DELTA_PIXEL:
                            this.cam.dolly(event.deltaY * 0.002);
                            break;
                        case WheelEvent.DOM_DELTA_LINE:
                            this.cam.dolly(event.deltaY * .2);
                            break;
                        case WheelEvent.DOM_DELTA_PAGE:
                            this.cam.dolly(event.deltaY * .4);
                            break;
                    }
                };
                // When mouse is moved
                Controls.prototype.onMouseMove = function (_ev) {
                    this.viewPreload.onMouseMove(_ev);
                };
                // Browser window resize
                Controls.prototype.onWindowResize = function () {
                    if (this.disableRender) {
                        this.nav.mobileNavHide();
                        this.disableRender = false;
                    }
                    this.vp.x = window.innerWidth;
                    this.vp.y = window.innerHeight;
                    this.rendererWGL.setSize(this.vp.x, this.vp.y);
                    this.cam.onWindowResize(this.vp.x, this.vp.y);
                    this.viewActive.onWindowResize(this.vp);
                };
                Controls.prototype.update = function (t) {
                    this.viewActive && this.viewActive.update(t)
                    // if (!this.disableRender && this.viewActive.update(t) && this.devMode) {
                    //     this.stats.update();
                    // }
                };
                return Controls;
            }());
            exports.default = Controls;


            /***/
}),
/* 5 */
/***/ (function (module, exports) {

            module.exports = "precision highp float;\nvarying float brightness;\n\nvoid main() {\n\t// gl_FragColor = vec4(0.627, 0.443, 0.341, brightness); // Copper\n\tgl_FragColor = vec4(0.29, 0.82, 0.95, brightness);\t// Blue\n}"

            /***/
}),
/* 6 */
/***/ (function (module, exports) {

            module.exports = "precision highp float;\n\nfloat normFloat(float n, float minVal, float maxVal){\n\treturn max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\nuniform vec3 cameraPosition;\nuniform mat4 modelMatrix;\nuniform mat4 viewMatrix;\nuniform mat4 projectionMatrix;\nuniform float progress;\n\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec3 offset;\nattribute float battID;\n\nvarying float brightness;\n\nvoid main() {\n\tfloat prog = normFloat(progress, battID, battID + 5.0);\n \tvec4 realPos = modelMatrix * vec4(offset + position * prog, 1.0);\n\tvec3 realNorm = normalize(vec3(modelMatrix * vec4(normal, 0.0)));\n\n\tvec3 lightVector = normalize(cameraPosition - realPos.xyz);\n\tbrightness = dot(realNorm, lightVector);\n\t// brightness = normFloat(brightness, 0.8, 0.3);\t// Front side\n\tbrightness = normFloat(-brightness, 0.8, 0.3);\t// Back side\n\tgl_Position = projectionMatrix * viewMatrix * realPos;\n}"

            /***/
}),
/* 7 */
/***/ (function (module, exports) {

            module.exports = "uniform vec3 color;\nuniform sampler2D texture;\n\nvarying float opacity;\n\n// Normalizes a value between 0 - 1\nfloat normFloat(float n, float minVal, float maxVal){\n    return max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\nvoid main() {\n\t// Additive\n    gl_FragColor = texture2D( texture, gl_PointCoord);\n    gl_FragColor.a = normFloat(opacity, 0.01, 0.1);\n}"

            /***/
}),
/* 8 */
/***/ (function (module, exports) {

            module.exports = "#define PI 3.1415926\n\nuniform float vpH;\nuniform float size;\nuniform float brightness;\nvarying float opacity;\n\n// Normalizes a value between 0 - 1\nfloat normFloat(float n, float minVal, float maxVal){\n    return max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\nvoid main() {\n    vec4 realPos = modelMatrix * vec4(position, 1.0);\n    vec3 realNorm = normalize(vec3(modelMatrix * vec4(normal, 0.0)));\n\n    vec3 lightVector = normalize(cameraPosition - realPos.xyz);\n    opacity = dot(realNorm, lightVector);\n    opacity = normFloat(opacity, 0.5, 1.0) * brightness;\n\n    vec4 mvPosition = viewMatrix * realPos;\n    gl_Position = projectionMatrix * mvPosition;\n    gl_PointSize = max((vpH * size / -mvPosition.z) * opacity, 0.0);\n}"

            /***/
}),
/* 9 */
/***/ (function (module, exports) {

            module.exports = "#define RED vec3(1.0, 0.1, 0.1) // red\n#define AMB vec3(1.0, 0.6, 0.1)\t// amber\n#define WHT vec3(1.0, 1.0, 1.0)\t// white\n\nvarying float wht;\nvarying float amb;\n\nvoid main() {\n\tgl_FragColor = vec4((WHT * wht + AMB * amb), 1.0);\n}"

            /***/
}),
/* 10 */
/***/ (function (module, exports) {

            module.exports = "float normFloat(float n, float minVal, float maxVal){\n\treturn max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\n// Returns 1 if type matches val, 0 if not\nfloat checkType(float type, float val){\n\treturn step(val - 0.1, type) * step(type, val + 0.1);\n}\n\nuniform vec3 lightsT;\t// Lights Turn | x: anyTurn, y: left turn, z: right turn\nuniform vec4 lightsS;\t// Lights Stat | x: daytime, y: loBeams, z: hiBeams, w: fogs\nattribute float type;\nvarying float wht;\nvarying float amb;\n\n// z-up position because Blender is weird like that\nvoid main() {\n\tvec2 posXY = vec2(position.y - 2299.0, position.z - 1355.0);\n\tfloat distOrigin = distance(posXY, vec2(0.0));   // FF Logo\n\n\t// 0: Daytime running lights\n\twht = checkType(type, 0.0) * lightsS.x;\n\t\n\t// 1: nightlights\n\twht += checkType(type, 1.0) * lightsS.y;\n\t\n\t// 2: high beams\n\twht += checkType(type, 2.0) * lightsS.z;\n\t\n\t// 3: right turn signal\n\twht += checkType(type, 3.0) * (1.0 + lightsT.x) * lightsS.x;\n\tamb = checkType(type, 3.0) * lightsT.z;\n\t\n\t// 4: left turn signal\n\twht += checkType(type, 4.0) * (1.0 - lightsT.x) * lightsS.x;\n\tamb += checkType(type, 4.0) * lightsT.y;\n\n\t// 5: fog lamps\n\twht += checkType(type, 5.0) * lightsS.w;\n\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );\n}"

            /***/
}),
/* 11 */
/***/ (function (module, exports) {

            module.exports = "#extension GL_OES_standard_derivatives : enable\nprecision highp float;\n\nvarying float prog;\nvarying vec3 viewPos;\nvarying vec3 camPos;\n\nfloat normFloat(float n, float minVal, float maxVal){\n\treturn max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\nvoid main() {\n\tvec3 xTangent = dFdx( viewPos );\n\tvec3 yTangent = dFdy( viewPos );\n\tvec3 faceNormal = normalize( cross( xTangent, yTangent ) );\n\tvec3 lightVector = normalize(camPos - faceNormal);\n\n\tfloat alpha = dot(faceNormal, lightVector);\n\talpha = normFloat(alpha, 0.5, 1.0) * prog;\n\t// alpha = normFloat(alpha, 1.0, 0.5) * prog;\n\n\tgl_FragColor = vec4(0.627, 0.443, 0.341, alpha);\n}"

            /***/
}),
/* 12 */
/***/ (function (module, exports) {

            module.exports = "precision highp float;\n\nfloat normFloat(float n, float minVal, float maxVal){\n\treturn max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\nuniform vec3 cameraPosition;\nuniform mat4 modelMatrix;\nuniform mat4 viewMatrix;\nuniform mat4 projectionMatrix;\nuniform float progress;\n\nattribute vec3 position;\n\nvarying float prog;\nvarying vec3 viewPos;\nvarying vec3 camPos;\n\nvoid main() {\n\tvec4 realPos = modelMatrix * vec4(position, 1.0);\n\t\n\tviewPos = realPos.xyz;\n\tcamPos = cameraPosition;\n\tprog = ((progress * 0.5) - 0.25);\n\tprog = normFloat(position.x, prog + 0.01, prog);\n\n\tgl_Position = projectionMatrix * viewMatrix * realPos;\n}"

            /***/
}),
/* 13 */
/***/ (function (module, exports) {

            module.exports = "varying float brightness;\nvarying vec2 vUV;\n\n// Normalizes a value between 0 - 1\nfloat normFloat(float n, float minVal, float maxVal){\n    return max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\nvoid main() {\n\tvUV = uv;\n    vec4 realPos = modelMatrix * vec4(position, 1.0);\n    vec3 realNorm = normalize(vec3(modelMatrix * vec4(normal, 0.0)));\n\n    vec3 lightVector = normalize(cameraPosition - realPos.xyz);\n    float diffuse = dot(realNorm, lightVector);\n    brightness = normFloat(diffuse, 0.0, 0.5);\n\n    vec4 mvPosition = viewMatrix * realPos;\n    gl_Position = projectionMatrix * mvPosition;\n}"

            /***/
}),
/* 14 */
/***/ (function (module, exports) {

            module.exports = "#define NIGHTLIGHT 0.4\n\nfloat normFloat(float n, float minVal, float maxVal){\n\treturn max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\n// Returns 1 if type matches val, 0 if not\nfloat checkType(float type, float val){\n\treturn step(val - 0.1, type) * step(type, val + 0.1);\n}\n\nuniform vec3 lightsT;\nuniform vec3 lightsO;\nattribute float type;\n\nvarying float redVal;\nvarying float ambVal;\nvarying float whtVal;\nvarying float brightness;\n\nvoid main(){\n\n \tvec4 realPos = modelMatrix * vec4(position, 1.0);\n\tvec3 realNorm = normalize(vec3(modelMatrix * vec4(normal, 0.0)));\n\n\tvec3 lightVector = normalize(cameraPosition - realPos.xyz);\n\tbrightness = dot(realNorm, lightVector);\n\tbrightness = normFloat(brightness, 0.3, 0.2) + 0.5;\n\tbrightness *= brightness * brightness;\n\t\n\t// Type 0: FF logo\t\n\tredVal = checkType(type, 0.0);\n\t// FF brightens on stop light\n\tredVal += redVal * lightsO.x;\n\n\t// Type 1: center grid\n\tredVal += checkType(type, 1.0) * NIGHTLIGHT;\n\n\t// Type 2: Right blinker\n\tredVal += (checkType(type, 2.0) * NIGHTLIGHT) * step(0.0, lightsT.x);\n\tambVal = checkType(type, 2.0) * lightsT.z;\n\n\t// Type 3: Left blinker\n\tredVal += (checkType(type, 3.0) * NIGHTLIGHT) * step(lightsT.x, 0.0);\n\tambVal += checkType(type, 3.0) * lightsT.y;\n\t\n\tbrightness = clamp(brightness, 0.0, 1.0);\n\n\tgl_Position = projectionMatrix * viewMatrix * realPos;\n}"

            /***/
}),
/* 15 */
/***/ (function (module, exports) {

            module.exports = "#define RED_COLOR vec3(1.0, 0.1, 0.1) // red\n#define AMB_COLOR vec3(1.0, 0.6, 0.1)\t// amber\n#define WHT vec3(1.0, 1.0, 1.0)\t// white\n\nvarying float redVal;\nvarying float ambVal;\nvarying float whtVal;\nvarying float brightness;\n\nvoid main() {\n\tgl_FragColor = vec4((RED_COLOR * redVal + AMB_COLOR * ambVal) * brightness, 1.0);\n}"

            /***/
}),
/* 16 */
/***/ (function (module, exports) {

            module.exports = "#define NIGHTLIGHT 0.4\n\nfloat normFloat(float n, float minVal, float maxVal){\n\treturn max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\n// Returns 1 if type matches val, 0 if not\nfloat checkType(float type, float val){\n\treturn step(val - 0.1, type) * step(type, val + 0.1);\n}\n\nuniform vec3 lightsT;\nuniform vec3 lightsO;\nattribute float type;\n\nvarying float redVal;\nvarying float ambVal;\nvarying float whtVal;\nvarying float brightness;\n\nvoid main(){\n\tbrightness = 1.0;\n\n\t// Type 0: Reverse light?\n\n\t// Type 1: Right blinker\n\tambVal = checkType(type, 1.0) * lightsT.z;\n\n\t// Type 2: Left blinker\n\tambVal += checkType(type, 2.0) * lightsT.y;\n\n\t// Type 3: Side brakelights & side nightlights\n\tredVal = checkType(type, 3.0) * (NIGHTLIGHT + lightsO.x * (1.0 - NIGHTLIGHT));\n\n\t// Type 4: Center brakelight\n\tredVal += checkType(type, 4.0) * lightsO.x;\n\n\t// Type 5: Center nightlight\n\tredVal += checkType(type, 5.0) * NIGHTLIGHT;\n\n\t// Type 6: Lower foglights off\n\tredVal += checkType(type, 6.0) * NIGHTLIGHT * 0.2;\n\n\t// Type 7: Lower foglights on\n\tredVal += checkType(type, 7.0) * NIGHTLIGHT * 1.5;\n\t\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );\n}"

            /***/
}),
/* 17 */
/***/ (function (module, exports) {

            module.exports = "uniform sampler2D texture;\nvarying float brightness;\nvarying vec2 vUV;\n\n// Normalizes a value between 0 - 1\nfloat normFloat(float n, float minVal, float maxVal){\n    return max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\nvoid main() {\n\t// Additive\n    gl_FragColor = texture2D( texture, vUV) * brightness;\n\n\t// Subtractive\n\t// gl_FragColor = texture2D( texture, gl_PointCoord ) - vec4( color, 1.0 );\n\t// gl_FragColor *= opacity;\n\n\t// Multip\n\t/* gl_FragColor = -texture2D( texture, gl_PointCoord ) * opacity;\n\tgl_FragColor *= 1.0 - vec4( color, 1.0 );\n\tgl_FragColor += 1.0; */\n}"

            /***/
}),
/* 18 */
/***/ (function (module, exports) {

            module.exports = "uniform vec3 lightsT;\nvarying float brightness;\nvarying vec2 vUV;\n\n// Normalizes a value between 0 - 1\nfloat normFloat(float n, float minVal, float maxVal){\n    return max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\nvoid main() {\n\tvUV = uv;\n    vec4 realPos = modelMatrix * vec4(position, 1.0);\n    vec3 realNorm = normalize(vec3(modelMatrix * vec4(normal, 0.0)));\n\n    vec3 lightVector = normalize(cameraPosition - realPos.xyz);\n    float diffuse = dot(realNorm, lightVector);\n    brightness = step(2000.0, position.y) * lightsT.z + step(position.y, 2000.0) * lightsT.y;\n    brightness *= normFloat(diffuse, 0.0, 0.5);\n\n    vec4 mvPosition = viewMatrix * realPos;\n    gl_Position = projectionMatrix * mvPosition;\n}"

            /***/
}),
/* 19 */
/***/ (function (module, exports) {

            module.exports = "precision highp float;\n\n#define COUNT 20.0\n#define MAX_SCALE 3.0\n\nuniform sampler2D led;\n\nvarying vec2 vUv;\nvarying vec2 vOrigin;\n\nfloat normFloat(float n, float minVal, float maxVal){\n\treturn max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\nvoid main() {\n\t// Brightness fades away from center\n\tfloat brightness = distance(vUv, vec2(0.5));\n\tbrightness = normFloat(brightness, 0.5, 0.0);\n\n\t// Scale is a function of brightness [0 - 3.0]\n\tfloat scale = (brightness * brightness) * MAX_SCALE;\n\tfloat invScale = (1.0 / scale);\n\tfloat halfInvScale = (invScale - 1.0) / 2.0;\n\n\t// Multiply for count, abs(-0.5) for zig-zag\n\tvec2 newUV = abs(fract((vUv + vOrigin) * COUNT) - 0.5) * 2.0;\n\n\t// Scale up and clamp edges for padding\n\tnewUV = clamp((newUV * invScale) - halfInvScale, 0.0, 1.0);\n\n\tfloat texColor = texture2D(led, newUV).a * 0.15 * brightness;\n\tgl_FragColor = 1.0 - vec4(texColor, texColor, texColor, 0.0);\n}\n"

            /***/
}),
/* 20 */
/***/ (function (module, exports) {

            module.exports = "precision highp float;\n\nfloat normFloat(float n, float minVal, float maxVal){\n\treturn max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\nuniform vec3 cameraPosition;\nuniform mat4 modelMatrix;\nuniform mat4 viewMatrix;\nuniform mat4 projectionMatrix;\nuniform vec2 origin;\n\nattribute vec2 uv;\nattribute vec3 position;\n\nvarying vec2 vUv;\nvarying vec2 vOrigin;\n\nvoid main() {\n\tvUv = uv;\n\tvOrigin = origin * 0.1;\n \tvec4 realPos = modelMatrix * vec4(position, 1.0);\n\n\tgl_Position = projectionMatrix * viewMatrix * realPos;\n}"

            /***/
}),
/* 21 */
/***/ (function (module, exports) {

            module.exports = "precision mediump float;\n\nuniform vec3 color;\nuniform sampler2D texture;\n\nvarying float opacity;\nvarying float diagonal;\n\nvoid main() {\n\t\tvec2 coords = vec2(abs(step(0.5, diagonal) - gl_PointCoord.x), gl_PointCoord.y);\n\t\tgl_FragColor = vec4(color, opacity) * texture2D(texture, coords);\n}"

            /***/
}),
/* 22 */
/***/ (function (module, exports) {

            module.exports = "precision mediump float;\n\n#define PI 3.14159265\n#define WAVE_LENGTH 0.125\n#define SIZE_MAX 0.45\n#define TIME_FACTOR 0.4\n\nuniform mat4 modelViewMatrix;\nuniform mat4 viewMatrix;\nuniform mat4 projectionMatrix;\n\nuniform float vpH;\nuniform float time;\nuniform vec2 mousePos;\nuniform float playhead;\n\nvarying float opacity;\nvarying float diagonal;\n\nattribute vec3 position;\n\nfloat normFloat(float n, float minVal, float maxVal){\n\treturn max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\nvoid main() {\n\tfloat currentTime = time * TIME_FACTOR;\n\n\t// Alternate diagonal direction\n\tdiagonal = mod(position.x + position.y, 2.0);\n\n\t// Add sine waves from origin\n\tfloat distOrigin = distance(position.xy, vec2(-0.5, 0.0));   // FF Logo\n\tfloat sizeOrigin = normFloat(distOrigin, 40.0, 0.0);\n\tsizeOrigin = (sizeOrigin + currentTime) / WAVE_LENGTH;\n\tsizeOrigin = (sin(sizeOrigin) + 1.0) * SIZE_MAX;\n\n\t// Add cos waves from mousePos\n\tfloat distMouse = distance(position.xy, mousePos);\n\tfloat sizeMouse = distMouse / -40.0;\n\tsizeMouse = (sizeMouse + currentTime * 0.67) / WAVE_LENGTH * 0.67;\n\tsizeMouse = (cos(sizeMouse) + 1.0) * SIZE_MAX;\n\n\t// Determine progress based on playhead and distance\n\tfloat progress = normFloat(distOrigin, -30.0, 40.0);\n\tprogress = smoothstep(progress - 0.5, progress, playhead);\n\n\t// Combine both values\n\tfloat size = sizeMouse * sizeOrigin * progress;\n\n\t// Add wave when growing\n\tsize += (sin((progress * PI * 2.0) - (PI / 2.0)) + 1.0) / PI;\n\n\t// Make logo\n\tif(distOrigin + (1.0 - progress) * 5.0 < 1.7){\n\t\tsize = progress;\n\t}\n\n\t// Fade outside of radius\n\tsize *= normFloat(distOrigin, 40.0, 35.0);\n\topacity = size * 1.0;\n\n\tvec4 mvPosition = modelViewMatrix * vec4(position.x, position.y, size * 4.0 - (1.0 - progress) * 50.0, 1.0 );\n\tgl_PointSize = 0.125 * vpH * size / -mvPosition.z;\n\tgl_Position = projectionMatrix * mvPosition;\n}"

            /***/
}),
/* 23 */
/***/ (function (module, exports) {

            module.exports = "#define DARK_BLUE vec3(0.063, 0.075, 0.094)\n\nuniform samplerCube tCube;\nuniform float tFlip;\nuniform vec3 color;\n\nvarying vec3 vWorldPosition;\n\nvoid main() {\n\t// float multiColor = DARK_BLUE * light;\n\tgl_FragColor = textureCube( tCube, vec3( tFlip * vWorldPosition.x, vWorldPosition.yz ) );\n\tgl_FragColor.rgb *= color;\n}\n"

            /***/
}),
/* 24 */
/***/ (function (module, exports) {

            module.exports = "varying vec3 vWorldPosition;\n\nvec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n\treturn normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n}\n\nvoid main() {\n\n\tvWorldPosition = transformDirection( position, modelMatrix );\n\n\tvec3 transformed = vec3( position );\n\tvec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );\n\n\tgl_Position = projectionMatrix * mvPosition;\n\n\tgl_Position.z = gl_Position.w; // set z to camera.far\n\n}\n"

            /***/
}),
/* 25 */
/***/ (function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var utils_1 = __webpack_require__(0);
            var Props_1 = __webpack_require__(1);
            var battVert = __webpack_require__(6);
            var battFrag = __webpack_require__(5);
            var Batts = /** @class */ (function () {
                function Batts(_parent, _object) {
                    this.showing = false;
                    this.parent = _parent;
                    // Set up singleGeom for cloning
                    this.singleBatt = _object.getObjectByName("Batt");
                    this.singleGeom = this.singleBatt.geometry;
                    utils_1.scaleAndCenter(this.singleGeom, { x: Props_1.FF91.WheelBase * 0.65 / 6 });
                    this.singleGeom.computeVertexNormals();
                    this.cloneBatts();
                }
                Batts.prototype.cloneBatts = function () {
                    // Clone stringGeom attributes from singleGeom
                    this.stringGeom = new THREE.InstancedBufferGeometry();
                    this.stringGeom.index = this.singleGeom.index;
                    this.stringGeom.attributes.position = this.singleGeom.attributes.position;
                    this.stringGeom.attributes.normal = this.singleGeom.attributes.normal;
                    // Make new stringGeom attributes
                    var offsets = [];
                    var battID = [];
                    var xSpacing = Props_1.FF91.WheelBase * 0.7 / 6;
                    var zSpacing = Props_1.FF91.WheelTrack * 0.7 / 6;
                    for (var x = 0, i = 0; x < 6; x++) {
                        for (var z = 0; z < 6; z++ , i++) {
                            // offsets
                            offsets.push(-x * xSpacing, z * zSpacing, 0);
                            battID.push(i);
                        }
                    }
                    this.stringGeom.addAttribute("offset", new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3));
                    this.stringGeom.addAttribute("battID", new THREE.InstancedBufferAttribute(new Float32Array(battID), 1));
                    // Declare material
                    this.stringMat = new THREE.RawShaderMaterial({
                        uniforms: {
                            progress: { value: 0 }
                        },
                        vertexShader: battVert,
                        fragmentShader: battFrag,
                        transparent: true,
                        blending: THREE.AdditiveBlending,
                        depthTest: false,
                        side: THREE.BackSide
                    });
                    this.progUniform = this.stringMat.uniforms["progress"];
                    // Build mesh
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
                        TweenLite.to(this.progUniform, 1, { value: 36 + 4, ease: Power2.easeInOut });
                    }
                };
                Batts.prototype.hide = function () {
                    if (this.showing) {
                        this.showing = false;
                        TweenLite.killTweensOf(this);
                        TweenLite.to(this.progUniform, 1, {
                            value: 0, ease: Power2.easeInOut, onComplete: function () {
                                this.stringMesh.visible = false;
                            }.bind(this)
                        });
                    }
                };
                return Batts;
            }());
            exports.default = Batts;


            /***/
}),
/* 26 */
/***/ (function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var Wheels_1 = __webpack_require__(29);
            var Lights_1 = __webpack_require__(27);
            var Motors_1 = __webpack_require__(28);
            var Batts_1 = __webpack_require__(25);
            /****** Car hierarchy *****
            
            CarWhole
            ├── wheelFL
            ├── wheelFR
            ├── wheelBL
            ├── wheelBR
            ├── Batts
            ├── CarChassis
                ├── BodyBlack
                ├── BodySilver
                ├── Brakes
                ├── FFBack
                ├── GlassTinted
                ├── GlassTransparent
                ├── Headlights
                ├── Taillights
                ├── Motors
                └── Undercarriage
            
            */
            var CarBody = /** @class */ (function () {
                function CarBody(_scene, _cargo) {
                    this.parent = _scene;
                    this.carWhole = new THREE.Group();
                    this.carWhole.name = 'carMesh'
                    this.carWhole.position.x = -1.56;
                    this.parent.add(this.carWhole);
                    this.carChassis = this.buildCarChassis(_cargo.getMesh("body"), _cargo.getCubeTexture("envReflection"));
                    this.carWhole.add(this.carChassis);
                    this.addShadow(_cargo.getTexture("shadow"));
                    this.carLights = new Lights_1.default(this.carChassis, _cargo);
                    this.carWheels = new Wheels_1.default(this.carWhole, _cargo);
                    this.carMotors = new Motors_1.default(this.carChassis, _cargo.getMesh("xrays"));
                    this.carBatts = new Batts_1.default(this.carWhole, _cargo.getMesh("xrays"));
                }
                // Creates black part of body
                CarBody.prototype.buildCarChassis = function (_bodyGeom, _cubeText) {
                    _bodyGeom.scale.set(0.0005, 0.0005, 0.0005);
                    _bodyGeom.position.set(1.56, 0, 0);
                    this.envCube = _cubeText;
                    this.envCube.format = THREE.RGBFormat;
                    // Material Body Color
                    this.matBodySilver = new THREE.MeshStandardMaterial({
                        color: 0xbbbbbb,
                        metalness: 0.7,
                        roughness: 0.7,
                    });
                    // Workaround for browsers without Texture LevelOfDetail support
                    if (window["EXT_STLOD_SUPPORT"] === false) {
                        this.envCube.minFilter = THREE.LinearFilter;
                        this.matBodySilver.metalness = 0.05;
                        this.matBodySilver.roughness = 0.8;
                        this.matBodySilver.color = new THREE.Color(0x777777);
                    }
                    // Material Body Black
                    this.matBodyBlack = new THREE.MeshLambertMaterial({
                        color: 0x222222,
                        reflectivity: 0.8,
                        envMap: this.envCube,
                    });
                    // Tinted windows
                    this.matGlassTinted = new THREE.MeshLambertMaterial({
                        color: 0x666666,
                        reflectivity: 1,
                        envMap: this.envCube,
                    });
                    this.matUndercarriage = new THREE.MeshBasicMaterial({
                        color: 0x000000
                    });
                    // Transparent glass
                    this.matGlassTransp = new THREE.MeshLambertMaterial({
                        color: 0x666666,
                        reflectivity: 1.0,
                        envMap: this.envCube,
                        transparent: true,
                        blending: THREE.AdditiveBlending,
                    });
                    // Car bodymaterials
                    _bodyGeom.getObjectByName("BodyBlack").material = this.matBodyBlack;
                    _bodyGeom.getObjectByName("BodySilver").material = this.matBodySilver;
                    _bodyGeom.getObjectByName("GlassTransparent").material = this.matGlassTransp;
                    _bodyGeom.getObjectByName("GlassTinted").material = this.matGlassTinted;
                    _bodyGeom.getObjectByName("Undercarriage").material = this.matUndercarriage;
                    return _bodyGeom;
                };
                CarBody.prototype.addShadow = function (_shad) {
                    var shadowPlane = new THREE.PlaneBufferGeometry(6.5, 6.5, 1, 1);
                    shadowPlane.rotateX(-Math.PI / 2);
                    shadowPlane.translate(1.56, 0, 0);
                    var shadowMat = new THREE.MeshBasicMaterial({
                        map: _shad,
                        blending: THREE.MultiplyBlending,
                        transparent: true,
                    });
                    var shadowMesh = new THREE.Mesh(shadowPlane, shadowMat);
                    shadowMesh.name = 'shadowMesh'
                    this.carWhole.add(shadowMesh);
                };
                ///////////////////////////// PUBLIC METHODS /////////////////////////////
                CarBody.prototype.onWindowResize = function (_vpH) {
                    this.carLights.onWindowResize(_vpH);
                };
                // Called once per frame
                CarBody.prototype.update = function (_props) {
                    // Apply car physics
                    this.carWhole.rotation.y = _props.theta;
                    if (_props.longitMomentum !== 0) {
                        this.carChassis.rotation.z = _props.longitMomentum * 0.0015;
                    }
                    this.carChassis.rotation.x = _props.lateralMomentum * 0.002;
                    this.carWheels.update(_props);
                    this.carLights.update(_props);
                };
                return CarBody;
            }());
            exports.default = CarBody;


            /***/
}),
/* 27 */
/***/ (function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            // Import custom shaders
            var headLightsVS = __webpack_require__(10);
            var headLightsFS = __webpack_require__(9);
            var tailLightVS = __webpack_require__(16);
            var tailGridVS = __webpack_require__(14);
            var tailGridFS = __webpack_require__(15);
            var flareVS = __webpack_require__(8);
            var flareFS = __webpack_require__(7);
            var turnBarVS = __webpack_require__(18);
            var stopBarVS = __webpack_require__(13);
            var turnBarFS = __webpack_require__(17);
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
                    // 增加一圈边光
                    this.addMeshMaterials();
                    // 增加大灯
                    this.addHeadFlares(_cargo.getTexture("flareHead"));
                    this.addStopMesh(_cargo.getTexture("lightStop"));
                    this.addTurnFlares(_cargo.getTexture("flareTurn"), _cargo.getTexture("lightTurn"));
                }
                ////////////////// SOLID LIGHT MESHES //////////////////
                CarLights.prototype.addMeshMaterials = function () {
                    var headLights = this.carChassis.getObjectByName("HeadLights");
                    var tailLights = this.carChassis.getObjectByName("TailLights");
                    var tailGrid = this.carChassis.getObjectByName("TailGrid");
                    tailGrid.geometry.computeVertexNormals();
                    headLights.material = new THREE.ShaderMaterial({
                        uniforms: {
                            // 光的开关
                            lightsT: { value: this.lightsCtrlTurn },
                            // 光的强度
                            lightsS: { value: this.lightsCtrlHead }
                        },
                        vertexShader: headLightsVS,
                        fragmentShader: headLightsFS
                    });
                    tailLights.material = new THREE.ShaderMaterial({
                        uniforms: {
                            lightsT: { value: this.lightsCtrlTurn },
                            lightsO: { value: this.lightsCtrlOther }
                        },
                        vertexShader: tailLightVS,
                        fragmentShader: tailGridFS,
                    });
                    tailGrid.material = new THREE.ShaderMaterial({
                        uniforms: {
                            lightsT: { value: this.lightsCtrlTurn },
                            lightsO: { value: this.lightsCtrlOther }
                        },
                        vertexShader: tailGridVS,
                        fragmentShader: tailGridFS
                    });
                };
                ////////////////// HEADLIGHT FLARES //////////////////
                CarLights.prototype.addHeadFlares = function (_tex) {
                    this.headFlareMat = new THREE.ShaderMaterial({
                        uniforms: {
                            texture: { value: _tex },
                            vpH: { value: window.innerHeight },
                            size: { value: 1.5 },
                            brightness: { value: 1 }
                        },
                        vertexShader: flareVS,
                        fragmentShader: flareFS,
                        blending: THREE.AdditiveBlending,
                        transparent: true,
                        // depthWrite: false,
                        depthTest: false,
                    });
                    // Make positions
                    var posArray = new Float32Array([
                        4000, 1875, 1700,
                        4300, 1800, 1700,
                        4000, 1875, -1700,
                        4300, 1800, -1700,
                    ]);
                    // Make normals
                    var normArray = new Float32Array([
                        0.87, 0.22, 0.44,
                        0.87, 0.22, 0.44,
                        0.87, 0.22, -0.44,
                        0.87, 0.22, -0.44,
                    ]);
                    var flareHeadGeom = new THREE.BufferGeometry();
                    flareHeadGeom.addAttribute("position", new THREE.BufferAttribute(posArray, 3));
                    flareHeadGeom.addAttribute("normal", new THREE.BufferAttribute(normArray, 3));
                    this.flareHeadPoints = new THREE.Points(flareHeadGeom, this.headFlareMat);
                    this.carChassis.add(this.flareHeadPoints);
                };
                ////////////////// STOPLIGHT FLARES //////////////////
                CarLights.prototype.addStopMesh = function (_tex) {
                    this.meshStopGlow = this.carChassis.getObjectByName("Stop");
                    this.meshStopGlow.material = new THREE.ShaderMaterial({
                        uniforms: {
                            texture: { value: _tex }
                        },
                        vertexShader: stopBarVS,
                        fragmentShader: turnBarFS,
                        blending: THREE.AdditiveBlending,
                        transparent: true,
                        depthTest: false
                    });
                    ;
                };
                ////////////////// TURN SIGNALS //////////////////
                CarLights.prototype.addTurnFlares = function (_tex1, _tex2) {
                    // Left grid
                    var posArray = new Float32Array([-4755, 2227, -1269, -4703, 2222, -1326, -4649, 2215, -1381, -4590, 2208, -1436, -4526, 2200, -1492, -4459, 2192, -1548, -4386, 2182, -1604, -4718, 2182, -1264, -4668, 2179, -1321, -4301, 2175, -1658, -4614, 2175, -1377, -4556, 2168, -1433, -4494, 2163, -1489, -4429, 2158, -1545, -4358, 2151, -1600, -4266, 2147, -1653, -4675, 2136, -1260, -4627, 2134, -1316, -4575, 2132, -1373, -4520, 2130, -1428, -4461, 2128, -1485, -4400, 2126, -1540, -4329, 2123, -1597]);
                    var normArray = new Float32Array([-0.9, 0, -0.4, -0.9, 0, -0.4, -0.9, 0, -0.4, -0.9, 0, -0.4, -0.9, 0, -0.4, -0.9, 0, -0.4, -0.9, 0, -0.4, -0.9, 0, -0.4, -0.9, 0, -0.4, -0.9, 0, -0.4, -0.9, 0, -0.4, -0.9, 0, -0.4, -0.9, 0, -0.4, -0.9, 0, -0.4, -0.9, 0, -0.4, -0.9, 0, -0.4, -0.9, 0, -0.4, -0.9, 0, -0.4, -0.9, 0, -0.4, -0.9, 0, -0.4, -0.9, 0, -0.4, -0.9, 0, -0.4, -0.9, 0, -0.4]);
                    this.turnPointMaterial = this.headFlareMat.clone();
                    this.turnPointMaterial.uniforms["texture"].value = _tex1;
                    this.turnPointMaterial.uniforms["size"].value = 0.1;
                    this.turnPointMaterial.uniforms["brightness"].value = 1;
                    var leftTurnGrid = new THREE.BufferGeometry();
                    leftTurnGrid.addAttribute("position", new THREE.BufferAttribute(posArray, 3));
                    leftTurnGrid.addAttribute("normal", new THREE.BufferAttribute(normArray, 3));
                    this.turnLeftPoints = new THREE.Points(leftTurnGrid, this.turnPointMaterial);
                    this.turnLeftPoints.visible = false;
                    this.carChassis.add(this.turnLeftPoints);
                    // Right grid
                    posArray = new Float32Array([-4755, 2227, 1269, -4703, 2222, 1326, -4649, 2215, 1381, -4590, 2208, 1436, -4526, 2200, 1492, -4459, 2192, 1548, -4386, 2182, 1604, -4718, 2182, 1264, -4668, 2179, 1321, -4301, 2175, 1658, -4614, 2175, 1377, -4556, 2168, 1433, -4494, 2163, 1489, -4429, 2158, 1545, -4358, 2151, 1600, -4266, 2147, 1653, -4675, 2136, 1260, -4627, 2134, 1316, -4575, 2132, 1373, -4520, 2130, 1428, -4461, 2128, 1485, -4400, 2126, 1540, -4329, 2123, 1597]);
                    normArray = new Float32Array([-0.9, 0, 0.4, -0.9, 0, 0.4, -0.9, 0, 0.4, -0.9, 0, 0.4, -0.9, 0, 0.4, -0.9, 0, 0.4, -0.9, 0, 0.4, -0.9, 0, 0.4, -0.9, 0, 0.4, -0.9, 0, 0.4, -0.9, 0, 0.4, -0.9, 0, 0.4, -0.9, 0, 0.4, -0.9, 0, 0.4, -0.9, 0, 0.4, -0.9, 0, 0.4, -0.9, 0, 0.4, -0.9, 0, 0.4, -0.9, 0, 0.4, -0.9, 0, 0.4, -0.9, 0, 0.4, -0.9, 0, 0.4, -0.9, 0, 0.4,]);
                    var rightTurnGrid = new THREE.BufferGeometry();
                    rightTurnGrid.addAttribute("position", new THREE.BufferAttribute(posArray, 3));
                    rightTurnGrid.addAttribute("normal", new THREE.BufferAttribute(normArray, 3));
                    this.turnRightPoints = new THREE.Points(rightTurnGrid, this.turnPointMaterial);
                    this.turnRightPoints.visible = false;
                    this.carChassis.add(this.turnRightPoints);
                    // Left & right turn bars
                    this.carChassis.getObjectByName("Turn").material = new THREE.ShaderMaterial({
                        uniforms: {
                            texture: { value: _tex2 },
                            lightsT: { value: this.lightsCtrlTurn }
                        },
                        vertexShader: turnBarVS,
                        fragmentShader: turnBarFS,
                        blending: THREE.AdditiveBlending,
                        transparent: true,
                        depthTest: false
                    });
                };
                //////////////////////////////// RAF UPDATES ////////////////////////////////
                CarLights.prototype.turnSignalsBlink = function (_angle, _tDelta) {
                    this.lightsCtrlTurn.x = Math.sign(_angle);
                    // Turning left
                    if (_angle > 0) {
                        this.lfTimer = (this.lfTimer + _tDelta * 2) % 2;
                        this.rtTimer = 0;
                        this.lightsCtrlTurn.y = (this.lfTimer > 1) ? 0 : 1;
                        this.lightsCtrlTurn.z = 0;
                    }
                    // Turning right
                    else if (_angle < 0) {
                        this.lfTimer = 0;
                        this.rtTimer = (this.rtTimer + _tDelta * 2) % 2;
                        this.lightsCtrlTurn.y = 0;
                        this.lightsCtrlTurn.z = (this.rtTimer > 1) ? 0 : 1;
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
                    switch (_newState) {
                        // 全部关闭
                        case 0:
                            this.lightsCtrlHead.set(0, 0, 0, 0);
                            this.flareHeadPoints && (this.flareHeadPoints.visible = false)
                            break;
                        // Daytime
                        case 1:
                            this.lightsCtrlHead.set(1, 0, 0, 0);
                            this.flareHeadPoints.visible = false;
                            break;

                        // Daytime + Low beams
                        case 2:
                            this.lightsCtrlHead.set(1, 1, 0, 0);
                            this.flareHeadPoints && (this.flareHeadPoints.visible = true)
                            break;

                        // Daytime + Low beams + high beams                        
                        case 3:
                            this.lightsCtrlHead.set(1, 1, 1, 0);
                            this.flareHeadPoints.visible = true;
                            break;

                        // Daytime + Low beams + high beams + fog lamps                     
                        case 4:
                            this.lightsCtrlHead.set(1, 1, 1, 1);
                            this.flareHeadPoints.visible = true;
                            break;
                    }
                    this.prevHeadlightState = _newState;
                };
                CarLights.prototype.onWindowResize = function (_vpH) {
                    this.headFlareMat.uniforms["vpH"].value = _vpH;
                    this.turnPointMaterial.uniforms["vpH"].value = _vpH;
                };
                CarLights.prototype.update = function (_props) {
                    // Turn signals
                    if (_props.wAngleTarg !== 0) {
                        this.turnSignalsBlink(_props.wAngleTarg, _props.time.delta);
                    }
                    else if (this.lightsCtrlTurn.x !== 0) {
                        this.turnSignalsClear();
                    }
                    // Headlights
                    if (this.prevHeadlightState !== _props.headLights) {
                        this.headlightsChanged(_props.headLights);
                    }
                    // Stop lights
                    if (_props.braking && !this.meshStopGlow.visible) {
                        this.meshStopGlow.visible = true;
                        this.lightsCtrlOther.x = 1;
                    }
                    else if (!_props.braking && this.meshStopGlow && this.meshStopGlow.visible ) {
                        this.meshStopGlow.visible = false;
                        this.lightsCtrlOther.x = 0;
                    }
                };
                return CarLights;
            }());
            exports.default = CarLights;


            /***/
}),
/* 28 */
/***/ (function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var utils_1 = __webpack_require__(0);
            var Props_1 = __webpack_require__(1);
            var motorVert = __webpack_require__(12);
            var motorFrag = __webpack_require__(11);
            var Motors = /** @class */ (function () {
                function Motors(_parent, _object) {
                    this.showing = false;
                    this.parent = _parent;
                    // Get geometry data
                    this.motorFrontSm = _object.getObjectByName("MotorFront");
                    this.geomFront = this.motorFrontSm.geometry;
                    this.motorBackR = _object.getObjectByName("MotorBack");
                    this.geomBack = this.motorBackR.geometry;
                    this.buildMotors();
                }
                Motors.prototype.buildMotors = function () {
                    // Scale and positioning
                    utils_1.scaleAndCenter(this.geomFront, { z: Props_1.FF91.WheelTrack / 6 }, "xz");
                    utils_1.scaleAndCenter(this.geomBack, { z: Props_1.FF91.WheelTrack / 4 }, "xz");
                    var wPosY = Props_1.FF91.WheelDiam / 2;
                    var wPosF = Props_1.FF91.WheelBase / 2;
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
                    // Declare material
                    this.material = new THREE.RawShaderMaterial({
                        uniforms: {
                            progress: { value: 0 }
                        },
                        vertexShader: motorVert,
                        fragmentShader: motorFrag,
                        transparent: true,
                        blending: THREE.AdditiveBlending,
                        depthTest: false,
                    });
                    this.progUniform = this.material.uniforms["progress"];
                    this.motorFrontSm.material =
                        this.motorFrontLg.material =
                        this.motorBackR.material =
                        this.motorBackL.material = this.material;
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
                /////////////////////////////////////// SHOW/HIDE ////////////////////////////////////////
                Motors.prototype.show = function () {
                    if (!this.showing) {
                        this.showing = true;
                        this.group.visible = true;
                        TweenLite.killTweensOf(this);
                        TweenLite.to(this.progUniform, 2.0, { value: 1.0, ease: Power2.easeOut });
                    }
                };
                Motors.prototype.hide = function () {
                    if (this.showing) {
                        this.showing = false;
                        TweenLite.killTweensOf(this);
                        TweenLite.to(this.progUniform, 1.0, {
                            value: 0, ease: Power2.easeInOut, onComplete: function () {
                                this.group.visible = false;
                            }.bind(this)
                        });
                    }
                };
                return Motors;
            }());
            exports.default = Motors;


            /***/
}),
/* 29 */
/***/ (function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var Props_1 = __webpack_require__(1);
            var utils_1 = __webpack_require__(0);
            var CarWheels = /** @class */ (function () {
                function CarWheels(_carWhole, _cargo) {
                    // Cap wheel rotation to avoid the "Wagon-wheel effect"
                    this.maxWheelTurn = Math.PI / 9.69;
                    this.carWhole = _carWhole;
                    this.thread = _cargo.getTexture("thread");
                    this.thread.minFilter = THREE.NearestFilter;
                    this.thread.magFilter = THREE.LinearFilter;
                    this.thread.format = THREE.RGBFormat;
                    this.ogMatrix = new THREE.Matrix4().set(0.000788, 0, 0, -0.3939, 0, 0, 0.000788, -0.3939, 0, -0.000788, 0, 0.15, 0, 0, 0, 1);
                    this.wPosFr = Props_1.FF91.WheelBase;
                    this.wPosBk = 0;
                    this.wPosLf = Props_1.FF91.WheelTrack / -2;
                    this.wPosRt = Props_1.FF91.WheelTrack / 2;
                    this.wPosY = Props_1.FF91.WheelDiam / 2;
                    var wheelGeom = _cargo.getMesh("wheel");
                    this.addWheels(wheelGeom.getObjectByName("Wheel"));
                    this.addBrakes(wheelGeom.getObjectByName("Brake"));
                }
                //////////////////////////////// BUILDING WHEELS ////////////////////////////////
                CarWheels.prototype.addWheels = function (_wheelGroup) {
                    this.wheelFL = _wheelGroup;
                    var meshRubber = this.wheelFL.getObjectByName("Tire");
                    var meshSilver = this.wheelFL.getObjectByName("RimsSilver");
                    var meshBlack = this.wheelFL.getObjectByName("RimsBlack");
                    var geomRubber = meshRubber.geometry;
                    var geomSilver = meshSilver.geometry;
                    var geomBlack = meshBlack.geometry;
                    geomRubber.applyMatrix(this.ogMatrix);
                    geomSilver.applyMatrix(this.ogMatrix);
                    geomBlack.applyMatrix(this.ogMatrix);
                    // Compute normals in CPU to save JSON filesize
                    geomRubber.computeVertexNormals();
                    geomSilver.computeVertexNormals();
                    geomBlack.computeVertexNormals();
                    // Define materials
                    var matRubber = new THREE.MeshLambertMaterial({
                        color: 0x202020,
                        map: this.thread,
                        side: THREE.DoubleSide
                    });
                    var matSilver = new THREE.MeshPhongMaterial({
                        color: 0x999999,
                        shininess: 50,
                        side: THREE.DoubleSide
                    });
                    var matBlack = new THREE.MeshPhongMaterial({
                        color: 0x111111,
                        shininess: 50,
                        side: THREE.DoubleSide
                    });
                    meshRubber.material = matRubber;
                    meshSilver.material = matSilver;
                    meshBlack.material = matBlack;
                    // Front left
                    this.wheelFL.position.set(this.wPosFr, this.wPosY, this.wPosLf);
                    this.carWhole.add(this.wheelFL);
                    // Back left
                    this.wheelBL = this.wheelFL.clone();
                    this.wheelBL.position.set(this.wPosBk, this.wPosY, this.wPosLf);
                    this.carWhole.add(this.wheelBL);
                    // Invert wheels to add on right side
                    var iGeomRubber = geomRubber.clone().scale(1, 1, -1);
                    var iGeomSilver = geomSilver.clone().scale(1, 1, -1);
                    var iGeomBlack = geomBlack.clone().scale(1, 1, -1);
                    // Compute new normals after matrix transform
                    iGeomRubber.computeVertexNormals();
                    iGeomSilver.computeVertexNormals();
                    iGeomBlack.computeVertexNormals();
                    var iMeshRubber = new THREE.Mesh(iGeomRubber, matRubber);
                    var iMeshSilver = new THREE.Mesh(iGeomSilver, matSilver);
                    var iMeshBlack = new THREE.Mesh(iGeomBlack, matBlack);
                    // Front right
                    this.wheelFR = new THREE.Group();
                    this.wheelFR.add(iMeshRubber);
                    this.wheelFR.add(iMeshSilver);
                    this.wheelFR.add(iMeshBlack);
                    this.wheelFR.position.set(this.wPosFr, this.wPosY, this.wPosRt);
                    this.carWhole.add(this.wheelFR);
                    // Back right
                    this.wheelBR = this.wheelFR.clone();
                    this.wheelBR.position.set(this.wPosBk, this.wPosY, this.wPosRt);
                    this.carWhole.add(this.wheelBR);
                };
                //////////////////////////////// BUILDING BRAKES ////////////////////////////////
                CarWheels.prototype.addBrakes = function (_brakeGroup) {
                    this.brakeBL = _brakeGroup;
                    var brMeshDisc = this.brakeBL.getObjectByName("Disc");
                    var brMeshPads = this.brakeBL.getObjectByName("Pad");
                    brMeshDisc.geometry.applyMatrix(this.ogMatrix);
                    brMeshPads.geometry.applyMatrix(this.ogMatrix);
                    brMeshDisc.material = new THREE.MeshPhongMaterial({
                        color: 0x555555,
                        shininess: 100,
                        flatShading: true
                    });
                    brMeshPads.material = new THREE.MeshPhongMaterial({
                        color: 0x333333,
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
                //////////////////////////////// CALCULATE ROTATIONS ////////////////////////////////
                CarWheels.prototype.turnByRadiusRatio = function (_props) {
                    this.rotOverall = -_props.frameDist / Props_1.FF91.WheelCirc * Math.PI * 2;
                    this.rotFL =
                        this.rotBL =
                        this.rotFR =
                        this.rotBR = Math.max(this.rotOverall, -this.maxWheelTurn);
                    if (_props.wAngleSign !== 0) {
                        this.ratioFO = _props.radFrontOut / _props.radBackIn;
                        this.ratioBO = _props.radBackOut / _props.radBackIn;
                        this.ratioFI = _props.radFrontIn / _props.radBackIn;
                        this.ratioBI = 1.0;
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
                        this.brakeBL.rotation.y =
                            this.wheelBR.rotation.y =
                            this.wheelBL.rotation.y = utils_1.normalize(_props.speed, 22.2, 0) * _props.wAngleInner * -0.09;
                        this.brakeBR.rotation.y = -this.wheelBL.rotation.y;
                    }
                    this.wheelFL.rotateZ(this.rotFL);
                    this.wheelBL.rotateZ(this.rotBL);
                    this.wheelFR.rotateZ(this.rotFR);
                    this.wheelBR.rotateZ(this.rotBR);
                };
                //////////////////////////////// EVENT LISTENERS ////////////////////////////////
                CarWheels.prototype.update = function (props) {
                    this.turnByRadiusRatio(props);
                };
                return CarWheels;
            }());
            exports.default = CarWheels;


            /***/
}),
/* 30 */
/***/ (function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var props_1 = __webpack_require__(2);
            // This class manages all cards and their HTML elements
            var Card = /** @class */ (function () {
                function Card(_scene) {
                    this.prevSection = -1;
                    this.showing = false;
                    this.scene = _scene;
                    this.closeX = document.getElementById("closeX");
                    this.stash = document.getElementById("dynamicContent");
                    this.backgDOM = document.getElementById("cardBack");
                    this.foregDOM = document.createElement("div");
                    this.foregDOM.setAttribute("id", "cardFore");
                    this.foreg3D = new THREE.CSS3DObject(this.foregDOM);
                    this.backg3D = new THREE.CSS3DObject(this.backgDOM);
                    window["card"] = this.foreg3D;
                    window["rad"] = Math.PI / 180;
                    this.rot = new THREE.Euler();
                    this.trans = new THREE.Vector3();
                    this.contents = new Array(7);
                }
                /////////////////////////////////////// PUBLIC METHODS ////////////////////////////////////////
                Card.prototype.show = function (_id, _prop) {
                    if (_id === 7)
                        return;
                    if (this.showing) {
                        this.hide();
                    }
                    TweenLite.killDelayedCallsTo(this.build);
                    TweenLite.delayedCall(1.5, this.build, [_id, _prop], this);
                };
                Card.prototype.hide = function () {
                    if (!this.showing)
                        return;
                    this.foregDOM.classList.remove("active");
                    this.backgDOM.classList.remove("active");
                    this.backgDOM.style.width = 0 + "px";
                    this.backgDOM.style.height = 0 + "px";
                    TweenLite.delayedCall(0.5, function () {
                        this.showing = false;
                        this.scene.remove(this.foreg3D);
                        this.scene.remove(this.backg3D);
                    }.bind(this));
                };
                Card.prototype.setPosition = function (pos) {
                    this.foreg3D.position.set(pos.x, pos.y, pos.z).multiplyScalar(props_1.GOLDEN_RATIO);
                    this.backg3D.position.set(pos.x, pos.y, pos.z).multiplyScalar(props_1.GOLDEN_RATIO);
                    // Push background back
                    this.foreg3D.getWorldDirection(this.trans);
                    this.backg3D.position.addScaledVector(this.trans, -100);
                };
                /////////////////////////////////////// PRIVATE METHODS ////////////////////////////////////////
                Card.prototype.build = function (_id, prop) {
                    console.error(_id, prop)
                    this.showing = true;
                    // Get contents from DOM
                    if (this.contents[_id] === undefined) {
                        this.contents[_id] = document.getElementById("content-" + prop.name);
                    }
                    // Stash previous content
                    if (this.prevSection !== -1)
                        this.stash.appendChild(this.contents[this.prevSection]);
                    // Replace with new content
                    this.foregDOM.appendChild(this.contents[_id]);
                    this.foregDOM.appendChild(this.closeX);
                    this.closeX.setAttribute("style", "");
                    if (prop.inverted) {
                        this.foregDOM.classList.add("inverted");
                        this.backgDOM.classList.add("inverted");
                    }
                    else {
                        this.foregDOM.classList.remove("inverted");
                        this.backgDOM.classList.remove("inverted");
                    }
                    // Set rotation
                    var rad = Math.PI / 180;
                    this.rot.set(prop.orientation.x * rad, prop.orientation.y * rad, prop.orientation.z * rad);
                    this.foreg3D.rotation.copy(this.rot);
                    this.backg3D.rotation.copy(this.rot);
                    // Set position
                    this.setPosition(prop.position);
                    this.foregDOM.style.width = prop.size.w + "px";
                    this.foregDOM.style.height = prop.size.h + "px";
                    this.scene.add(this.foreg3D);
                    this.scene.add(this.backg3D);
                    // Animate in
                    TweenLite.delayedCall(0.1, function () {
                        this.foregDOM.classList.add("active");
                        this.backgDOM.classList.add("active");
                        this.backgDOM.style.width = (prop.size.w + 40) + "px";
                        this.backgDOM.style.height = (prop.size.h + 40) + "px";
                    }.bind(this));
                    this.prevSection = _id;
                };
                return Card;
            }());
            exports.default = Card;


            /***/
}),
/* 31 */
/***/ (function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            // Controls events that happen to cards. Mainly CloseX and knob moved.
            var CardControls = /** @class */ (function () {
                function CardControls(_parent) {
                    this.parent = _parent;
                    this.closeX = document.getElementById("closeX");
                    this.frontButtons = document.getElementsByClassName("frontLightBut");
                    this.powerKnob = document.getElementById("powerKnob");
                    this.steerKnob = document.getElementById("steerKnob");
                    this.rearKnob = document.getElementById("rearKnob");
                    this.activeKnob = null;
                    this.knobPos = new THREE.Vector2();
                    for (var i = 0; i < this.frontButtons.length; i++) {
                        this.frontButtons[i].addEventListener("click", this.frontLightClick.bind(this, i), false);
                    }
                    this.closeX.addEventListener("click", this.closeXClick.bind(this), false);
                    this.powerKnob.addEventListener("mousedown", this.mousedownKnob.bind(this, 0), true);
                    this.powerKnob.addEventListener("touchstart", this.mousedownKnob.bind(this, 0), true);
                    this.steerKnob.addEventListener("mousedown", this.mousedownKnob.bind(this, 1), true);
                    this.steerKnob.addEventListener("touchstart", this.mousedownKnob.bind(this, 1), true);
                    this.rearKnob.addEventListener("mousedown", this.mousedownKnob.bind(this, 2), true);
                    this.rearKnob.addEventListener("touchstart", this.mousedownKnob.bind(this, 2), true);
                }
                /////////////////////////////////////// TOUCHY THE KNOB ////////////////////////////////////////
                CardControls.prototype.mousedownKnob = function (index, event) {
                    switch (index) {
                        case 0:
                            this.activeKnob = this.powerKnob;
                            break;
                        case 1:
                            this.activeKnob = this.steerKnob;
                            break;
                        case 2:
                            this.activeKnob = this.rearKnob;
                            break;
                    }
                    this.parent.knobMouseDown();
                };
                CardControls.prototype.knobMoved = function (xDisp, yDisp) {
                    switch (this.activeKnob) {
                        case this.powerKnob:
                            this.knobPos.set(0, THREE.Math.clamp(yDisp, -150, 150));
                            this.renderKnobPos();
                            break;
                        case this.steerKnob:
                            this.knobPos.set(THREE.Math.clamp(xDisp, -150, 150), 0);
                            this.renderKnobPos();
                            break;
                        case this.rearKnob:
                            this.knobPos.set(THREE.Math.clamp(xDisp, -150, 150), THREE.Math.clamp(yDisp, 0, 10));
                            this.renderKnobPos();
                            break;
                    }
                };
                CardControls.prototype.knobReleased = function () {
                    TweenLite.to(this.knobPos, 0.5, {
                        x: 0,
                        y: 0,
                        onUpdate: this.renderKnobPos.bind(this),
                    });
                };
                CardControls.prototype.renderKnobPos = function () {
                    if (this.activeKnob !== null) {
                        this.activeKnob.setAttribute("transform", "translate(" + this.knobPos.x + ", " + this.knobPos.y + ")");
                        this.parent.knobMouseMoved(this.knobPos);
                    }
                };
                /////////////////////////////////////// BUTTON CLICKS ////////////////////////////////////////
                // Front Lighting controls
                CardControls.prototype.frontLightClick = function (_index, _evt) {
                    if (this.frontButtons[_index].classList.contains("active")) {
                        for (var i = _index; i < this.frontButtons.length; i++) {
                            this.frontButtons[i].classList.remove("active");
                        }
                        this.parent.frontLightsChanged(_index);
                    }
                    else {
                        for (var i = 0; i < this.frontButtons.length; i++) {
                            if (i <= _index) {
                                this.frontButtons[i].classList.add("active");
                            }
                            else {
                                this.frontButtons[i].classList.remove("active");
                            }
                        }
                        this.parent.frontLightsChanged(_index + 1);
                    }
                };
                CardControls.prototype.closeXClick = function (ev) {
                    this.parent.exitSection();
                };
                return CardControls;
            }());
            exports.default = CardControls;


            /***/
}),
/* 32 */
/***/ (function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var Nav = /** @class */ (function () {
                function Nav(_parent) {
                    this.parentControls = _parent;
                    this.navBox = document.getElementById("navBox");
                    this.navInner = document.getElementById("navInner");
                    this.navShow = document.getElementById("navShow");
                    this.navItems = document.getElementsByClassName("navItem");
                    this.disclaimer = document.getElementById("disclaimer");
                    this.navInner.style.opacity = "1";
                    this.navInner.style.display = "block";
                    this.navShow.style.transform = "scale(1.0)";
                    this.disclaimer.classList.add("enabled");
                    this.activeSection = -1;
                    for (var i = 0; i < this.navItems.length; i++) {
                        this.navItems[i].addEventListener("click", this.navClick.bind(this, i), false);
                    }
                    this.navShow.addEventListener("click", this.mobileNavShow.bind(this), false);
                    // Exit buttons
                    document.getElementById("reserveBut").addEventListener("click", this.exitBtnClick.bind(this, 0), false);
                    document.getElementById("Twitter").addEventListener("click", this.exitBtnClick.bind(this, 1), false);
                    document.getElementById("Facebook").addEventListener("click", this.exitBtnClick.bind(this, 2), false);
                    document.getElementById("LinkedIn").addEventListener("click", this.exitBtnClick.bind(this, 3), false);
                    document.getElementById("subscribeBut").addEventListener("click", this.exitBtnClick.bind(this, 4), false);
                    // Avoid pinch-zoom on iOS devices
                    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                        this.navBox.addEventListener("touchmove", function (evt) {
                            if (evt.touches.length > 1) {
                                evt.preventDefault();
                            }
                        });
                        this.navShow.addEventListener("touchmove", function (evt) {
                            evt.preventDefault();
                        }, false);
                    }
                }
                Nav.prototype.exitBtnClick = function (_i, evt) {
                    var url;
                    var lang = window["language"];
                    var labelGA;
                    switch (_i) {
                        case 0:
                            if (lang === "us") {
                                url = "https://www.ff.com/us/reserve/";
                            }
                            else {
                                url = "https://reserve-cn.ff.com/cn/reserve/";
                            }
                            labelGA = "reserve button";
                            break;
                        case 1:
                            url = "https://twitter.com/share?url=https://3d.ff.com&text=Check out the Faraday Future FF 91 3D Tour @FaradayFuture";
                            labelGA = "twitter";
                            break;
                        case 2:
                            url = "https://www.facebook.com/sharer/sharer.php?u=https://3d.ff.com";
                            labelGA = "facebook";
                            break;
                        case 3:
                            url = "https://www.linkedin.com/shareArticle?mini=true&url=https://3d.ff.com&title=Faraday Future FF 91 3D tour&summary=Check out the Faraday Future FF 91 3D Tour";
                            labelGA = "linkedin";
                            break;
                        case 4:
                            if (lang === "us") {
                                url = "https://www.ff.com/us/newsletter-subscribe/";
                            }
                            else {
                                url = "https://www.ff.com/cn/newsletter-subscribe/";
                            }
                            labelGA = "subscribe";
                            break;
                    }
                    this.parentControls.outboundGA(labelGA);
                    window.open(url, "_blank");
                };
                Nav.prototype.navClick = function (_index, ev) {
                    // Toggle nav & button if mobile
                    this.navBox.classList.remove("visible");
                    this.navShow.classList.remove("hidden");
                    this.parentControls.mobileNavClosed();
                    if (_index === this.activeSection)
                        return null;
                    // Undo last active section
                    if (this.activeSection >= 0) {
                        this.navItems[this.activeSection].classList.remove("active");
                    }
                    // Establish new active section
                    this.activeSection = _index;
                    this.navItems[_index].classList.add("active");
                    if (this.activeSection === 4 || this.activeSection === 5) {
                        this.navBox.classList.add("inverted");
                        this.disclaimer.classList.add("inverted");
                    }
                    else {
                        this.navBox.classList.remove("inverted");
                        this.disclaimer.classList.remove("inverted");
                    }
                    this.parentControls.navClicked(_index);
                };
                Nav.prototype.mobileNavHide = function () {
                    this.navBox.classList.remove("visible");
                    this.navShow.classList.remove("hidden");
                };
                Nav.prototype.mobileNavShow = function () {
                    this.navBox.classList.add("visible");
                    this.navShow.classList.add("hidden");
                    this.parentControls.mobileNavOpened();
                };
                return Nav;
            }());
            exports.default = Nav;


            /***/
}),
/* 33 */
/***/ (function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var vShader = __webpack_require__(20);
            var fShader = __webpack_require__(19);
            // Creates repeating FF pattern on the floor
            var Floor = /** @class */ (function () {
                function Floor(_scene, _pos, _cargo) {
                    this.scene = _scene;
                    this.pos = _pos;
                    this.led = _cargo.getTexture("led");
                    this.led.minFilter = THREE.LinearFilter;
                    this.led.format = THREE.AlphaFormat;
                    var planeGeom = new THREE.PlaneGeometry(10, 10, 30, 30);
                    var planeMat = new THREE.RawShaderMaterial({
                        uniforms: {
                            led: { value: this.led },
                            origin: { value: this.pos },
                        },
                        vertexShader: vShader,
                        fragmentShader: fShader,
                        transparent: true,
                        depthWrite: false,
                        blending: THREE.MultiplyBlending
                    });
                    this.plane = new THREE.Mesh(planeGeom, planeMat);
                    this.plane.position.setY(0.01);
                    this.plane.rotateX(-Math.PI / 2);
                    this.scene.add(this.plane);
                    // this.addEdge();
                }
                Floor.prototype.addEdge = function () {
                    var edgeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
                    var edgeGeom = new THREE.PlaneGeometry(10, 10, 10, 10);
                    var edge = new THREE.Mesh(edgeGeom, edgeMat);
                    edge.rotateX(-Math.PI / 2);
                    this.scene.add(edge);
                };
                return Floor;
            }());
            exports.default = Floor;


            /***/
}),
/* 34 */
/***/ (function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var vShader = __webpack_require__(22);
            var fShader = __webpack_require__(21);
            var Grid = /** @class */ (function () {
                function Grid(scene) {
                    this.mouseActual = new THREE.Vector2(-0.2, 0.3);
                    this.mouseTarget = new THREE.Vector2(THREE.Math.randInt(-40, 40), THREE.Math.randInt(-40, 40));
                    this.tempVec = new THREE.Vector2();
                    // Define material
                    this.sprite = new THREE.TextureLoader().load("./assets/textures/led.png");
                    this.shaderMat = new THREE.RawShaderMaterial({
                        uniforms: {
                            color: { value: new THREE.Color(0xffffff) },
                            texture: { value: this.sprite },
                            vpH: { value: window.innerHeight },
                            time: { value: 0 },
                            mousePos: { value: this.mouseActual },
                            playhead: { value: 0 }
                        },
                        vertexShader: vShader,
                        fragmentShader: fShader,
                        blending: THREE.AdditiveBlending,
                        transparent: true,
                        depthTest: false
                    });
                    this.uniformVPH = this.shaderMat.uniforms.vpH;
                    this.uniformTime = this.shaderMat.uniforms.time;
                    this.uniformMouse = this.shaderMat.uniforms.mousePos;
                    this.uniformPlay = this.shaderMat.uniforms.playhead;
                    // Define buffergeometry
                    var i3 = 0;
                    var width = 80;
                    var height = 80;
                    this.vertCount = width * height;
                    this.bufferGeom = new THREE.BufferGeometry();
                    this.allPos = new Float32Array(this.vertCount * 3);
                    for (var x = 0; x < width; x++) {
                        for (var y = 0; y < height; y++ , i3 += 3) {
                            this.allPos[i3 + 0] = (x - Math.round(width / 2));
                            this.allPos[i3 + 1] = (y - Math.round(height / 2));
                            // this.allPos[i3 + 2] = 0;
                        }
                    }
                    this.bufferGeom.addAttribute("position", new THREE.BufferAttribute(this.allPos, 3));
                    this.pointsObject = new THREE.Points(this.bufferGeom, this.shaderMat);
                    this.pointsObject.scale.set(0.125, 0.125, 0.125);
                    this.pointsObject.position.z = -0.5;
                    scene.add(this.pointsObject);
                }
                ///////////////////////////// PUBLIC METHODS /////////////////////////////
                Grid.prototype.onWindowResize = function (vpW, vpH) {
                    this.uniformVPH.value = vpH;
                };
                Grid.prototype.onMouseMove = function (mouseX, mouseY) {
                    this.mouseTarget.set((mouseX - 0.5) * 80, (mouseY - 0.5) * -80);
                };
                Grid.prototype.update = function (_time, playhead) {
                    this.mouseActual.lerp(this.mouseTarget, 0.05);
                    this.uniformMouse.value = this.mouseActual;
                    this.uniformPlay.value = playhead;
                    this.uniformTime.value = _time;
                };
                return Grid;
            }());
            exports.default = Grid;


            /***/
}),
/* 35 */
/***/ (function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var shaderVert = __webpack_require__(24);
            var shaderFrag = __webpack_require__(23);
            var Skybox = /** @class */ (function () {
                function Skybox(_scene, _color) {
                    var boxGeom = new THREE.BoxBufferGeometry(1, 1, 1);
                    this.boxMat = new THREE.ShaderMaterial({
                        uniforms: {
                            tCube: { value: null },
                            tFlip: { value: -1 },
                            color: { value: _color }
                        },
                        vertexShader: shaderVert,
                        fragmentShader: shaderFrag,
                        side: THREE.BackSide,
                        depthTest: true,
                        depthWrite: false,
                        fog: false
                    });
                    var boxMesh = new THREE.Mesh(boxGeom, this.boxMat);
                    boxMesh.name = 'boxMesh'
                    boxGeom.removeAttribute('normal');
                    boxGeom.removeAttribute('uv');
                    _scene.add(boxMesh);
                    boxMesh.onBeforeRender = function (renderer, scene, camera) {
                        // boxMesh.position.copy(camera.position),会出现车和环境的旋转角度不一致 
                        this.matrixWorld.copyPosition(camera.matrixWorld);
                    };

                }
                Skybox.prototype.updateLight = function (_newVal) {
                    this.boxMat.uniforms.light.value = _newVal;
                };
                Skybox.prototype.setCubeTexture = function (_cubeTex) {
                    this.boxMat.uniforms.tCube.value = _cubeTex;
                };
                return Skybox;
            }());
            exports.default = Skybox;


            /***/
}),
/* 36 */
/***/ (function (module, exports, __webpack_require__) {

            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            var Controls_1 = __webpack_require__(4);
            // IE Polyfill
            Math.log2 = Math.log2 || function (x) { return Math.log(x) * Math.LOG2E; };
            // Declare global language for "us" and "cn" differentiation
            window["language"] = document.location.href.indexOf("/us") > -1 ? "us" : "cn";
            // Default ease
            TweenLite.defaultEase = Power2.easeInOut;
            var control;
            function initApp() {
                control = new Controls_1.default();
                lm.control = control
                render(window.performance.now());
            }
            function render(t) {
                control.update(t * 0.001);
                requestAnimationFrame(render);
            }
            initApp();


            /***/
}),
/* 37 */
/***/ (function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var Pulsegrid_1 = __webpack_require__(34);
            var utils_1 = __webpack_require__(0);
            var ViewPreload = /** @class */ (function () {
                function ViewPreload(_scene, _renderer, _cam, _vp) {
                    this.sceneWGL = _scene;
                    this.rendererWGL = _renderer;
                    this.cam = _cam;
                    this.vp = _vp;
                    this.prog = 0;
                    this.progTarget = 1;
                    this.mouse = new THREE.Vector2();
                    this.grid = new Pulsegrid_1.default(this.sceneWGL);
                }
                // User moves mouse
                ViewPreload.prototype.onMouseMove = function (event) {
                    this.mouse.x = utils_1.normalize(event.clientX, 0, this.vp.x);
                    this.mouse.y = utils_1.normalize(event.clientY, 0, this.vp.y);
                    this.grid.onMouseMove(this.mouse.x, this.mouse.y);
                };
                ViewPreload.prototype.onWindowResize = function (_vp) {
                    this.vp.copy(_vp);
                    this.grid.onWindowResize(this.vp.x, this.vp.y);
                };
                ViewPreload.prototype.exitAnimation = function (_callback) {
                    TweenLite.to(this, 2.0, {
                        progTarget: -0.2, ease: Power2.easeInOut, onComplete: function () {
                            this.sceneWGL.children = [];
                            _callback();
                        }.bind(this)
                    });
                };
                ViewPreload.prototype.update = function (_time) {
                    this.prog = utils_1.zTween(this.prog, this.progTarget, _time * 0.01);
                    this.grid.update(_time, this.prog);
                    this.cam.update();
                    this.rendererWGL.render(this.sceneWGL, this.cam.camera);
                    return true;
                };
                return ViewPreload;
            }());
            exports.default = ViewPreload;


            /***/
}),
/* 38 */
/***/ (function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            // Card stuff
            var Card_1 = __webpack_require__(30);
            var CardProps = __webpack_require__(2);
            // Car stuff
            var Props_1 = __webpack_require__(1);
            var Body_1 = __webpack_require__(26);
            // Environment
            var Floor_1 = __webpack_require__(33);
            var Skybox_1 = __webpack_require__(35);
            var ViewTour = /** @class */ (function () {
                function ViewTour(_scene, _renderer, _cam, _vp) {
                    this.sceneWGL = _scene;
                    this.rendererWGL = _renderer;
                    // CSS Scene setup
                    this.sceneCSS = new THREE.Scene();
                    this.sceneCSS.name = 'sceneCSS'
                    this.rendererCSS = new THREE.CSS3DRenderer();
                    this.rendererCSS.setSize(_vp.x, _vp.y);
                    document.getElementById("CSSCanvas").appendChild(this.rendererCSS.domElement);
                    var camOptions = {
                        distance: 6,
                        focusPos: { x: 0, y: 1.0, z: 0 },
                        rotation: { x: -90, y: 0 },
                        distRange: { max: 7, min: 5 },
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
                    this.mobileView = (_vp.x <= _vp.y * 1.2) ? true : false;
                    this.sectionPrev = this.sectionActive = -1;
                    this.card = new Card_1.default(this.sceneCSS);
                    this.carProps = new Props_1.CarProps();
                    this.dirLight = new THREE.DirectionalLight(0x000000, 0.7);
                    this.dirLight.name = 'dirLight'
                    this.dirLight.position.set(0, 1, 1);
                    this.sceneWGL.add(this.dirLight);
                    this.ambLight = new THREE.AmbientLight(0x000000, 0.5);
                    this.ambLight.name = 'ambLight'
                    this.sceneWGL.add(this.ambLight);
                    this.skybox = new Skybox_1.default(this.sceneWGL, this.dirLight.color);
                }
                /////////////////////////////////////// PRIVATE EVENTS ////////////////////////////////////////
                // Changes camera properties to those outlined in sectProps
                ViewTour.prototype.moveCamera = function (_cardProps) {
                    if (this.sectionActive === -1)
                        return;
                    var targetAX = this.cam.rotActual.x;
                    var targetAY = Math.max(this.cam.rotActual.y, 0);
                    var minY = 0;
                    // Change target angles if defined
                    if (_cardProps.camRot !== undefined) {
                        targetAY = _cardProps.camRot.y;
                        minY = targetAY < 0 ? targetAY : 0;
                        var angleXDist = THREE.Math.euclideanModulo(_cardProps.camRot.x - this.cam.rotActual.x + 180, 360) - 180;
                        targetAX += (angleXDist < -180) ? angleXDist + 360 : angleXDist;
                    }
                    // Animate angles if changed
                    if (targetAX !== this.cam.rotActual.x || targetAY !== this.cam.rotActual.y) {
                        TweenLite.to(this.cam.rotTarget, 2, { x: targetAX, y: targetAY });
                    }
                    var range = _cardProps.camRotRange;
                    // Limit range when defined
                    if (range !== undefined) {
                        this.cam.setRotRange(targetAX + range.x, targetAX - range.x, Math.min(targetAY + range.y, 90), Math.max(targetAY - range.y, minY));
                    } // Otherwise, free range
                    else {
                        this.cam.setRotRange(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 90, 0);
                    }
                    // Set camera origin position
                    TweenLite.to(this.cam.focusTarget, 2, _cardProps.camPos);
                    TweenLite.to(this.cam, 2, {
                        distTarget: _cardProps.camDist, onComplete: function () {
                            this.cam.setDistRange(_cardProps.camDist + 1, _cardProps.camDist - 1);
                        }.bind(this)
                    });
                };
                /////////////////////////////////////// PUBLIC EVENTS ////////////////////////////////////////
                // Initialize car and intro animation
                ViewTour.prototype.initMeshes = function (_cargo) {
                    var xrayMesh = _cargo.getMesh("xrays");
                    this.car = new Body_1.default(this.sceneWGL, _cargo);
                    this.floor = new Floor_1.default(this.sceneWGL, this.carProps.pos, _cargo);
                    this.skybox.setCubeTexture(_cargo.getCubeTexture("envSkybox"));
                    var freeProps = this.mobileView ? CardProps.Mobile[7] : CardProps.Desktop[7];
                    TweenLite.to(this.dirLight.color, 3, { r: 1, g: 1, b: 1 });
                    TweenLite.to(this.ambLight.color, 3, { r: 1, g: 1, b: 1 });
                    TweenLite.to(this.cam.rotTarget, 3, { x: -125, y: 5 });
                    TweenLite.to(this.cam.focusTarget, 3, { y: freeProps.camPos.y });
                    TweenLite.to(this.cam, 3, { distTarget: freeProps.camDist });
                    this.cam.setDistRange(freeProps.camDist + 1, freeProps.camDist - 1);
                };
                // All actions to go to new section
                ViewTour.prototype.goToSection = function (index) {
                    var sectProps = this.mobileView ? CardProps.Mobile[index] : CardProps.Desktop[index];
                    this.sectionPrev = this.sectionActive;
                    this.sectionActive = index;
                    if (sectProps.inverted === true) {
                        TweenLite.to(this.dirLight.color, 1, { r: 0.063, g: 0.075, b: 0.094 });
                        TweenLite.to(this.ambLight.color, 1, { r: 0.063, g: 0.075, b: 0.094 });
                    }
                    else {
                        TweenLite.to(this.dirLight.color, 1, { r: 1, g: 1, b: 1 });
                        TweenLite.to(this.ambLight.color, 1, { r: 1, g: 1, b: 1 });
                    }
                    if (this.sectionPrev === 1) {
                        this.car.carBatts.hide();
                    }
                    else if (this.sectionPrev === 2) {
                        this.car.carMotors.hide();
                    }
                    switch (index) {
                        case 0: // Dimensions
                            break;
                        case 1: // Battery
                            this.car.carBatts.show();
                            break;
                        case 2: // Powertrain
                            this.car.carMotors.show();
                            break;
                        case 3: // 4-wheel steering
                        case 4: // Front
                        case 5: // Rear
                            TweenLite.to(this.carProps, 3, { speed: 0, ease: Power2.easeOut });
                            break;
                        case 6: // Aerodynamics
                            break;
                        case 7: // Free viewing
                            this.card.hide();
                            break;
                    }
                    this.card.show(index, sectProps);
                    this.moveCamera(sectProps);
                };
                ViewTour.prototype.enterFreeDriving = function (sectProps) {
                    // this.cam.distTarget = sectProps.camDist;
                    TweenLite.to(this.cam.focusTarget, 1, sectProps.camPos);
                    // TweenLite.to(this.cam, 1, {distTarget: sectProps.camDist});
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
                    this.rendererCSS.setSize(_vp.x, _vp.y);
                    if (this.sectionActive === -1)
                        return;
                    // Update view props if needed
                    if (_vp.x <= _vp.y * 1.2 && this.mobileView !== true) {
                        this.mobileView = true;
                        this.moveCamera(CardProps.Mobile[this.sectionActive]);
                        this.card.setPosition(CardProps.Mobile[this.sectionActive].position);
                    }
                    else if (_vp.x > _vp.y * 1.2 && this.mobileView !== false) {
                        this.mobileView = false;
                        this.moveCamera(CardProps.Desktop[this.sectionActive]);
                        this.card.setPosition(CardProps.Desktop[this.sectionActive].position);
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
                    this.dirLight.position.copy(this.cam.camera.position);
                    this.dirLight.position.multiplyScalar(0.5);
                    this.dirLight.position.y += 1;
                    this.rendererWGL.render(this.sceneWGL, this.cam.camera);
                    this.cam.camera.position.multiplyScalar(CardProps.GOLDEN_RATIO);
                    this.rendererCSS.render(this.sceneCSS, this.cam.camera);
                    return true;
                };
                return ViewTour;
            }());
            exports.default = ViewTour;


            /***/
}),
/* 39 */
/***/ (function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            /*
            
            eventCategory : the object that was interacted with (e.g. 'Video')
            eventAction : The type of interaction (e.g. play, click)
            eventLabel : Useful for categorizing events (e.g. 'Fall Campaign')
            
            */
            var Analytics = /** @class */ (function () {
                function Analytics(_key) {
                    this.key = _key;
                    // Build queue
                    window.ga = window.ga || function () {
                        (window.ga.q = window.ga.q || []).push(arguments);
                    };
                    window.ga.l = +new Date();
                    // Create tracker
                    window.ga('create', this.key, 'auto');
                    window.ga('require', 'displayfeatures');
                    // Send first pageview
                    window.ga('send', 'pageview');
                    this.params = {};
                }
                // For simple UI events, such as button clicks or knob moves
                Analytics.prototype.uiEvent = function (_action, _label) {
                    this.params = {
                        hitType: 'event',
                        eventCategory: 'UI Events',
                        eventAction: _action
                    };
                    if (_label !== undefined) {
                        this.params.eventLabel = _label;
                    }
                    this.send(this.params);
                };
                // Whenever a new "page" is viewed: battery, powertrain, lighting, etc
                Analytics.prototype.pageView = function (_page) {
                    this.params = {
                        hitType: 'pageview',
                        page: _page
                    };
                    this.send(this.params);
                };
                // When clicking an outbound link
                Analytics.prototype.outbound = function (_location) {
                    this.params = {
                        hitType: 'event',
                        eventCategory: 'Social Share Link',
                        eventAction: 'click',
                        eventLabel: _location
                    };
                    this.send(this.params);
                };
                // Finally, we send parameters to Google Analytics
                Analytics.prototype.send = function (_params) {
                    window.ga('send', _params);
                };
                return Analytics;
            }());
            exports.default = Analytics;


            /***/
}),
/* 40 */
/***/ (function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var Cargo = /** @class */ (function () {
                function Cargo() {
                }
                ///// SETTERS /////
                Cargo.prototype.addAsset = function (name, asset) {
                    if (this[name] === undefined) {
                        this[name] = asset;
                        return true;
                    }
                    return false;
                };
                ///// GETTERS /////
                Cargo.prototype.getMesh = function (name) {
                    return (this[name] !== undefined) ? this[name] : null;
                };
                Cargo.prototype.getTexture = function (name) {
                    return (this[name] !== undefined) ? this[name] : null;
                };
                Cargo.prototype.getCubeTexture = function (name) {
                    return (this[name] !== undefined) ? this[name] : null;
                };
                return Cargo;
            }());
            exports.Cargo = Cargo;
            // Takes a manifesto of assets, reports progress, & calls complete
            var AssetLoader = /** @class */ (function () {
                function AssetLoader(_path, _manifesto, _callback) {
                    this.path = _path;
                    this.manifesto = _manifesto;
                    this.callback = _callback;
                    window["language"] = document.location.href.indexOf("/us") > -1 ? "us" : "cn";
                    this.cargo = new Cargo();
                    this.assetCount = 0;
                    this.assetTotal = _manifesto.length;
                    this.loaderText = new THREE.TextureLoader();
                    this.loaderMesh = new THREE.ObjectLoader();
                    this.loaderCube = new THREE.CubeTextureLoader();
                    this.container = document.getElementById("preloader");
                    this.progBar = document.getElementById("preProg");
                    this.detailBox = document.getElementById("preDetail");
                }
                /////////////////////////////////////// LOADING PROGRESS ////////////////////////////////////////
                // 01. start loading
                AssetLoader.prototype.start = function () {
                    this.container.className = "visible";
                    if (window["language"] === "us") {
                        this.detailBox.innerHTML = "Loading assets";
                    }
                    else {
                        this.detailBox.innerHTML = "加载中";
                    }
                    var ext;
                    var _loop_1 = function (i) {
                        ext = "." + this_1.manifesto[i].ext;
                        switch (this_1.manifesto[i].type) {
                            case "texture":
                                this_1.loaderText.load(this_1.path + "textures/" + this_1.manifesto[i].name + ext, 
                                function (_obj) { 
                                    this.assetAquired(_obj, this.manifesto[i].name); }.bind(this_1), undefined, 
                                    function (_err) { this.assetFailed(_err, this.manifesto[i].name); 
                                }.bind(this_1));
                                break;

                            case "mesh":
                                this_1.loaderMesh.load(this_1.path + "meshes/" + this_1.manifesto[i].name + ".json", 
                                function (_obj) { 
                                    this.assetAquired(_obj, this.manifesto[i].name); }.bind(this_1), undefined, 
                                    function (_err) { this.assetFailed(_err, this.manifesto[i].name); 
                                }.bind(this_1));
                                break;

                            case "cubetexture":
                                this_1.loaderCube.setPath(this_1.path + "textures/" + this_1.manifesto[i].name + "/");
                                this_1.loaderCube.load(["xp" + ext, "xn" + ext, "yp" + ext, "yn" + ext, "zp" + ext, "zn" + ext], 
                                function (_obj) { 
                                    this.assetAquired(_obj, this.manifesto[i].name);
                                 }.bind(this_1), undefined, function (_err) { this.assetFailed(_err, this.manifesto[i].name); }.bind(this_1));
                                break;
                        }
                    };
                    var this_1 = this;
                    for (var i = 0; i < this.assetTotal; i++) {
                        _loop_1(i);
                    }
                };
                AssetLoader.prototype.remove = function () {
                    this.container.className = "";
                };
                // 02. When asset is successfully loaded
                AssetLoader.prototype.assetAquired = function (_obj, _name) {
                    this.cargo.addAsset(_name, _obj);
                    this.assetCount++;
                    this.pct = this.assetCount / this.assetTotal;
                    this.progBar.style.width = (this.pct * 100) + "%";
                    if (this.assetCount == this.assetTotal) {
                        this.complete();
                    }
                };
                // 03. When asset fails loading
                AssetLoader.prototype.assetFailed = function (_err, _name) {
                    this.assetCount++;
                    this.pct = this.assetCount / this.assetTotal;
                    if (this.assetCount == this.assetTotal) {
                        this.complete();
                    }
                };
                // 04. When all assets are loaded.
                AssetLoader.prototype.complete = function () {
                    // Start the tour immediately
                    this.container.classList.remove("visible");
                    this.callback(this.cargo);
                };
                return AssetLoader;
            }());
            exports.AssetLoader = AssetLoader;


            /***/
}),
/* 41 */
/***/ (function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var CamControl = /** @class */ (function () {
                function CamControl(_options) {
                    this.forceUpdate = true;
                    // Default options
                    this.options = {
                        distance: 90,
                        focusPos: new THREE.Vector3(),
                        rotation: new THREE.Vector3(),
                        rotRange: {
                            xMax: Number.POSITIVE_INFINITY,
                            xMin: Number.NEGATIVE_INFINITY,
                            yMax: 90,
                            yMin: -90,
                        },
                        distRange: {
                            max: Number.POSITIVE_INFINITY,
                            min: Number.NEGATIVE_INFINITY
                        },
                        fov: 45,
                        eyeSeparation: 1.5,
                        smartUpdates: false
                    };
                    this.readOptions(_options);
                    this.vpW = window.innerWidth;
                    this.vpH = window.innerHeight;
                    // Helpers to calculate rotations
                    this.quatX = new THREE.Quaternion();
                    this.quatY = new THREE.Quaternion();
                    this.camHolder = new THREE.Object3D();
                    this.gyro = {
                        orient: 0
                    };
                    // Set default orientation for accelerator rotations
                    if (window.orientation !== undefined) {
                        this.defaultEuler = new THREE.Euler(90 * CamControl.RADIANS, 180 * CamControl.RADIANS, (180 + parseInt(window.orientation.toString(), 10)) * CamControl.RADIANS);
                    }
                    else {
                        this.defaultEuler = new THREE.Euler(0, 0, 0);
                    }
                }
                CamControl.prototype.readOptions = function (_options) {
                    // Replace defaults with custom options
                    var opt = this.options;
                    for (var key in _options) {
                        if (key === "rotRange") {
                            for (var key in _options.rotRange) {
                                opt.rotRange[key] = _options.rotRange[key];
                            }
                        }
                        else if (key === "distRange") {
                            for (var key in _options.distRange) {
                                opt.distRange[key] = _options.distRange[key];
                            }
                        }
                        else if (key === "focusPos") {
                            for (var key in _options.focusPos) {
                                opt.focusPos[key] = _options.focusPos[key];
                            }
                        }
                        else if (key === "rotation") {
                            for (var key in _options.rotation) {
                                opt.rotation[key] = _options.rotation[key];
                            }
                        }
                        else {
                            opt[key] = _options[key];
                        }
                    }
                    // Set attributes from options
                    this.distActual = opt.distance;
                    this.distTarget = opt.distance;
                    this.focusActual = new THREE.Vector3(opt.focusPos.x, opt.focusPos.y, opt.focusPos.z);
                    this.focusTarget = this.focusActual.clone();
                    this.rotActual = new THREE.Vector3(opt.rotation.x, opt.rotation.y, opt.rotation.z);
                    this.rotTarget = this.rotActual.clone();
                };
                /////////////////////////////////////// SETTERS ///////////////////////////////////////
                // Sets distance from focusPos
                CamControl.prototype.setDistance = function (dist) {
                    this.distTarget = dist;
                    this.distTarget = THREE.Math.clamp(this.distTarget, this.options.distRange.min, this.options.distRange.max);
                    this.forceUpdate = true;
                };
                CamControl.prototype.setDistRange = function (max, min) {
                    this.options.distRange.max = max;
                    this.options.distRange.min = min;
                };
                // Sets angle of rotation
                CamControl.prototype.setRotation = function (_rotX, _rotY, _rotZ) {
                    if (_rotX === void 0) { _rotX = 0; }
                    if (_rotY === void 0) { _rotY = 0; }
                    if (_rotZ === void 0) { _rotZ = 0; }
                    this.rotActual.set(_rotX, _rotY, _rotZ);
                    this.rotTarget.set(_rotX, _rotY, _rotZ);
                    this.gyro.alpha = undefined;
                    this.gyro.beta = undefined;
                    this.gyro.gamma = undefined;
                    this.forceUpdate = true;
                };
                // Sets max and min angles of orbit
                CamControl.prototype.setRotRange = function (xMax, xMin, yMax, yMin) {
                    this.options.rotRange.xMax = (xMax !== undefined) ? xMax : this.options.rotRange.xMax;
                    this.options.rotRange.xMin = (xMin !== undefined) ? xMin : this.options.rotRange.xMin;
                    this.options.rotRange.yMax = (yMax !== undefined) ? yMax : this.options.rotRange.yMax;
                    this.options.rotRange.yMin = (yMin !== undefined) ? yMin : this.options.rotRange.yMin;
                };
                // Clears rotation range restrictions
                CamControl.prototype.clearRotRange = function () {
                    this.options.rotRange.xMax = Number.POSITIVE_INFINITY;
                    this.options.rotRange.xMin = Number.NEGATIVE_INFINITY;
                    this.options.rotRange.yMax = Number.POSITIVE_INFINITY;
                    this.options.rotRange.yMin = Number.NEGATIVE_INFINITY;
                };
                // Sets focus position
                CamControl.prototype.setFocusPos = function (_posX, _posY, _posZ) {
                    if (_posX === void 0) { _posX = 0; }
                    if (_posY === void 0) { _posY = 0; }
                    if (_posZ === void 0) { _posZ = 0; }
                    this.focusActual.set(_posX, _posY, _posZ);
                    this.focusTarget.set(_posX, _posY, _posZ);
                    this.forceUpdate = true;
                };
                // Get distance
                CamControl.prototype.getDistance = function () {
                    return this.distTarget;
                };
                /////////////////////////////////////// MOTION ///////////////////////////////////////
                // Camera travels away or toward focusPos
                CamControl.prototype.dolly = function (distance) {
                    this.distTarget += distance;
                    this.distTarget = THREE.Math.clamp(this.distTarget, this.options.distRange.min, this.options.distRange.max);
                };
                // Camera orbits by an angle amount
                CamControl.prototype.orbitBy = function (angleX, angleY) {
                    // console.error(angleX, angleY)
                    this.rotTarget.x += angleX;
                    this.rotTarget.y += angleY;
                    this.rotTarget.x = THREE.Math.clamp(this.rotTarget.x, this.options.rotRange.xMin, this.options.rotRange.xMax);
                    this.rotTarget.y = THREE.Math.clamp(this.rotTarget.y, this.options.rotRange.yMin, this.options.rotRange.yMax);
                };
                // Camera orbits to an angle
                CamControl.prototype.orbitTo = function (angleX, angleY) {
                    this.rotTarget.x = angleX;
                    this.rotTarget.y = angleY;
                    this.rotTarget.x = THREE.Math.clamp(this.rotTarget.x, this.options.rotRange.xMin, this.options.rotRange.xMax);
                    this.rotTarget.y = THREE.Math.clamp(this.rotTarget.y, this.options.rotRange.yMin, this.options.rotRange.yMax);
                };
                // FocusPos moves along the XY axis
                CamControl.prototype.pan = function (distX, distY) {
                    this.focusTarget.x -= distX;
                    this.focusTarget.y += distY;
                };
                /////////////////////////////////////// DOM EVENTS ///////////////////////////////////////
                // Window resize triggered
                CamControl.prototype.onWindowResize = function (vpW, vpH) {
                    this.vpW = vpW;
                    this.vpH = vpH;
                    this.forceUpdate = true;
                };
                // Landscape-portrait change on mobile devices
                CamControl.prototype.onDeviceReorientation = function (orientation) {
                    this.gyro.orient = orientation * CamControl.RADIANS;
                    this.forceUpdate = true;
                };
                // Set accelerometer data on motion
                CamControl.prototype.onGyroMove = function (alpha, beta, gamma) {
                    var acc = this.gyro;
                    // Alpha = z axis [0 ,360]
                    // Beta = x axis [-180 , 180]
                    // Gamma = y axis [-90 , 90]
                    acc.alpha = alpha;
                    acc.beta = beta;
                    acc.gamma = gamma;
                };
                /////////////////////////////////////// UPDATES ///////////////////////////////////////
                CamControl.prototype.follow = function (target) {
                    // Place camera on focus position
                    this.distTarget = THREE.Math.clamp(this.distTarget, this.options.distRange.min, this.options.distRange.max);
                    this.distActual += (this.distTarget - this.distActual) * 0.01;
                    this.focusTarget.set(target.x, target.y + 1.0, target.z + this.distActual);
                    this.focusActual.lerp(this.focusTarget, 0.01);
                    this.camHolder.position.copy(this.focusActual);
                    this.camHolder.lookAt(target);
                };
                // Checks if significant changes have taken place
                CamControl.prototype.changesOccurred = function () {
                    if (this.options.smartUpdates &&
                        this.rotActual.manhattanDistanceTo(this.rotTarget) < 0.01 &&
                        Math.abs(this.distActual - this.distTarget) < 0.01 &&
                        this.focusActual.manhattanDistanceTo(this.focusTarget) < 0.01) {
                        // No changes
                        return false;
                    }
                    return true;
                };
                // Constants
                CamControl.RADIANS = Math.PI / 180;
                CamControl.AXIS_X = new THREE.Vector3(1, 0, 0);
                CamControl.AXIS_Y = new THREE.Vector3(0, 1, 0);
                return CamControl;
            }());
            exports.default = CamControl;


            /***/
}),
/* 42 */
/***/ (function (module, exports, __webpack_require__) {

            "use strict";

            var __extends = (this && this.__extends) || (function () {
                var extendStatics = Object.setPrototypeOf ||
                    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
                return function (d, b) {
                    extendStatics(d, b);
                    function __() { this.constructor = d; }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
            })();
            Object.defineProperty(exports, "__esModule", { value: true });
            var CamControl_1 = __webpack_require__(41);
            var __1 = __webpack_require__(0);
            var Monoc = /** @class */ (function (_super) {
                __extends(Monoc, _super);
                function Monoc(options) {
                    var _this = _super.call(this, options) || this;
                    _this.camera = new THREE.PerspectiveCamera(_this.options.fov, _this.vpW / _this.vpH, 0.1, 100);
                    _this.camera.name = 'camera'
                    return _this;
                }
                /////////////////////////////////////// DOM EVENTS ///////////////////////////////////////
                // Window resize triggered
                Monoc.prototype.onWindowResize = function (vpW, vpH) {
                    _super.prototype.onWindowResize.call(this, vpW, vpH);
                    this.camera.aspect = this.vpW / this.vpH;
                    this.camera.updateProjectionMatrix();
                };
                // Called once per frame
                Monoc.prototype.update = function () {
                    if (!this.forceUpdate && !this.changesOccurred()) {
                        return false;
                    }
                    // Focus point
                    this.focusActual.lerp(this.focusTarget, 0.05);
                    this.camera.position.copy(this.focusActual);
                    // Accelerometer orientation
                    if (this.gyro.alpha && this.gyro.beta && this.gyro.gamma) {
                        // Calculate camera rotations
                        this.camera.setRotationFromEuler(this.defaultEuler);
                        this.camera.rotateZ(this.gyro.alpha * CamControl_1.default.RADIANS);
                        this.camera.rotateX(this.gyro.beta * CamControl_1.default.RADIANS);
                        this.camera.rotateY(this.gyro.gamma * CamControl_1.default.RADIANS);
                        this.camera.rotation.z += this.gyro.orient;
                    }
                    // If no accelerometer data
                    else {
                        // Rotation angles
                        this.rotActual.lerp(this.rotTarget, 0.05);
                        this.quatX.setFromAxisAngle(CamControl_1.default.AXIS_X, -THREE.Math.degToRad(this.rotActual.y));
                        this.quatY.setFromAxisAngle(CamControl_1.default.AXIS_Y, -THREE.Math.degToRad(this.rotActual.x));
                        this.quatY.multiply(this.quatX);
                        this.camera.quaternion.copy(this.quatY);
                    }
                    // Set camera distance from focus position
                    if (this.distActual !== this.distTarget) {
                        this.distActual = __1.zTween(this.distActual, this.distTarget, 0.05);
                    }
                    this.camera.translateZ(this.distActual);
                    this.forceUpdate = false;
                    return true;
                };
                return Monoc;
            }(CamControl_1.default));
            exports.default = Monoc;


            /***/
})
/******/]);
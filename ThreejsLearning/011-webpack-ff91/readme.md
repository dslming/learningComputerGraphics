### AssetLoader
根据资源路径加载。

### CameraControl
```js
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
```

### Camera
update()
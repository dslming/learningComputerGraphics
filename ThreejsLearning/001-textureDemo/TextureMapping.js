// 2019/5/30


let that = null
class TextureMapping {
  constructor(container) {
    that = this
    this.objects = []

    // render
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( this.renderer.domElement );

    // scene
    this.scene = new THREE.Scene();
    window.scene = this.scene

    // camera
    this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000);
    this.scene.add(this.camera);

    // light
    let light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 1, 1 ).normalize();
    this.scene.add(light);

    // 3D object
    this.objects.push(this.difImgBoxByUV())
    this.scene.add(this.objects[0]);

    // run
    this.run()
  }

  // 纯色的Box
  pureColorBox() {
    let geometry = new THREE.CubeGeometry( 10, 10, 10);
    let material = new THREE.MeshPhongMaterial( { ambient: 0x050505, color: 0x0033ff, specular: 0x555555, shininess: 30 } );
    let mesh = new THREE.Mesh(geometry, material );
    mesh.position.z = -50;
    mesh.position.x = -10
    return mesh
  }

  // 6个面相同的Box
  unityImgBox() {
    let geometry = new THREE.CubeGeometry( 10, 10, 10);
    var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./img/crate.jpg') } );
    let mesh = new THREE.Mesh(geometry, material );
    mesh.position.z = -50;
    mesh.position.x = 10
    return mesh
  }

  // 6个面不相同的Box
  difImgBox() {
    let geometry = new THREE.CubeGeometry( 10, 10, 10);
    var material1 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./img/crate.jpg') } );
    var material2 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./img/bricks.jpg') } );
    var material3 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./img/clouds.jpg') } );
    var material4 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./img/stone-wall.jpg') } );
    var material5 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./img/wood-floor.jpg') } );
    var material6 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./img/water.jpg') } );
    let materials = [material1, material2, material3, material4, material5, material6]
    let mesh = new THREE.Mesh(geometry, materials );
    mesh.position.z = -50;
    mesh.position.x = 0
    mesh.position.y = 10
    return mesh
  }

  // 6个面不相同的Box通过uv
  difImgBoxByUV() {
    let geometry = new THREE.CubeGeometry(10, 10, 10);
    // console.error(geometry, 'geometrygeometry')

    // 1) 加载UV贴图
    var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./img/texture-atlas.jpg') } );
    
    // 2) 创建贴图的6个子图
    var bricks = [new THREE.Vector2(0, .666), new THREE.Vector2(.5, .666), new THREE.Vector2(.5, 1), new THREE.Vector2(0, 1)];
    var clouds = [new THREE.Vector2(.5, .666), new THREE.Vector2(1, .666), new THREE.Vector2(1, 1), new THREE.Vector2(.5, 1)];
    var crate = [new THREE.Vector2(0, .333), new THREE.Vector2(.5, .333), new THREE.Vector2(.5, .666), new THREE.Vector2(0, .666)];
    var stone = [new THREE.Vector2(.5, .333), new THREE.Vector2(1, .333), new THREE.Vector2(1, .666), new THREE.Vector2(.5, .666)];
    var water = [new THREE.Vector2(0, 0), new THREE.Vector2(.5, 0), new THREE.Vector2(.5, .333), new THREE.Vector2(0, .333)];
    var wood = [new THREE.Vector2(.5, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, .333), new THREE.Vector2(.5, .333)];

    // 3) 清除现有的UV映射
    geometry.faceVertexUvs[0] = []

    // 4) 为图元指定纹理
    geometry.faceVertexUvs[0][0] = [ bricks[0], bricks[1], bricks[3] ];
    geometry.faceVertexUvs[0][1] = [ bricks[1], bricks[2], bricks[3] ];
    geometry.faceVertexUvs[0][2] = [ clouds[0], clouds[1], clouds[3] ];
    geometry.faceVertexUvs[0][3] = [ clouds[1], clouds[2], clouds[3] ];
    geometry.faceVertexUvs[0][4] = [ crate[0], crate[1], crate[3] ];
    geometry.faceVertexUvs[0][5] = [ crate[1], crate[2], crate[3] ];
    geometry.faceVertexUvs[0][6] = [ stone[0], stone[1], stone[3] ];
    geometry.faceVertexUvs[0][7] = [ stone[1], stone[2], stone[3] ];
    geometry.faceVertexUvs[0][8] = [ water[0], water[1], water[3] ];
    geometry.faceVertexUvs[0][9] = [ water[1], water[2], water[3] ];
    geometry.faceVertexUvs[0][10] = [ wood[0], wood[1], wood[3] ];
    geometry.faceVertexUvs[0][11] = [ wood[1], wood[2], wood[3] ];

    let mesh = new THREE.Mesh(geometry,  material);
    mesh.position.z = -50;
    mesh.position.x = 0
    mesh.position.y = -10
    return mesh
  }

  run() {
    that.objects.forEach(itemMesh => {      
      itemMesh.rotation.x += .02;
      itemMesh.rotation.y += .02;
    });

    that.renderer.render(that.scene, that.camera)
    requestAnimationFrame(that.run)
  }
}
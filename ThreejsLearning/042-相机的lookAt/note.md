[参考教程](https://www.scratchapixel.com/lessons/mathematics-physics-for-computer-graphics/lookat-function)

参考代码:
three.js > src > math > Matrix4.js > lookAt()
```js
lookAt: function ( eye, target, up ) {
  var te = this.elements;
  _z.subVectors( eye, target );
  if ( _z.lengthSq() === 0 ) {
    // eye and target are in the same position
    _z.z = 1;
  }
  _z.normalize();
  _x.crossVectors( up, _z );

  if ( _x.lengthSq() === 0 ) {
    // up and z are parallel
    if ( Math.abs( up.z ) === 1 ) {
      _z.x += 0.0001;
    } else {
      _z.z += 0.0001;
    }
    _z.normalize();
    _x.crossVectors( up, _z );
  }
  _x.normalize();
  _y.crossVectors( _z, _x );
  te[ 0 ] = _x.x; te[ 4 ] = _y.x; te[ 8 ] = _z.x;
  te[ 1 ] = _x.y; te[ 5 ] = _y.y; te[ 9 ] = _z.y;
  te[ 2 ] = _x.z; te[ 6 ] = _y.z; te[ 10 ] = _z.z;
  return this;
}
```

three.js > src > core > Object3D.js > lookAt()
```js
lookAt: function ( x, y, z ) {
  // This method does not support objects having non-uniformly-scaled parent(s)
  if ( x.isVector3 ) {
    _target.copy( x );
  } else {
    _target.set( x, y, z );
  }

  var parent = this.parent;
  this.updateWorldMatrix( true, false );
  _position.setFromMatrixPosition( this.matrixWorld );
  if ( this.isCamera || this.isLight ) {
    _m1.lookAt( _position, _target, this.up );
  } else {
    _m1.lookAt( _target, _position, this.up );
  }

  this.quaternion.setFromRotationMatrix( _m1 );
  if ( parent ) {
    _m1.extractRotation( parent.matrixWorld );
    _q1.setFromRotationMatrix( _m1 );
    this.quaternion.premultiply( _q1.inverse() );
  }
}
```

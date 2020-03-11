### 相机的投影矩阵

three.js > src > math > Matrix4.js > makePerspective()
```js
makePerspective: function ( left, right, top, bottom, near, far ) {
  if ( far === undefined ) {
    console.warn( 'THREE.Matrix4: .makePerspective() has been redefined and has a new signature. Please check the docs.' );
  }
  var te = this.elements;
  var x = 2 * near / ( right - left );
  var y = 2 * near / ( top - bottom );
  var a = ( right + left ) / ( right - left );
  var b = ( top + bottom ) / ( top - bottom );
  var c = - ( far + near ) / ( far - near );
  var d = - 2 * far * near / ( far - near );
  te[ 0 ] = x;	te[ 4 ] = 0;	te[ 8 ] = a;	te[ 12 ] = 0;
  te[ 1 ] = 0;	te[ 5 ] = y;	te[ 9 ] = b;	te[ 13 ] = 0;
  te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = c;	te[ 14 ] = d;
  te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = - 1;	te[ 15 ] = 0;
  return this;
}
```

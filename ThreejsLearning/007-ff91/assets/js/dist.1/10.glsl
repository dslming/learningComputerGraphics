float normFloat(float n, float minVal, float maxVal){
	return max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));
}

// Returns 1 if type matches val, 0 if not
float checkType(float type, float val){
	return step(val - 0.1, type) * step(type, val + 0.1);
}
 // 光的开关
uniform vec3 lightsT;	// Lights Turn | x: anyTurn, y: left turn, z: right turn
// 光的强度
uniform vec4 lightsS;	// Lights Stat | x: daytime, y: loBeams, z: hiBeams, w: fogs
attribute float type;
varying float wht;
varying float amb;

// z-up position because Blender is weird like that
void main() {
	vec2 posXY = vec2(position.y - 2299.0, position.z - 1355.0);
	float distOrigin = distance(posXY, vec2(0.0));   // FF Logo

	// 0: Daytime running lights
	wht = checkType(type, 0.0) * lightsS.x;
	
	// 1: nightlights
	wht += checkType(type, 1.0) * lightsS.y;
	
	// 2: high beams
	wht += checkType(type, 2.0) * lightsS.z;
	
	// 3: right turn signal
	wht += checkType(type, 3.0) * (1.0 + lightsT.x) * lightsS.x;
	amb = checkType(type, 3.0) * lightsT.z;
	
	// 4: left turn signal
	wht += checkType(type, 4.0) * (1.0 - lightsT.x) * lightsS.x;
	amb += checkType(type, 4.0) * lightsT.y;

	// 5: fog lamps
	wht += checkType(type, 5.0) * lightsS.w;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
}
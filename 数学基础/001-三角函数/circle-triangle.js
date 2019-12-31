function circletriangleMain() {
  this.version = '0.82';
  w = 440
  h = 540
  s = "";
  s += '<div style="position:relative; width:' + w + 'px; height:' + h + 'px; border: 1px solid blue; border-radius: 10px; ">';
  s += '<canvas id="canvasId" width="' + w + '" height="' + h + '" style="z-index:1;"></canvas>';
  s += '<input id="degBtn" type="button" class="togglebtn hi"  style="z-index:2; position:absolute; top:445px; left:310px; width:95px;" value="Degrees" onclick="toggleDeg()"/>';
  s += '<input id="circleBtn" type="button" class="togglebtn hi"  style="z-index:2; position:absolute; top:480px; left:10px; width:95px;" value="Circle" onclick="toggleCircle()"/>';
  s += '<input id="coordBtn" type="button" class="togglebtn lo"  style="z-index:2; position:absolute; top:445px; left:10px; width:95px;" value="Coords" onclick="toggleCoord()"/>';
  s += '<input id="quadBtn" type="button" class="togglebtn lo"  style="z-index:2; position:absolute; top:445px; left:110px; width:95px;" value="Quadrants"  onclick="toggleQuad()"/>';
  s += '<input id="angBtn" type="button" class="togglebtn lo"  style="z-index:2; position:absolute; top:445px; left:210px; width:95px;" value="Angles" onclick="toggleAngles()"/>';
  s += '<div id="warn" style="font: 10pt arial; font-weight: bold; color: #6600cc; position:absolute; bottom:3px; left:200px; text-align:center;">Values are to 3 places only</div>';
  s += '<div id="copyrt" style="font: 10px Arial; color: #6600cc; position:absolute; bottom:3px; left:1px; ">&copy; 2017 MathsIsFun.com  v' + this.version + '</div>';
  s += '</div>';
  document.write(s);
  el = document.getElementById('canvasId');
  ratio = 2;
  el.width = w * ratio;
  el.height = h * ratio;
  el.style.width = w + "px";
  el.style.height = h + "px";
  g = el.getContext("2d");
  g.setTransform(ratio, 0, 0, ratio, 0, 0);
  circleX = 210;
  circleY = 270;
  circleRadius = 150;
  angle = 1.;
  coordsQ = false;
  quadQ = false;
  anglesQ = false;
  degQ = true;
  circleQ = true;
  angles = [[0, 0, 1, "1,0", 1], [30, 1, 6, "+3+1", 1], [45, 1, 4, "+2+2", 1], [60, 1, 3, "+1+3", 1], [90, 1, 2, "0,1", 2], [120, 2, 3, "-1+3", 2], [135, 3, 4, "-2+2", 2], [150, 5, 6, "-3+1", 2], [180, 1, 1, "-1,0", 3], [210, 7, 6, "-3-1", 3], [225, 5, 4, "-2-2", 3], [240, 4, 3, "-1-3", 3], [270, 3, 2, "0,-1", 4], [300, 5, 3, "+1-3", 4], [315, 7, 4, "+2-2", 4], [330, 11, 6, "+3-1", 4], [360, 2, 1, "", 4]];
  angleBox = new TextBox(g, "Arial", 24, 100, 1, "", 170, 110, false);
  angleBox.setClr("#0000ff")
  angleTypeBox = new TextBox(g, "Arial", 24, 200, 1, "", 290, 140, true);
  el.addEventListener('touchmove', ontouchmove, false);
  el.addEventListener('mousemove', onmousemove, false);
  update();
}
function onmousemove(e) {
  var rect = el.getBoundingClientRect();
  var x0 = (e.clientX - rect.left) - circleX;
  var y0 = (e.clientY - rect.top) - circleY;
  angle = Math.atan2(-y0, x0);
  if (angle < 0)
    angle += 2 * Math.PI;
  update();
}
; function ontouchmove(evt) {
  var touch = evt.targetTouches[0];
  evt.clientX = touch.clientX;
  evt.clientY = touch.clientY;
  evt.touchQ = true;
  onmousemove(evt);
  evt.preventDefault();
}
; function toggleCoord() {
  coordsQ = !coordsQ;
  toggleBtn("coordBtn", coordsQ)
  update();
}
function toggleQuad() {
  quadQ = !quadQ;
  toggleBtn("quadBtn", quadQ)
  update();
}
function toggleAngles() {
  anglesQ = !anglesQ;
  toggleBtn("angBtn", anglesQ)
  update();
}
function toggleDeg() {
  if (degQ) {
    degQ = false;
    document.getElementById("degBtn").value = "Radians"
  } else {
    degQ = true;
    document.getElementById("degBtn").value = "Degrees"
  }
  update();
}
function toggleCircle() {
  if (circleQ) {
    circleQ = false;
    document.getElementById("circleBtn").value = "Compass"
  } else {
    circleQ = true;
    document.getElementById("circleBtn").value = "Circle"
  }
  update();
}
function toggleBtn(btn, onq) {
  if (onq) {
    document.getElementById(btn).classList.add("hi");
    document.getElementById(btn).classList.remove("lo");
  } else {
    document.getElementById(btn).classList.add("lo");
    document.getElementById(btn).classList.remove("hi");
  }
}
function update() {
  HiGraphics.clear(el);
  drawAngle();
  if (circleQ) {
    drawRing("circle");
  } else {
    drawRing("compass");
  }
  if (coordsQ)
    drawCoords()
  if (quadQ)
    drawQuadrants()
  if (anglesQ)
    drawAngles()
}
function doAngle() {
  angle += 0.01;
  if (angle > 1)
    clearInterval(id);
  drawAngle();
}
function drawQuadrants() {
  var quadrants = [["I", 1, 1], ["II", -1, 1], ["III", -1, -1], ["IV", 1, -1]]
  for (var i = 0; i < 4; i++) {
    g.font = "29px Arial";
    g.textAlign = "center";
    g.fillStyle = "#aaaaaa";
    g.fillText(quadrants[i][0], circleX + quadrants[i][1] * 50, circleY - quadrants[i][2] * 50);
  }
}
function drawAngle() {
  var cosClr = "#0000ff";
  var sinClr = "#44dd44";
  var tanClr = "#ff4444";
  var cirClr = "#ff00ff";
  var lowClr = "#aaaaaa";
  angleSnap = Math.floor(angleDeg(angle, true));
  angle = angleSnap * Math.PI / 180.;
  cX = Math.cos(angle) * circleRadius;
  cY = -Math.sin(angle) * circleRadius;
  tanLen = -Math.tan(angle) * circleRadius;
  var fs = [to3Dig(Math.sin(angle)), to3Dig(Math.cos(angle)), to3Dig(Math.tan(angle))];
  if (angleSnap % 90 == 0) {
    switch (angleSnap) {
      case 0:
        fs = [0, 1, 0];
        break;
      case 90:
        fs = [1, 0, "undefined"];
        break;
      case 180:
        fs = [0, -1, 0];
        break;
      case 270:
        fs = [-1, 0, "undefined"];
        break;
      case 360:
        fs = [0, 1, 0];
        break;
      default:
    }
  }
  var angDisplay = "";
  if (!degQ) {
    angDisplay = to3Dig(angle);
  } else {
    angDisplay = angleSnap + "°";
  }
  g.font = "18px Arial";
  g.textAlign = "center";
  g.fillStyle = cosClr;
  g.fillText("cos(" + angDisplay + ") = " + fs[1], w / 2, 20, w);
  g.fillStyle = sinClr;
  g.fillText("sin(" + angDisplay + ") = " + fs[0], w / 2, 45, w);
  g.fillStyle = tanClr;
  g.fillText("tan(" + angDisplay + ") = " + fs[2], w / 2, 70, w);
  g.lineJoin = "round";
  g.beginPath();
  g.lineWidth = 2;
  g.strokeStyle = lowClr;
  g.moveTo(circleX, circleY);
  g.lineTo(circleX + cX, circleY + cY);
  g.stroke();
  g.beginPath();
  g.lineWidth = 1;
  g.strokeStyle = cirClr;
  g.moveTo(circleX, circleY + circleRadius + 10);
  g.lineTo(circleX, circleY - circleRadius - 10);
  g.moveTo(circleX + circleRadius + 10, circleY);
  g.lineTo(circleX - circleRadius - 10, circleY);
  g.stroke();
  HiGraphics.lineStyle(2, lowClr, 1);
  switch (angleSnap) {
    case 90:
      HiGraphics.drawBox(g, circleX, circleY - 25, 25, 0);
      break;
    case 360:
      HiGraphics.drawArc(g, circleX, circleY, 30, 0, Math.PI * 2);
      break;
    default:
      HiGraphics.drawArc(g, circleX, circleY, 30, -angle, 0);
  }
  g.beginPath();
  g.lineWidth = 2;
  g.strokeStyle = cosClr;
  g.moveTo(circleX, circleY);
  g.lineTo(circleX + cX, circleY);
  g.stroke();
  g.closePath();
  g.fillStyle = sinClr;
  g.fillText(fs[0], circleX + cX + 5, circleY + cY / 2);
  g.fillStyle = cosClr;
  g.fillText(fs[1], circleX + cX / 2, circleY);
  g.beginPath();
  g.lineWidth = 2;
  g.strokeStyle = sinClr;
  g.moveTo(circleX + cX, circleY);
  g.lineTo(circleX + cX, circleY + cY);
  g.stroke();
  g.closePath();
  g.beginPath();
  g.lineWidth = 2;
  g.strokeStyle = tanClr;
  g.moveTo(circleX + cX, circleY + cY);
  g.lineTo(circleX + cX - tanLen * Math.sin(angle), circleY);
  g.stroke();
  g.closePath();
}
function angleDeg(angleRad, snap90sQ) {
  var angle = angleRad * 180. / Math.PI;
  if (snap90sQ) {
    if (angle <= 1 || angle >= 359)
      angle = 360;
    if (angle >= 89 && angle < 92)
      angle = 90;
    if (angle >= 179 && angle < 182)
      angle = 180;
    if (angle >= 269 && angle < 272)
      angle = 270;
  }
  return angle;
}
function angleName(angleRad) {
  s = "";
  var angDeg = angleDeg(angleRad, true);
  angDeg = Math.floor(angDeg);
  if (angDeg < 90) {
    s = "Acute Angle";
  }
  if (angDeg == 90) {
    s = "Right Angle";
  }
  if (angDeg > 90) {
    s = "Obtuse Angle";
  }
  if (angDeg == 180) {
    s = "Straight Angle";
  }
  if (angDeg > 180) {
    s = "Reflex Angle";
  }
  if (angDeg == 360) {
    s = "Full Rotation";
  }
  return s;
}
function drawRing(ringType) {
  switch (ringType) {
    case "circle":
      HiGraphics.lineStyle(2, "#ff00ff", 1);
      HiGraphics.drawCircle(g, circleX, circleY, circleRadius);
      break;
    case "compass":
      HiGraphics.drawCompass(g, circleX, circleY, circleRadius - 3, 6);
      break;
    default:
  }
}
function drawCoords() {
  for (i = 0; i < angles.length; i++) {
    var quadrant = angles[i][4];
    var angle = Math.PI * angles[i][1] / angles[i][2];
    var deg = angles[i][0];
    var majorQ = (deg % 90 == 0);
    if (i < angles.length - 1) {
      var angX = Math.cos(angle) * (circleRadius);
      var angY = -Math.sin(angle) * (circleRadius);
      g.fillStyle = "#000000";
      g.beginPath()
      g.arc(circleX + angX, circleY + angY, 3, 0, 2 * Math.PI);
      g.fill();
      var angX = Math.cos(angle) * (circleRadius + 22);
      var angY = -Math.sin(angle) * (circleRadius + 22);
      var coordCode = angles[i][3];
      if (majorQ) {
        g.fillStyle = "#000000";
        g.font = "15px Arial";
        g.textAlign = "center";
        g.fillText(coordCode, circleX + angX, circleY + angY);
      } else {
        currX = circleX + angX;
        currY = circleY + angY;
        switch (quadrant) {
          case 1:
            currX -= 15;
            break;
          case 2:
            currX -= 35;
            break;
          case 3:
            currX -= 55;
            break;
          case 4:
            currX -= 5;
            break;
        }
        g.fillStyle = "#000000";
        g.font = "15px Arial";
        g.textAlign = "center";
        g.fillText("(", currX, currY);
        currX += 10;
        for (var j = 0; j < 2; j++) {
          if (j > 0) {
            g.font = "15px Arial";
            g.fillText(",", currX, currY);
            currX += 12;
          }
          var pmStr = coordCode.charAt(j * 2);
          var plusQ = true;
          if (pmStr == "-") {
            plusQ = false;
            currX += 10;
          }
          var typStr = coordCode.charAt(1 + j * 2);
          var wid = 0;
          switch (typStr) {
            case "1":
              drawFrac(g, plusQ, "1", "2", currX, currY - 3)
              wid = 12;
              break;
            case "2":
              drawFrac(g, plusQ, "√2", "2", currX, currY - 3)
              wid = 12;
              break;
            case "3":
              drawFrac(g, plusQ, "√3", "2", currX, currY - 3)
              wid = 12;
              break;
            default:
          }
          currX += wid;
        }
        g.font = "15px Arial";
        g.fillText(")", currX, circleY + angY);
      }
    }
  }
}
function drawAngles() {
  for (i = 0; i < angles.length; i++) {
    var quadrant = angles[i][4];
    var angle = Math.PI * angles[i][1] / angles[i][2];
    var deg = angles[i][0];
    var majorQ = (deg % 90 == 0);
    if (i < angles.length - 1) {
      var angX = Math.cos(angle) * (circleRadius);
      var angY = -Math.sin(angle) * (circleRadius);
      g.fillStyle = "#000000";
      g.beginPath()
      g.arc(circleX + angX, circleY + angY, 3, 0, 2 * Math.PI);
      g.fill();
      var angX = Math.cos(angle) * (circleRadius - 22);
      var angY = -Math.sin(angle) * (circleRadius - 22);
      if (degQ) {
        g.fillStyle = "#000000";
        g.font = "15px Arial";
        g.textAlign = "center";
        g.fillText(deg.toString() + "°", circleX + angX, circleY + angY + 5);
      } else {
        numer = angles[i][1];
        denom = angles[i][2];
        if (numer == "1")
          numer = ""
        if (numer != "0")
          numer += "π";
        if (denom == "1") {
          g.fillStyle = "#000000";
          g.font = "15px Arial";
          g.textAlign = "center";
          g.fillText(numer, circleX + angX, circleY + angY);
        } else {
          drawFrac(g, true, numer, denom, circleX + angX, circleY + angY)
        }
      }
    }
  }
}
function drawFrac(g, plusQ, numer, denom, xp, yp) {
  g.fillStyle = "#000000";
  g.font = "17px Arial";
  g.textAlign = "center";
  if (plusQ) { } else {
    g.fillText("-", xp - 14, yp + 4);
  }
  g.font = "12px Arial";
  var up = 3
  var dn = 12
  g.fillText(numer, xp, yp - up);
  g.fillText(denom, xp, yp + dn);
  g.strokeStyle = "#000000";
  g.beginPath()
  g.lineWidth = 1;
  g.moveTo(xp - 8, yp)
  g.lineTo(xp + 8, yp)
  g.stroke()
}
function to3Dig(x) {
  return Math.floor(x * 1000 + 0.5) / 1000
}
function hiGraphics() {
  lineWidth = 5;
  lineJoin = "round";
  strokeStyle = "#333";
}
hiGraphics.prototype.clear = function (el) {
  g = el.getContext("2d");
  g.clearRect(0, 0, el.width, el.height);
  return true;
}
  ;
hiGraphics.prototype.lineStyle = function (width, clr, opacity) {
  lineWidth = width;
  lineJoin = "round";
  strokeStyle = clr;
}
  ;
hiGraphics.prototype.stt = function () {
  g.beginPath();
  g.lineWidth = lineWidth;
  g.lineJoin = lineJoin;
  g.strokeStyle = strokeStyle;
}
  ;
hiGraphics.prototype.drawCircle = function (g, circleX, circleY, circleRadius) {
  this.stt();
  g.fillStyle = "#FF0000";
  g.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
  g.stroke();
  return true;
}
  ;
hiGraphics.prototype.drawCompass = function (g, circleX, circleY, tickRadius) {
  var tickLen = 15;
  for (var i = 0; i < 360; i += 15) {
    var angle = i * Math.PI / 180.;
    if (i % 90) {
      this.lineStyle(1, "#888888", 1);
    } else {
      this.lineStyle(2, "#444444", 1);
    }
    this.stt();
    var cX = circleX + Math.cos(angle) * tickRadius;
    var cY = circleY - Math.sin(angle) * tickRadius;
    g.moveTo(cX, cY);
    cX = circleX + Math.cos(angle) * (tickRadius + tickLen);
    cY = circleY - Math.sin(angle) * (tickRadius + tickLen);
    g.lineTo(cX, cY);
    g.stroke();
    cX = circleX + Math.cos(angle) * (tickRadius + tickLen + 14) + 0;
    cY = circleY - Math.sin(angle) * (tickRadius + tickLen + 14) + 5;
    g.font = "12px Arial";
    g.fillText(i + "°", cX, cY, 100);
  }
}
  ;
hiGraphics.prototype.drawArc = function (g, midX, midY, radius, fromAngle, toAngle) {
  this.stt();
  g.arc(midX, midY, radius, fromAngle, toAngle);
  g.stroke();
}
  ;
hiGraphics.prototype.drawBox = function (g, midX, midY, radius, angle) {
  this.stt();
  var pts = [[0, 0], [Math.cos(angle), Math.sin(angle)], [Math.cos(angle) + Math.cos(angle + Math.PI / 2), Math.sin(angle) + Math.sin(angle + Math.PI / 2)], [Math.cos(angle + Math.PI / 2), Math.sin(angle + Math.PI / 2)], [0, 0]];
  for (var i = 0; i < pts.length; i++) {
    if (i == 0) {
      g.moveTo(midX + radius * pts[i][0], midY + radius * pts[i][1]);
    } else {
      g.lineTo(midX + radius * pts[i][0], midY + radius * pts[i][1]);
    }
  }
  g.stroke();
}
  ;
var HiGraphics = new hiGraphics();
function TextBox(ig, ifont, ifontSize, iwd, ilines, itxt, ix, iy, iinputQ) {
  this.g = ig;
  this.font = ifont;
  this.fontSize = ifontSize;
  this.wd = iwd;
  this.lines = ilines;
  this.txt = itxt;
  this.posx = ix;
  this.posy = iy;
  this.clr = "#000000";
  this.refresh();
}
TextBox.prototype.refresh = function () {
  this.g.font = this.fontSize + "px " + this.font;
  this.g.fillStyle = this.clr;
  this.g.fillText(this.txt, this.posx, this.posy, this.wd);
}
  ;
TextBox.prototype.setText = function (itxt) {
  this.txt = itxt;
  this.refresh();
}
  ;
TextBox.prototype.setClr = function (iclr) {
  this.clr = iclr;
}
  ;

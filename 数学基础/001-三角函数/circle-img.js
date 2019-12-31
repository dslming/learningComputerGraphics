function circlesineMain() {
  w = 600;
  h = 230;
  s = "";
  s += '<div style="position:relative; width:' + w + 'px; height:' + h + 'px; border: none; margin:auto; display:block;">';
  s += '<canvas id="canvasId" width="' + w + '" height="' + h + '" style="z-index:1;"></canvas>';
  s += '<div id="copyrt" style="font: 7pt arial; font-weight: bold; color: #6600cc; position:absolute; bottom:3px; left:1px; text-align:center;">&copy; 2015 MathsIsFun.com  v 0.81</div>';
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
  circleX = 480;
  circleY = 110;
  circleRadius = 100;
  graphLt = 10;
  graphWd = 330;
  graphTp = circleY - circleRadius;
  graphHt = circleRadius * 2;
  angle = 0.;
  frame = 0;
  wait = 0;
  quadQ = false;
  anglesQ = false;
  degQ = true;
  angles = [[0, 0, 1, "1,0", 1], [30, 1, 6, "+3+1", 1], [45, 1, 4, "+2+2", 1], [60, 1, 3, "+1+3", 1], [90, 1, 2, "0,1", 2], [120, 2, 3, "-1+3", 2], [135, 3, 4, "-2+2", 2], [150, 5, 6, "-3+1", 2], [180, 1, 1, "-1,0", 3], [210, 7, 6, "-3-1", 3], [225, 5, 4, "-2-2", 3], [240, 4, 3, "-1-3", 3], [270, 3, 2, "0,-1", 4], [300, 5, 3, "+1-3", 4], [315, 7, 4, "+2-2", 4], [330, 11, 6, "+3-1", 4], [360, 2, 1, "", 4]];
  el.addEventListener('touchmove', ontouchmove, false);
  el.addEventListener('mousemove', onmousemove, false);
  id = setInterval(incrAngle, 40);
  update();
}
function incrAngle() {
  if (wait < 0) {
    wait++;
    return;
  }
  frame += 1;
  if (frame > 360) {
    frame -= 360;
  }
  angle = frame / 180. * Math.PI;
  update();
}
function onmousemove(e) {
  wait = -150;
  var rect = el.getBoundingClientRect();
  var x0 = (e.clientX - rect.left) - circleX;
  var y0 = (e.clientY - rect.top) - circleY;
  angle = Math.atan2(-y0, x0);
  if (angle < 0)
    angle += 2 * Math.PI;
  frame = parseInt(angle * 180. / Math.PI);
  update();
}
function ontouchmove(evt) {
  var touch = evt.targetTouches[0];
  evt.clientX = touch.clientX;
  evt.clientY = touch.clientY;
  evt.touchQ = true;
  onmousemove(evt);
  evt.preventDefault();
}
function update() {
  g = el.getContext("2d");
  g.clearRect(0, 0, el.width, el.height);
  drawAngle();
  drawRing("circle");
  drawSine();
  if (quadQ)
    drawQuadrants();
  if (anglesQ)
    drawAngles();
}
function drawQuadrants() {
  var quadrants = [["I", 1, 1], ["II", -1, 1], ["III", -1, -1], ["IV", 1, -1]];
  for (var i = 0; i < 4; i++) {
    g.font = "29px Arial";
    g.textAlign = "center";
    g.fillStyle = "#aaaaaa";
    g.fillText(quadrants[i][0], circleX + quadrants[i][1] * 50, circleY - quadrants[i][2] * 50);
  }
}
function drawAngle() {
  var sinClr = "#44dd44";
  var cosClr = "#0000ff";
  var tanClr = "#ff4444";
  var cirClr = "#ff00ff";
  var lowClr = "#aaaaaa";
  angleSnap = Math.floor(angleDeg(angle, false));
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
  g.beginPath();
  g.lineWidth = 2;
  g.strokeStyle = sinClr;
  g.moveTo(circleX + cX, circleY);
  g.lineTo(circleX + cX, circleY + cY);
  g.stroke();
  g.closePath();
  g.beginPath();
  g.lineWidth = 1;
  g.strokeStyle = "#ffaa77";
  g.moveTo(circleX + cX, circleY + cY);
  g.lineTo(circleX - 140, circleY + cY);
  g.arc(circleX - 140, circleY + cY, 4, 0, Math.PI * 2);
  g.stroke();
  g.closePath();
}
function drawSine() {
  g.beginPath();
  g.lineWidth = 1;
  g.strokeStyle = "#ffa500";
  g.rect(graphLt, graphTp, graphWd, graphHt);
  g.moveTo(graphLt, circleY);
  g.lineTo(graphLt + graphWd, circleY);
  g.stroke();
  g.closePath();
  g.beginPath();
  g.lineWidth = 2;
  g.strokeStyle = "#ff4444";
  for (i = graphLt; i < graphLt + graphWd; i++) {
    var sine = Math.sin(i / 25 + angle + 2.15);
    var yPos = sine * circleRadius + circleY;
    g.lineTo(i, yPos);
  }
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
function drawAngles() {
  for (i = 0; i < angles.length; i++) {
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
      angX = Math.cos(angle) * (circleRadius - 22);
      angY = -Math.sin(angle) * (circleRadius - 22);
      if (degQ) {
        g.fillStyle = "#000000";
        g.font = "15px Arial";
        g.textAlign = "center";
        g.fillText(deg.toString() + "°", circleX + angX, circleY + angY + 5);
      } else {
        numer = angles[i][1];
        denom = angles[i][2];
        if (numer == "1")
          numer = "";
        if (numer != "0")
          numer += "π";
        if (denom == "1") {
          g.fillStyle = "#000000";
          g.font = "15px Arial";
          g.textAlign = "center";
          g.fillText(numer, circleX + angX, circleY + angY);
        } else {
          drawFrac(g, true, numer, denom, circleX + angX, circleY + angY);
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
  var up = 3;
  var dn = 12;
  g.fillText(numer, xp, yp - up);
  g.fillText(denom, xp, yp + dn);
  g.strokeStyle = "#000000";
  g.beginPath();
  g.lineWidth = 1;
  g.moveTo(xp - 8, yp);
  g.lineTo(xp + 8, yp);
  g.stroke();
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

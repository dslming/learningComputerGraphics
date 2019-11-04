require('./3');
var Controls_1 = require('./4');
Math.log2 = Math.log2 || function (x) {
  return Math.log(x) * Math.LOG2E;
};
window['language'] = document.location.href.indexOf('/us') > -1 ? 'us' : 'cn';
TweenLite.defaultEase = Power2.easeInOut;
var control;
function initApp() {
  control = new Controls_1.default();
  render(window.performance.now());
}
function render(t) {
  control.update(t * 0.001);
  requestAnimationFrame(render);
}
initApp();
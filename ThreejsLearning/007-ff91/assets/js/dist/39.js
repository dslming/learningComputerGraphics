'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var Analytics = function () {
  function Analytics(_key) {
    this.key = _key;
    window.ga = window.ga || function () {
      (window.ga.q = window.ga.q || []).push(arguments);
    };
    window.ga.l = +new Date();
    window.ga('create', this.key, 'auto');
    window.ga('require', 'displayfeatures');
    window.ga('send', 'pageview');
    this.params = {};
  }
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
  Analytics.prototype.pageView = function (_page) {
    this.params = {
      hitType: 'pageview',
      page: _page
    };
    this.send(this.params);
  };
  Analytics.prototype.outbound = function (_location) {
    this.params = {
      hitType: 'event',
      eventCategory: 'Social Share Link',
      eventAction: 'click',
      eventLabel: _location
    };
    this.send(this.params);
  };
  Analytics.prototype.send = function (_params) {
    window.ga('send', _params);
  };
  return Analytics;
}();
exports.default = Analytics;
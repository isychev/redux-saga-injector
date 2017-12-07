'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.injectorSaga = exports.injectorHOC = exports.injectSagas = exports.removeSaga = undefined;

var _injector = require('./injector');

var _injectorHOC = require('./injectorHOC');

var _injectorHOC2 = _interopRequireDefault(_injectorHOC);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.removeSaga = _injector.removeSaga;
exports.injectSagas = _injector.injectSagas;
exports.injectorHOC = _injectorHOC2.default;
exports.injectorSaga = _injector.injectorSaga;
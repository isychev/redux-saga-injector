'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _injector = require('./injector');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WithAppendSagaHOC = function WithAppendSagaHOC(Component) {
  var sagasObject = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (_ReactComponent) {
    _inherits(WithAppendSaga, _ReactComponent);

    function WithAppendSaga() {
      _classCallCheck(this, WithAppendSaga);

      return _possibleConstructorReturn(this, (WithAppendSaga.__proto__ || Object.getPrototypeOf(WithAppendSaga)).apply(this, arguments));
    }

    _createClass(WithAppendSaga, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this2 = this;

        var sagaObj = Object.keys(sagasObject).reduce(function (result, sagaName) {
          var currObj = sagasObject[sagaName];
          if (currObj.saga) {
            return _extends({}, result, _defineProperty({}, sagaName, _extends({}, sagasObject[sagaName], {
              options: _extends({}, sagasObject[sagaName].options || {}, {
                sagaProps: _extends({}, (sagasObject[sagaName].options || {}).sagaProps, _this2.props)
              })
            })));
          }
          return _extends({}, result, _defineProperty({}, sagaName, {
            saga: sagasObject[sagaName],
            options: {
              sagaProps: _this2.props
            }
          }));
        }, {});

        (0, _injector.injectSagas)(sagaObj);
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        Object.keys(sagasObject).forEach(function (sagaName) {
          (0, _injector.removeSaga)(sagaName);
        });
      }
    }, {
      key: 'render',
      value: function render() {
        return _react2.default.createElement(Component, this.props);
      }
    }]);

    return WithAppendSaga;
  }(_react.Component);
};
exports.default = WithAppendSagaHOC;
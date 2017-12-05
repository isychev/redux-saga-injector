'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sagaMiddleware = exports.CANCEL_SAGA_ACTION = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.removeSaga = removeSaga;
exports.injectSagas = injectSagas;

var _reduxSaga = require('redux-saga');

var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

var _effects = require('redux-saga/effects');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Action type for cancel sga
 * @type {string}
 */

var CANCEL_SAGA_ACTION = exports.CANCEL_SAGA_ACTION = 'CANCEL_SAGA_ACTION';

/**
 * object with all sagas
 * @type {{}}
 */
var injectedSagas = {};

/**
 * default options
 * @property {Object}   DEFAULT_OPTIONS            - default options
 * @property {Boolean}  params[].options.hold      - saga cannot be cancelled, default - false
 * @property {Boolean}  params[].options.replace   - cancel the previous saga if it exists, default -true
 * @property {Boolean}  params[].options.force     - forced to add the saga, default - false
 * @property {Object}   params[].options.sagaProps - saga arguments
 * @type {{hold: boolean, replace: boolean, force: boolean}}
 * @const
 */
var DEFAULT_OPTIONS = {
  // saga cannot be cancelled, default - false
  hold: false,
  // cancel the previous saga if it exists, default -true
  replace: true,
  // forced to add the saga, default - false
  force: false,
  // saga arguments
  sagaProps: {}
};

/**
 * saga middleware
 * @type {SagaMiddleware<object>}
 */
var sagaMiddleware = exports.sagaMiddleware = (0, _reduxSaga2.default)();

/**
 * factory abortable saga
 * @param {string}   sagaName   - the name of the saga
 * @param {Function} saga       - saga function
 * @param {Object}   sagaProps  -  ssaga arguments
 * @return {Function} - return function-generator (saga)
 */

function createAbortableSaga(sagaName, saga, sagaProps) {
  return (/*#__PURE__*/regeneratorRuntime.mark(function abortableSaga() {
      var sagaTask, _ref, payload;

      return regeneratorRuntime.wrap(function abortableSaga$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _effects.fork)(saga, sagaProps);

            case 2:
              sagaTask = _context.sent;

            case 3:
              if (!true) {
                _context.next = 15;
                break;
              }

              _context.next = 6;
              return (0, _effects.take)(CANCEL_SAGA_ACTION);

            case 6:
              _ref = _context.sent;
              payload = _ref.payload;

              if (!(payload === sagaName)) {
                _context.next = 13;
                break;
              }

              injectedSagas[sagaName] = null;
              _context.next = 12;
              return (0, _effects.cancel)(sagaTask);

            case 12:
              return _context.abrupt('break', 15);

            case 13:
              _context.next = 3;
              break;

            case 15:
            case 'end':
              return _context.stop();
          }
        }
      }, abortableSaga, this);
    })
  );
}

/**
 * factory for cancel saga
 * @param {string}  sagaName  - the name of the saga
 * @return {Function} - return function-generator (saga) for cancel saga by `sagaName`
 */

function createCancelSaga(sagaName) {
  return (/*#__PURE__*/regeneratorRuntime.mark(function cancelSaga() {
      return regeneratorRuntime.wrap(function cancelSaga$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (0, _effects.put)({
                type: CANCEL_SAGA_ACTION,
                payload: sagaName
              });

            case 2:
            case 'end':
              return _context2.stop();
          }
        }
      }, cancelSaga, this);
    })
  );
}

/**
 *
 * Removes the launched saga
 * @param {string} sagaName - the name of the saga
 * @example
 * removeSaga('firstMySaga')
 * @returns {string} the name of the saga
 */

function removeSaga(sagaName) {
  var _ref2 = (injectedSagas[sagaName] || {}).options || {},
      hold = _ref2.hold;

  if (!hold) {
    sagaMiddleware.run(createCancelSaga(sagaName));
  }
}

/**
 *
 * function for inject saga
 * @param {Object}   params                     - object with saga
 * @param {Function} params[].saga              - saga function
 * @param {Object}   params[].options           - saga options
 * @param {Boolean}  params[].options.hold      - saga cannot be cancelled, default - false
 * @param {Boolean}  params[].options.replace   - cancel the previous saga if it exists, default -true
 * @param {Boolean}  params[].options.force     - forced to add the saga, default - false
 * @param {Object}   params[].options.sagaProps - saga arguments
 *
 * @example
 *  // es6
 *  injectSagas({ firstMySaga, secondMySaga});
 *  // es2015
 *  injectSagas({ firstMySaga:firstMySaga, secondMySaga:firstMySaga});
 *  // advanced parameters
 *  injectSagas({
        firstMySaga: {
            saga: firstMySaga,
            options: {
                 hold: false,    // cant cancel saga
                 replace: true,  // replace prev saga
                 force: false,   // force append saga
                 sagaProps: {},  // saga arguments
            },
        },
    });
 *
 */

function injectSagas(params) {
  Object.keys(params).forEach(function (sagaName) {
    // if params - only saga
    var onlySaga = typeof params[sagaName] === 'function';
    // get saga function
    var mergeSaga = onlySaga ? params[sagaName] : params[sagaName].saga;
    // merge options and default options
    var mergeOptions = onlySaga ? DEFAULT_OPTIONS : _extends({}, DEFAULT_OPTIONS, params[sagaName].options);
    var force = mergeOptions.force,
        replace = mergeOptions.replace,
        sagaProps = mergeOptions.sagaProps;
    // if flag replace - cancel prev saga

    var existSaga = Boolean(injectedSagas[sagaName]);
    if (replace && existSaga) {
      sagaMiddleware.run(createCancelSaga(sagaName));
    }
    // flag saga exist

    // run saga if flag force or saga not exist

    if (!existSaga || force) {
      // save saga to injectedSagas
      injectedSagas[sagaName] = {
        saga: mergeSaga,
        options: mergeOptions
      };
      // run sgag
      sagaMiddleware.run(createAbortableSaga(sagaName, mergeSaga, sagaProps));
    }
  });
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.removeSaga = removeSaga;
exports.injectSagas = injectSagas;
exports.injectorSaga = injectorSaga;

var _reduxSaga = require('redux-saga');

var _effects = require('redux-saga/effects');

var _marked = /*#__PURE__*/regeneratorRuntime.mark(watchAppendSaga),
    _marked2 = /*#__PURE__*/regeneratorRuntime.mark(watchRemoveSaga),
    _marked3 = /*#__PURE__*/regeneratorRuntime.mark(injectorSaga);

/**
 * Global emmits
 * @type {string}
 */
var globalAppendEmmit = null;
var globalRemoveEmmit = null;

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

/**
 *
 * Removes the launched saga
 * @param {string} sagaName - the name of the saga
 * @example
 * removeSaga('firstMySaga')
 * @returns {string} the name of the saga
 */

function removeSaga(sagaName) {
  var _ref = (injectedSagas[sagaName] || {}).options || {},
      hold = _ref.hold;

  if (!hold) {
    globalRemoveEmmit({ sagaName: sagaName });
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
      // cancel saga
      globalRemoveEmmit({ sagaName: sagaName });
    }
    // flag saga exist
    // run saga if flag force or saga not exist
    if (!existSaga || force) {
      // run saga
      globalAppendEmmit({ sagaName: sagaName, mergeSaga: mergeSaga, sagaProps: sagaProps, mergeOptions: mergeOptions });
    }
  });
}

/**
 * saga watcher of append saga
 */

function watchAppendSaga() {
  var chan, _ref2, sagaName, mergeSaga, sagaProps, mergeOptions;

  return regeneratorRuntime.wrap(function watchAppendSaga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _effects.call)(function () {
            return (0, _reduxSaga.eventChannel)(function (emmit) {
              globalAppendEmmit = emmit;
              return function (f) {
                return f;
              };
            });
          });

        case 2:
          chan = _context.sent;

        case 3:
          if (!true) {
            _context.next = 17;
            break;
          }

          _context.next = 6;
          return (0, _effects.take)(chan);

        case 6:
          _ref2 = _context.sent;
          sagaName = _ref2.sagaName;
          mergeSaga = _ref2.mergeSaga;
          sagaProps = _ref2.sagaProps;
          mergeOptions = _ref2.mergeOptions;

          // save saga to injectedSagas
          injectedSagas[sagaName] = {
            saga: mergeSaga,
            options: mergeOptions
          };
          _context.next = 14;
          return (0, _effects.fork)(mergeSaga, sagaProps);

        case 14:
          injectedSagas[sagaName].sagaLink = _context.sent;
          _context.next = 3;
          break;

        case 17:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked, this);
}

/**
 * saga watcher emmit of remove saga
 */

function watchRemoveSaga() {
  var chan, _ref3, _sagaName;

  return regeneratorRuntime.wrap(function watchRemoveSaga$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return (0, _effects.call)(function () {
            return (0, _reduxSaga.eventChannel)(function (emmit) {
              globalRemoveEmmit = emmit;
              return function (f) {
                return f;
              };
            });
          });

        case 2:
          chan = _context2.sent;

        case 3:
          if (!true) {
            _context2.next = 13;
            break;
          }

          _context2.next = 6;
          return (0, _effects.take)(chan);

        case 6:
          _ref3 = _context2.sent;
          _sagaName = _ref3.sagaName;
          _context2.next = 10;
          return (0, _effects.cancel)(injectedSagas[_sagaName].sagaLink);

        case 10:
          injectedSagas[_sagaName] = null;
          _context2.next = 3;
          break;

        case 13:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked2, this);
}

/**
 * root saga
 */

function injectorSaga() {
  return regeneratorRuntime.wrap(function injectorSaga$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return (0, _effects.all)([watchAppendSaga(), watchRemoveSaga()]);

        case 2:
        case 'end':
          return _context3.stop();
      }
    }
  }, _marked3, this);
}
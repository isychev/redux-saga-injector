import createSagaMiddleware from 'redux-saga';
import { take, fork, cancel, put } from 'redux-saga/effects';

/**
 * Action type for cancel sga
 * @type {string}
 */

export const CANCEL_SAGA_ACTION = 'CANCEL_SAGA_ACTION';

/**
 * object with all sagas
 * @type {{}}
 */
const injectedSagas = {};

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
const DEFAULT_OPTIONS = {
  // saga cannot be cancelled, default - false
  hold: false,
  // cancel the previous saga if it exists, default -true
  replace: true,
  // forced to add the saga, default - false
  force: false,
  // saga arguments
  sagaProps: {},
};

/**
 * saga middleware
 * @type {SagaMiddleware<object>}
 */
export const sagaMiddleware = createSagaMiddleware();

/**
 * factory abortable saga
 * @param {string}   sagaName   - the name of the saga
 * @param {Function} saga       - saga function
 * @param {Object}   sagaProps  -  ssaga arguments
 * @return {Function} - return function-generator (saga)
 */

function createAbortableSaga(sagaName, saga, sagaProps) {
  return function* abortableSaga() {
    const sagaTask = yield fork(saga, sagaProps);
    while (true) {
      const { payload } = yield take(CANCEL_SAGA_ACTION);
      if (payload === sagaName) {
        injectedSagas[sagaName] = null;
        yield cancel(sagaTask);
        break;
      }
    }
  };
}

/**
 * factory for cancel saga
 * @param {string}  sagaName  - the name of the saga
 * @return {Function} - return function-generator (saga) for cancel saga by `sagaName`
 */

function createCancelSaga(sagaName) {
  return function* cancelSaga() {
    yield put({
      type: CANCEL_SAGA_ACTION,
      payload: sagaName,
    });
  };
}

/**
 *
 * Removes the launched saga
 * @param {string} sagaName - the name of the saga
 * @example
 * removeSaga('firstMySaga')
 * @returns {string} the name of the saga
 */

export function removeSaga(sagaName) {
  const { hold } = (injectedSagas[sagaName] || {}).options || {};
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

export function injectSagas(params) {
  Object.keys(params).forEach(sagaName => {
    // if params - only saga
    const onlySaga = typeof params[sagaName] === 'function';
    // get saga function
    const mergeSaga = onlySaga ? params[sagaName] : params[sagaName].saga;
    // merge options and default options
    const mergeOptions = onlySaga
      ? DEFAULT_OPTIONS
      : { ...DEFAULT_OPTIONS, ...params[sagaName].options };
    const { force, replace, sagaProps } = mergeOptions;
    // if flag replace - cancel prev saga
    const existSaga = Boolean(injectedSagas[sagaName]);
    if (replace && existSaga) {
      sagaMiddleware.run(createCancelSaga(sagaName));
    }
    // flag saga exist

    // run saga if flag force or saga not exist

    if (!existSaga || force) {
      // save saga to injectedSagas
      injectedSagas[sagaName] = {
        saga: mergeSaga,
        options: mergeOptions,
      };
      // run sgag
      sagaMiddleware.run(createAbortableSaga(sagaName, mergeSaga, sagaProps));
    }
  });
}

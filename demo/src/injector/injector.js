import { eventChannel } from 'redux-saga';
import { take, fork, cancel, all, call } from 'redux-saga/effects';

/**
 * Global emmits
 * @type {string}
 */
let globalAppendEmmit = null;
let globalRemoveEmmit = null;

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
    globalRemoveEmmit({ sagaName });
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
      // cancel saga
      globalRemoveEmmit({ sagaName });
    }
    // flag saga exist
    // run saga if flag force or saga not exist
    if (!existSaga || force) {
      // run saga
      globalAppendEmmit({ sagaName, mergeSaga, sagaProps, mergeOptions });
    }
  });
}

/**
 * saga watcher of append saga
 */

function* watchAppendSaga() {
  const chan = yield call(() =>
    eventChannel(emmit => {
      globalAppendEmmit = emmit;
      return f => f;
    }),
  );
  while (true) {
    const { sagaName, mergeSaga, sagaProps, mergeOptions } = yield take(chan);
    // save saga to injectedSagas
    injectedSagas[sagaName] = {
      saga: mergeSaga,
      options: mergeOptions,
    };
    injectedSagas[sagaName].sagaLink = yield fork(mergeSaga, sagaProps);
  }
}

/**
 * saga watcher emmit of remove saga
 */

function* watchRemoveSaga() {
  const chan = yield call(() =>
    eventChannel(emmit => {
      globalRemoveEmmit = emmit;
      return f => f;
    }),
  );
  while (true) {
    const { sagaName } = yield take(chan);
    yield cancel(injectedSagas[sagaName].sagaLink);
    injectedSagas[sagaName] = null;
  }
}

/**
 * root saga
 */

export function* injectorSaga() {
  yield all([watchAppendSaga(), watchRemoveSaga()]);
}

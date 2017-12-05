import { take, select, put, fork, all } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { createSelector } from 'reselect';
import { injectSagas, removeSaga } from './injector/index';
/**
 * Constants
 * */
const appName = 'redux-saga-injector';
export const moduleName = 'duck';

const prefix = `${appName}/${moduleName}`;
const DEFAULT_TIMEOUT = 5000;
const DEFAULT_TEXT = `DEFAULT SAGA. I send message every ${DEFAULT_TIMEOUT /
  1000} sec`;

const DEFAULT_STATE = {
  messages: [],
  sagas: 0,
};

export const APPEND_SAGA = `${prefix}/APPEND_SAGA`;
export const REMOVE_SAGA = `${prefix}/REMOVE_SAGA`;
export const SEND_MESSAGE = `${prefix}/SEND_MESSAGE`;

/**
 * Reducer
 * */

export default (state = DEFAULT_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case SEND_MESSAGE: {
      return {
        ...state,
        messages: [...state.messages, payload],
      };
    }
    case APPEND_SAGA: {
      return {
        ...state,
        sagas: state.sagas + 1,
      };
    }
    case REMOVE_SAGA: {
      return {
        ...state,
        sagas: state.sagas - 1,
      };
    }
    default:
      return state;
  }
};

/**
 * Service function
 */
const getMessageText = count => {
  if (!count) {
    return DEFAULT_TEXT;
  }
  return `NEW SAGA № ${count}. I send message every ${DEFAULT_TIMEOUT /
    1000} sec`;
};

/**
 * Action Creators
 * */
export const appendSagaAction = () => ({
  type: APPEND_SAGA,
  payload: {
    title: 'new action',
  },
});

export const removeSagaAction = () => ({
  type: REMOVE_SAGA,
  payload: {
    title: 'LAST SAGA WAS DELETED',
  },
});
export const sendMessageAction = (text, type) => ({
  type: SEND_MESSAGE,
  payload: {
    text,
    type,
  },
});

/**
 * Selectors
 */

export const getForms = state => state && state[moduleName];
export const selectPageData = createSelector(getForms, (reducer = []) => ({
  messages: reducer.messages || [],
  sagas: reducer.sagas || 0,
}));

/**
 * Sagas
 * */

const createNewSaga = (text, type = 'light') =>
  function* newSaga() {
    while (true) {
      yield put(sendMessageAction(text, type));
      yield delay(2000);
    }
  };

export function* SagaForDynamicComponent() {
  const tempSaga = createNewSaga(
    `DYNAMIC COMPONENT SAGA. I send message every ${DEFAULT_TIMEOUT /
      1000} sec `,
    'info',
  );
  yield fork(tempSaga);
}

export function* appendNewSaga() {
  const { sagas } = yield select(selectPageData);
  const newSaga = createNewSaga(
    getMessageText(sagas),
    !sagas ? 'primary' : 'success',
  );
  const sagaName = !sagas ? 'DefaultSaga' : `newSaga${sagas}`;
  injectSagas({
    [sagaName]: newSaga,
  });
}

export const watchAppendASaga = function* rootSaga2() {
  while (true) {
    yield take(APPEND_SAGA);
    yield fork(appendNewSaga);
  }
};

export const watchRemoveASaga = function* rootSaga2() {
  while (true) {
    yield take(REMOVE_SAGA);
    const { sagas } = yield select(selectPageData);
    const sagaName = `newSaga${sagas + 1}`;
    removeSaga(sagaName);
    yield put(sendMessageAction(`SAGA ${sagaName} was DELETED`));
  }
};

export function* saga() {
  yield all([appendNewSaga(), watchAppendASaga(), watchRemoveASaga()]);
}

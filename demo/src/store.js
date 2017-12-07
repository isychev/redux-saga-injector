import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { injectSagas, injectorSaga } from './injector/index';
import createSagaMiddleware from 'redux-saga';
import mainReducer, { moduleName, saga } from './duck';

const storeFactory = () => {
  const reduxDevTools = '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__';
  const composeEnhancers = window[reduxDevTools] || compose;
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    combineReducers({ [moduleName]: mainReducer }),
    {},
    composeEnhancers(applyMiddleware(sagaMiddleware)),
  );
  sagaMiddleware.run(injectorSaga);
  sagaMiddleware.run(saga);


  window.store = store;
  return store;
};
export default storeFactory;

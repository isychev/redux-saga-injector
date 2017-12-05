import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { injectSagas, sagaMiddleware } from './injector/index';
import mainReducer, { moduleName, saga } from './duck';

const storeFactory = () => {
  const reduxDevTools = '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__';
  const composeEnhancers = window[reduxDevTools] || compose;
  const store = createStore(
    combineReducers({ [moduleName]: mainReducer }),
    {},
    composeEnhancers(applyMiddleware(sagaMiddleware)),
  );

  injectSagas({ saga });

  window.store = store;
  return store;
};
export default storeFactory;

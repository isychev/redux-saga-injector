import React, { Component as ReactComponent } from 'react';
import { removeSaga, injectSagas } from './injector';

const WithAppendSagaHOC = (Component, sagasObject = {}) =>
  class WithAppendSaga extends ReactComponent {
    componentDidMount() {
      const sagaObj = Object.keys(sagasObject).reduce((result, sagaName) => {
        const currObj = sagasObject[sagaName];
        if (currObj.saga) {
          return {
            ...result,
            [sagaName]: {
              ...sagasObject[sagaName],
              options: {
                ...(sagasObject[sagaName].options || {}),
                sagaProps: {
                  ...(sagasObject[sagaName].options || {}).sagaProps,
                  ...this.props,
                },
              },
            },
          };
        }
        return {
          ...result,
          [sagaName]: {
            saga: sagasObject[sagaName],
            options: {
              sagaProps: this.props,
            },
          },
        };
      }, {});

      injectSagas(sagaObj);
    }
    componentWillUnmount() {
      Object.keys(sagasObject).forEach(sagaName => {
        removeSaga(sagaName);
      });
    }
    render() {
      return <Component {...this.props} />;
    }
  };
export default WithAppendSagaHOC;

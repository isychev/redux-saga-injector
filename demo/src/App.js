import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';
import createStore from './store';
import { appendSagaAction, removeSagaAction, selectPageData } from './duck';
import SimpleComponent from './SimpleComponent';
import './App.css';

const store = createStore();

const MAX_MESSAGE_BLOCK_HEIGHT = 350;

const App = () => (
  <div className="App">
    <Provider store={store}>
      <PageConnect />
    </Provider>
  </div>
);

class PageComponent extends Component {
  constructor(props) {
    super(props);
    this.messageBlockRef = null;
    this.state = {
      showSimpleComponent: false,
    };
  }

  componentWillMount() {
    setTimeout(() => {
      this.setState({
        showSimpleComponent: true,
      });
    }, 1000);
  }
  componentDidUpdate() {
    if (this.messageBlockRef) {
      this.messageBlockRef.scrollTop = this.messageBlockRef.scrollHeight;
    }
  }
  render() {
    const { messages = [], appendSaga, removeSaga, sagas } = this.props;
    return (
      <div>
        <header>
          <div className="navbar navbar-dark bg-dark">
            <div className="container d-flex justify-content-between">
              <a href="#" className="navbar-brand">
                REDUX-SAGA-INJECTOR
              </a>
            </div>
          </div>
        </header>

        <main role="main">
          <section className="jumbotron text-center py-4">
            <div className="container">
              <h1 className="jumbotron-heading">Redux Saga Injector</h1>
              <p className="lead">
                A lightweight library for dynamic connections saga
              </p>
              <p className="text-muted">
                Do connect or disconnect of the Saga at any time and in any
                place
              </p>
              <p>
                <button
                  type={'button'}
                  onClick={appendSaga}
                  className="btn btn-primary btn-lg mr-3"
                >
                  Append new Saga
                </button>
                <button
                  disabled={!sagas}
                  type={'button'}
                  onClick={removeSaga}
                  className="btn btn-primary btn-lg"
                >
                  Remove last Saga
                </button>
              </p>
            </div>
          </section>
          <div>
            <div className="container">
              <div className="row">
                <div className="col-8">
                  <b>Logs</b>
                  <br />
                  <b>New Sagas:</b> {sagas}
                </div>
                <div className="col-4">
                  <b>Dynamic component</b>
                </div>
              </div>
              <div className="row">
                <div
                  className="col-8 border"
                  style={{
                    maxHeight: MAX_MESSAGE_BLOCK_HEIGHT,
                    overflowY: 'scroll',
                  }}
                  ref={ref => {
                    this.messageBlockRef = ref;
                    return ref;
                  }}
                >
                  <ul className="list-group">
                    {messages.map(({ text, type }, index) => (
                      <li
                        key={`list-group_${index + 1}`}
                        className={`list-group-item list-group-item-${type ||
                          'light'}`}
                      >
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-4 ">
                  {this.state.showSimpleComponent ? <SimpleComponent /> : null}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

PageComponent.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.any),
  sagas: PropTypes.number,
  appendSaga: PropTypes.func.isRequired,
  removeSaga: PropTypes.func.isRequired,
};
PageComponent.defaultProps = {
  messages: [],
  sagas: 0,
};

const PageConnect = connect(selectPageData, {
  appendSaga: appendSagaAction,
  removeSaga: removeSagaAction,
})(PageComponent);

export default App;

# Redux Saga Injector ([Demo](https://isychev.github.io/redux-saga-injector/))

A lightweight library for dynamic connections saga
The library provides service for quick and easy connection/disconnection of sagas anytime and anywhere in your code

## [Demo](https://isychev.github.io/redux-saga-injector/)
The [Demo](https://isychev.github.io/redux-saga-injector/) 
presents the basic features `redux-saga-injector` - connect new sagas and connect the component with the sagas


## Getting Started

### Installing


```
npm install redux-saga-injector
```

or

```
yarn add redux-saga-injector
```



## Usage

### Connect `sagaMiddleware` from `redux-saga-injector`

In normal cases, the store contains the following code
```jsx
  // store.js
  import createSagaMiddleware from 'redux-saga'
   ...
   // create the saga middleware
   const sagaMiddleware = createSagaMiddleware()
   
   // mount it on the Store
   const store = createStore(
     reducer,
     applyMiddleware(sagaMiddleware)
   )
   
   // then run the saga
   sagaMiddleware.run(mySaga)
```
To connect the `redux-saga-injector` need to get `sagaMiddleware` and `injectSagas` from the redux-saga-injector 
```jsx
  // store.js
  import {sagaMiddleware, injectSagas} from 'redux-saga-injector'
    
   // mount it on the Store
   const store = createStore(
     reducer,
     applyMiddleware(sagaMiddleware)
   )
   
   // then run the saga
   injectSagas({mySaga})
   // or
   sagaMiddleware.run(mySaga) 
```
To run the standard sagas, you can use `injectSagas` or `sagaMiddleware`

After that you can use `injectSagas` anywhere in the application. Also available `removeSaga` - functions to remove saga

### `injectSagas` and `removeSaga`
#### Connect sagas

Quick connect sagas
```jsx
import {injectSagas} from 'redux-saga-injector'

function* mySaga(){
    // ... any code
}

injectSagas({ mySaga })
```

connect sagas with options

```jsx
import {injectSagas} from 'redux-saga-injector'

function* mySaga(sagaProps){
    // sagaProps from options
    // ... any code
}

injectSagas({
  mySaga: {
    saga: mySaga,
    options: {
      hold: false,    // cant cancel saga
      replace: true,  // replace prev saga
      force: false,   // force append saga
      sagaProps: {},  // saga arguments
    },
  }
})
```
#### Remove sagas

```jsx
import {removeSaga} from 'redux-saga-injector'

const sagaName = `mySagaName`
removeSaga(sagaName)
```

### Decorator `injectorHOC`
`redux-saga-injector` provides a decorator for a component to communicate sagas with life cycle of a component

For the work of the decorator, you must perform the previous step -  to connect `sagaMiddleware` from `redux-saga-injector`

When component trigger the event `componentWillMount` will connect the list of sagas for a given component (anySaga,anySaga2)

When component trigger the event `componentWillUnmount` sagas will be automatically deleted

At the start of the saga it will be passed the component `props`


```jsx
import React from 'react'
import PropTypes from 'prop-types'
import {injectorHOC} from 'redux-saga-injector'

// simple component
const MyComponent = (props) => {
  return (
    <div>MyComponent</div>
  )
}

MyComponent.propTypes = {}
MyComponent.defaultProps = {}

// any sagas
function* anySaga(props){
    // props - props of component merge with `options.sagaProps`
    // ... any code
}
function* anySaga2(props){
    // props - props of component merge with `options.sagaProps`
    // ... any code
}


export default injectorHOC(MyComponent,{anySaga,anySaga2});

```

### injectorHOC with options

Using decorator you can pass the startup settings of the sagas
```jsx

export default injectorHOC(MyComponent,{
  anySaga:{
    saga: anySaga,
    options: {
      hold: false,    // cant cancel saga
      replace: true,  // replace prev saga
      force: false,   // force append saga
      sagaProps: {},  // saga arguments
    },
  }
});

```

### Start demo

To run the demo page locally, it is imperative that the local machine was [create-react-app](https://github.com/facebookincubator/create-react-app)

```
git clone https://isychev.github.io/redux-saga-injector/
cd redux-saga-injector
yarn start
```





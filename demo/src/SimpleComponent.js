import React from 'react';
import { injectorHOC } from './injector';
import { SagaForDynamicComponent } from './duck';

const SimpleComponent = () => (
  <div className="alert alert-primary">
    Hi!. I am a simple component with a dynamic Saga. I painted for 1 second
    after start
  </div>
);

SimpleComponent.propTypes = {};
SimpleComponent.defaultProps = {};

export default injectorHOC(SimpleComponent, { SagaForDynamicComponent });

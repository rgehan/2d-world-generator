import React from 'react';
import ReactDOM from 'react-dom';

import { generate } from './generation';
import { renderMap } from './render';

class App extends React.Component {
  canvas: HTMLCanvasElement;

  componentDidMount() {
    const { map, backgroundMap } = generate();
    const context = this.canvas.getContext('2d');
    renderMap(map, backgroundMap, context);
  }

  render() {
    return (
      <canvas ref={node => (this.canvas = node)} />
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);

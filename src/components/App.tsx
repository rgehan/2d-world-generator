import React from 'react';
import { set, debounce } from 'lodash';

import { Slider } from './Slider';
import { generate, GenerationConfiguration } from '../generation';
import { renderMap } from '../render';

import './App.scss';

export class App extends React.Component {
  state: GenerationConfiguration = {
    map: {
      size: 8,
      level: 0.5,
      roughness: 0.8,
      mapHeight: 150,
    },
    caves: {
      count: 30,
      forkCapacity: 5,
    },
    water: {
      amount: 2,
      iterations: 1000,
    },
    trees: {
      probability: 0.3,
    },
  };

  container: HTMLDivElement;

  componentDidMount() {
    this.generateAndRenderMap();

    window.addEventListener('resize', this.generateAndRenderMap);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.generateAndRenderMap);
  }

  componentDidUpdate() {
    // Re-render the map whenever the parameters change
    this.generateAndRenderMap();
  }

  generateAndRenderMap = debounce(() => {
    const config = this.state;
    const { map, backgroundMap } = generate(config);
    renderMap(map, backgroundMap, this.container);
  }, 500);

  handleChange = (name: string, value: number) => {
    const newState = set(this.state, name, value);
    this.setState(newState);
  };

  render() {
    const { map, caves, water, trees } = this.state;

    return (
      <div className="App">
        <div
          className="App__CanvasContainer"
          ref={node => (this.container = node)}
        />
        <div className="App__Controls">
          <fieldset>
            <legend>Base</legend>
            <Slider
              label="Map Size"
              value={map.size}
              min={5}
              max={10}
              name="map.size"
              onChange={this.handleChange}
            />
            <Slider
              label="Base Level"
              value={map.level}
              min={0}
              max={1}
              step={0.1}
              name="map.level"
              onChange={this.handleChange}
            />
            <Slider
              label="Roughness"
              value={map.roughness}
              min={0}
              max={1}
              step={0.1}
              name="map.roughness"
              onChange={this.handleChange}
            />
            <Slider
              label="Map Height (in blocks)"
              value={map.mapHeight}
              min={0}
              max={300}
              step={1}
              name="map.mapHeight"
              onChange={this.handleChange}
            />
          </fieldset>
          <fieldset>
            <legend>Caves</legend>
            <Slider
              label="Initial caves count"
              value={caves.count}
              min={0}
              max={100}
              step={1}
              name="caves.count"
              onChange={this.handleChange}
            />
            <Slider
              label="Caves fork capacity"
              value={caves.forkCapacity}
              min={0}
              max={10}
              step={1}
              name="caves.forkCapacity"
              onChange={this.handleChange}
            />
          </fieldset>
          <fieldset>
            <legend>Water</legend>
            <Slider
              label="Water amount"
              value={water.amount}
              min={0}
              max={5}
              step={1}
              name="water.amount"
              onChange={this.handleChange}
            />
            <Slider
              label="Water simulation iterations count"
              value={water.iterations}
              min={0}
              max={2000}
              step={250}
              name="water.iterations"
              onChange={this.handleChange}
            />
          </fieldset>
          <fieldset>
            <legend>Vegetation</legend>
            <Slider
              label="Trees probability"
              value={trees.probability}
              min={0}
              max={1}
              step={0.1}
              name="trees.probability"
              onChange={this.handleChange}
            />
          </fieldset>
        </div>
      </div>
    );
  }
}

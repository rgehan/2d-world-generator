import React from 'react';
import { isEqual, chain, debounce } from 'lodash';
import cx from 'classnames';
import queryString from 'query-string';

import { Slider } from './Slider';
import { Input } from './Input';
import { generate, GenerationConfiguration } from '../generation';
import { renderMap, removeCanvas } from '../render';

import './App.scss';

interface AppState {
  loading: boolean;
  config: GenerationConfiguration;
}

export class App extends React.Component {
  state: AppState = {
    loading: true,
    config: {
      map: {
        seed: 1337,
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

  componentDidUpdate(_: any, prevState: AppState) {
    // Re-render the map whenever the parameters change
    if (!isEqual(this.state.config, prevState.config)) {
      this.generateAndRenderMap();
    }
  }

  generateAndRenderMap = debounce(() => {
    this.setState({ loading: true });
    removeCanvas();

    setTimeout(() => {
      const { map, backgroundMap } = generate(this.state.config);
      renderMap(map, backgroundMap, this.container);

      this.setState({ loading: false });
    }, 0);
  }, 500);

  handleChange = (name: string, value: number) => {
    const newConfig = chain(this.state.config)
      .cloneDeep()
      .set(name, value)
      .value();

    // Store the new config in the queryString
    this.updateQueryString(queryString.stringify({
      config: JSON.stringify(newConfig),
    }));


    this.setState({ config: newConfig });
  };

  updateQueryString(queryString: string) {
    if (!history.pushState) {
      return;
    }

    const newUrl = `${window.location.protocol}//${window.location.host + window.location.pathname}?${queryString}`;
    history.pushState({ path: newUrl }, '', newUrl);
  }

  render() {
    const { config, loading } = this.state;
    const { map, caves, water, trees } = config;

    return (
      <div className="App container-fluid">
        <div
          className={cx(
            'row App__CanvasContainer',
            loading && 'App__CanvasContainer--Loading'
          )}
          ref={node => (this.container = node)}
        />
        <div className="row p-2 flex-row justify-content-end">
          <div className="ml-2">
            <a
              className="github-button"
              href="https://github.com/rgehan/2d-world-generator/fork"
              data-icon="octicon-repo-forked"
              data-size="large"
              data-show-count="false"
              aria-label="Fork rgehan/2d-world-generator on GitHub"
            >
              Fork
            </a>
          </div>
          <div className="ml-2">
            <a
              className="github-button"
              href="https://github.com/rgehan/2d-world-generator"
              data-icon="octicon-star"
              data-size="large"
              data-show-count="false"
              aria-label="Star rgehan/2d-world-generator on GitHub"
            >
              Star
            </a>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6 mt-4 mt-md-0">
            <h4>Base</h4>
            <Input
              label="Seed (number)"
              name="map.seed"
              value={map.seed}
              onChange={this.handleChange}
            />
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
          </div>
          <div className="col-12 col-md-6 mt-4 mt-md-0">
            <h4>Caves</h4>
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
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-12 col-md-6 mt-4">
            <h4>Water</h4>
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
          </div>
          <div className="col-12 col-md-6 mt-4">
            <h4>Vegetation</h4>
            <Slider
              label="Trees probability"
              value={trees.probability}
              min={0}
              max={1}
              step={0.1}
              name="trees.probability"
              onChange={this.handleChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

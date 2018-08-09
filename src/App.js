import React, { Component } from 'react';
import './App.css';
import { TitleScreen } from './components/TitleScreen';
const width = 800;
const height = window.innerHeight;
const ratio = window.devicePixelRatio || 1;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: {
        width,
        height,
        ratio
      }
    };
  }
  render() {
    return (
      <div>
        <TitleScreen />
        <canvas ref="canvas"
          width={ this.state.screen.width * this.state.screen.ratio }
          height={this.state.screen.height * this.state.screen.ratio } />
      </div>
    );
  }
}

export default App;

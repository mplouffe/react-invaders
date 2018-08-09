import React, { Component } from 'react';
import './App.css';
import { TitleScreen } from './ReactComponents/TitleScreen';
import GameOverScreen from './ReactComponents/GameOverScreen';
import InputManager from './InputManager';
import Ship from './GameComponents/Ship';
import Invader from './GameComponents/Invader';
import { checkCollisionsWith } from './Helper';

const width = 800;
const height = window.innerHeight;
const ratio = window.devicePixelRatio || 1;
const GameState = {
  StartScreen: 0,
  Playing: 1,
  GameOver: 2
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: new InputManager(),
      screen: {
        width,
        height,
        ratio
      },
      gameState: GameState.StartScreen,
      context: null,
      score: 0
    };
    this.ship = null;
    this.invaders = [];
    this.lastStateChange = Date.now();
  }
  render() {
    return (
      <div>
        { this.state.gameState === GameState.StartScreen &&
          <TitleScreen />
        }
        { this.state.gameState === GameState.GameOver &&
          <GameOverScreen score={this.state.score} />
        }
        <canvas ref="canvas"
          width={ this.state.screen.width * this.state.screen.ratio }
          height={ this.state.screen.height * this.state.screen.ratio } />
      </div>
    );
  }
  componentDidMount() {
    this.state.input.bindKeys();
    const context = this.refs.canvas.getContext('2d');
    this.setState({ context });
    requestAnimationFrame(() => this.update());
  }
  componentWillUnmount() {
    this.state.input.unbindKeys();
  }
  increaseScore() {
    this.setState({ score: this.state.score + 500});
  }
  update() {
    const keys = this.state.input.pressedKeys;
    if (this.state.gameState === GameState.StartScreen
        && keys.enter
        && Date.now() - this.lastStateChange > 1000) {
      this.startGame();
    }
    if (this.state.gameState === GameState.Playing) {
      this.clearBackground();
      if (this.invaders.length <= 0) {
        this.killPlayer();
      } else {
        checkCollisionsWith(this.ship.bullets, this.invaders);
        checkCollisionsWith([this.ship], this.invaders);
        for (let i = 0; i < this.invaders.length && this.ship; i++) {
          checkCollisionsWith(this.invaders[i].bullets, [this.ship]);
        }
        if (this.ship !== undefined && this.ship !== null){
          this.ship.update(keys);
          this.ship.render(this.state);
          this.renderInvaders(this.state);
        }
      }
    }
    if (this.state.gameState === GameState.GameOver && keys.enter) {
      this.setState({ gameState: GameState.StartScreen });
      this.lastStateChange = Date.now();
    }

    requestAnimationFrame(() => this.update());
  }
  killPlayer() {
    this.setState({ gameState: GameState.GameOver });
    this.ship = null;
    this.invaders = [];
  }
  startGame() {
    let ship = new Ship({
      radius: 15,
      speed: 2.5,
      onDie: this.killPlayer.bind(this),
      position: {
        x: this.state.screen.width/2,
        y: this.state.screen.height - 50
      }
    });
    this.ship = ship;
    this.createInvaders(10);
    this.setState({
      gameState: GameState.Playing,
      score: 0
    });
  }
  clearBackground() {
    const context = this.state.context;
    context.save();
    context.scale(this.state.screen.ratio, this.state.screen.ratio);
    context.fillRect(0,0,this.state.screen.width, this.state.screen.height);
    context.globalAlpha = 1;
    context.restore();
  }
  createInvaders(count) {
    const newPosition = { x: 100, y: 20 };
    let swapStartX = true;

    for(let i = 0; i < count; i++) {
      const invader = new Invader({
        position: { x: newPosition.x, y: newPosition.y },
        speed: 1,
        radius: 50,
        onDie: this.increaseScore.bind(this, false)
      });

      newPosition.x += invader.radius + 20;

      if(newPosition.x + invader.radius + 50 >= (this.state.screen.width * this.state.screen.ratio)) {
        newPosition.x = swapStartX ? 110: 100;
        swapStartX = !swapStartX;
        newPosition.y += invader.radius + 20;
      }

      this.invaders.push(invader);
    }
  }
  renderInvaders(state) {
    let index = 0;
    let reverse = false;

    for(let invader of this.invaders) {
      if (invader.delete) {
        this.invaders.splice(index, 1);
      } else if ( invader.position.x + invader.radius >= (this.state.screen.width * this.state.screen.ratio) || invader.position.x - invader.radius <= 0) {
        reverse = true;
      } else {
        this.invaders[index].update();
        this.invaders[index].render(state);
      }
      index++;
    }

    if (reverse) {
      this.reverseInvaders();
    }
  }
  reverseInvaders() {
    let index = 0;
    for (let invader of this.invaders) {
      this.invaders[index].reverse();
      this.invaders[index].position.y += 50;
      index++;
    }
  }
}

export default App;

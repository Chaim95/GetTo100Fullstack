import React, { Component } from 'react';
import confetti from "https://cdn.skypack.dev/canvas-confetti";

class Game extends Component {
  state = {
    gameOver: false,
    flashing: false
  };
  //clickSound = new Audio("/sounds.click.mp3");

  handleAction = (action) => {
    const { player, onTurnEnd, onUpdate } = this.props;
    let { number, steps, scores } = player;

    switch (action) {
      case '+1':
        number += 1;
        break;
      case '-1':
        number -= 1;
        break;
      case '*2':
        number *= 2;
        break;
      case '/2':
        number = Math.floor(number / 2);
        break;
      default:
        break;
    }

    //this.clickSound.play();
    
    steps += 1;
    
    if (number === 100) {
      scores.push(steps);
      confetti();
      this.setState({ gameOver: true, flashing: true });
      setTimeout(() => this.setState({ flashing: false }), 1000);
    }

    const updatedPlayer = { ...player, number, steps, scores };
    onUpdate(updatedPlayer);
    if (number !== 100) {
      onTurnEnd();
    }
  };

  startNewGame = () => {
    const { player, onUpdate, onTurnEnd } = this.props;
    const updatedPlayer = { ...player, number: Math.floor(Math.random() * 100), steps: 0 };
    this.setState({ gameOver: false });
    onUpdate(updatedPlayer);
    onTurnEnd(); 
  };

  handleQuit = () => {
    const { onRemove } = this.props;
    this.setState({ gameOver: false }, onRemove);
  };

  render() {
    const { player, isActive } = this.props;
    const { name, number, steps, scores } = player;
    const { gameOver, flashing } = this.state;

    return (
      <div className={`game-board ${isActive ? 'active' : 'disabled'} ${flashing ? 'flashing' : ''}`}>
        <h2>{name}</h2>
        <p>Number: {number}</p>
        <p>Steps: {steps}</p>
        <div>
          {isActive && !gameOver && (
            <>
              <button className="action-button" onClick={() => this.handleAction('+1')}>+1</button>
              <button className="action-button" onClick={() => this.handleAction('-1')}>-1</button>
              <button className="action-button" onClick={() => this.handleAction('*2')}>×2</button>
              <button className="action-button" onClick={() => this.handleAction('/2')}>÷2</button>
            </>
          )}
          {gameOver && (
            <>
              <button className="action-button" onClick={this.startNewGame}>New Game</button>
              <button className="action-button" onClick={this.handleQuit}>Quit</button>
            </>
          )}
        </div>
        <div className="scores">
          {name}'s scores: {scores.join(', ')}
        </div>
      </div>
    );
  }
}

export default Game;

import React, { Component } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import Game from './Game';
import Leaderboard from './Leaderboard';
import ConnectedPlayers from './ConnectedPlayers';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: JSON.parse(localStorage.getItem('players')) || [],
      activePlayers: [],
      activePlayerIndex: null,
      gameStarted: false,
      newPlayerName: ''
    };
  }

  addPlayer = () => {
    const { players, activePlayers, newPlayerName } = this.state;
    const existingPlayer = players.find(player => player.name === newPlayerName);

    // If the player does not exist, create a new player with a random number 
    if (!existingPlayer) {
      const newPlayer = {
        name: newPlayerName,
        scores: [],
        number: Math.floor(Math.random() * 100),
        steps: 0
      };
      // Add the new player to the list of players
      this.setState({
        players: [...players, newPlayer],
        activePlayers: [...activePlayers, newPlayer],
        newPlayerName: ''
      }, () => {
        // Save the updated list of players to local storage
        localStorage.setItem('players', JSON.stringify(this.state.players));
      });
    } else {
      // If the player already exists, add the player to the list of active players
      const updatedPlayer = { ...existingPlayer, number: Math.floor(Math.random() * 100), steps: 0 };
      this.setState({
        activePlayers: [...activePlayers, updatedPlayer],
        newPlayerName: ''
      });
    }
  };

  startGame = () => {
    this.setState({
      activePlayerIndex: 0,
      gameStarted: true
    });
  };

  // Move to the next player
  nextTurn = () => {
    this.setState(prevState => ({
      activePlayerIndex: (prevState.activePlayerIndex + 1) % prevState.activePlayers.length
    }));
  };

  // Update the player at the specified index
  updatePlayer = (index, updatedPlayer) => {
    const activePlayers = [...this.state.activePlayers];
    activePlayers[index] = updatedPlayer;
    this.setState({ activePlayers });
    this.savePlayersToLocalStorage(updatedPlayer);
  };

  removePlayer = (index) => {
    this.setState(prevState => {
      const newActivePlayers = prevState.activePlayers.filter((_, i) => i !== index); // Remove the player at the specified index
      let newActivePlayerIndex = prevState.activePlayerIndex % newActivePlayers.length; 


      // If there are no active players left, end the game
      if (newActivePlayers.length === 0) {
        return { activePlayers: newActivePlayers, activePlayerIndex: null, gameStarted: false };
      }
  
      return {
        activePlayers: newActivePlayers,
        activePlayerIndex: newActivePlayerIndex
      };
    });
  };
  

  // Save the updated player to local storage
  savePlayersToLocalStorage = (updatedPlayer) => {
    const players = [...this.state.players];
    const playerIndex = players.findIndex(player => player.name === updatedPlayer.name);
    players[playerIndex] = updatedPlayer;
    this.setState({ players }, () => {
      localStorage.setItem('players', JSON.stringify(players));
    });
  };

  // Handle input change (input field for new player name)
  handleInputChange = (event) => {
    this.setState({ newPlayerName: event.target.value });
  };

  // Go back to the registration page (for the arrow button)
  goToRegistration = () => {
    this.setState({ gameStarted: false });
  };

  render() {
    const { players, activePlayers, activePlayerIndex, gameStarted, newPlayerName } = this.state;

    return (
      <div className="App">
        {gameStarted && (
          <div className="back-arrow" onClick={this.goToRegistration}>
            <FaArrowLeft />
          </div>
        )}
        <div className="header">
          <h1>Get to 100!!!</h1>
          {!gameStarted && (
            <div className="setup">
              <input type="text" value={newPlayerName} onChange={this.handleInputChange} placeholder="Enter player name" />
              <button onClick={this.addPlayer}>Add Player</button>
              <button onClick={this.startGame} disabled={activePlayers.length === 0}>Start Games</button>
            </div>
          )}
        </div>
        <div className="main-content">
          <div className="leaderboard-panel">
            <Leaderboard players={players} />
          </div>
          {!gameStarted && (
            <div className="side-panel">
              <ConnectedPlayers players={activePlayers} removePlayer={this.removePlayer} />
            </div>
          )}
          <div className="game-boards">
            {gameStarted && activePlayers.map((player, index) => (
              <Game
                key={index}
                player={player}
                isActive={index === activePlayerIndex}
                onTurnEnd={this.nextTurn}

                onUpdate={(updatedPlayer) => this.updatePlayer(index, updatedPlayer)}
                onRemove={() => this.removePlayer(index)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;

import React from 'react';
import { FaTimes } from 'react-icons/fa';

class ConnectedPlayers extends React.Component {
  render() {
    const { players, removePlayer } = this.props;

    return (
      <div className="connected-players">
        <h2>Connected Players</h2>
        <ul>
          {players.map((player, index) => (
            <li key={index}>
              {player.name}
              <button className="quit-button" onClick={() => removePlayer(index)}>
                <FaTimes className="quit-icon" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default ConnectedPlayers;

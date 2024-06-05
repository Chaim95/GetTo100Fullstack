import React from 'react';

class Leaderboard extends React.Component {
  // Calculates the average steps for a player
  getAverage = (scores) => {
    if (scores.length === 0) return Infinity; //new players have infinite average
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  };

  render() {
    const { players } = this.props;
    // Sort players by average steps in ascending order and take the top 3
    const sortedPlayers = [...players].sort((a, b) => this.getAverage(a.scores) - this.getAverage(b.scores)).slice(0, 3);

    return (
      <div className="leaderboard">
        <h2>Leaderboard</h2>
        <ol>
          {sortedPlayers.map((player, index) => (
            <li key={index}>
              <span className="player-name">{player.name}</span>
              <span className="player-score">{this.getAverage(player.scores)}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  }
}

export default Leaderboard;

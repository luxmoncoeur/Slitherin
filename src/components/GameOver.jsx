import React from "react";

function GameOver({ resetGame }) {
  return (
    <div className="game-over-overlay" onClick={resetGame}>
      <div className="game-over-panel">
        <h2 className="game-over-title">GAME OVER</h2>
        <p className="game-over-subtitle">
          Tap anywhere or Press Space to Restart
        </p>
      </div>
    </div>
  );
}

export default GameOver;

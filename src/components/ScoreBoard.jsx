import React from "react";

function ScoreBoard({ score, highScore }) {
  return (
    <div className="score-container">
      <div className="score-box">
        SCORE: <span className="neon-text-cyan">{score}</span>
      </div>
      <div className="score-box">
        HIGH SCORE: <span className="neon-text-pink">{highScore}</span>
      </div>
    </div>
  );
}

export default ScoreBoard;

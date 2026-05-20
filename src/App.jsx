import React, { useEffect, useState } from "react";
import "./App.css";
import { getNextDirection, GRID_SIZE, renderBoard } from "./gameLogic";
import { INITIAL_SNAKE, moveSnake, checkSelfCollision } from "./snakeLogic";

function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState({ x: 1, y: 0 });

  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);

  const [score, setScore] = useState(0);

  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("slitherin_highscore");
    return saved ? parseInt(saved, 10) : 0;
  });

  const generateFood = () => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    setFood(newFood);
  };

  useEffect(() => {
    if (gameOver) return;
    const handleKeyDown = (e) => {
      setDirection((currentDir) => getNextDirection(e.key, currentDir));
    };

    const handleTick = () => {
      setSnake((currentSnake) => {
        const { updatedSnake, hasEaten } = moveSnake(
          currentSnake,
          direction,
          food,
        );

        const head = updatedSnake[0];
        if (
          head.x < 0 ||
          head.x >= GRID_SIZE ||
          head.y < 0 ||
          head.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return currentSnake;
        }
        if (checkSelfCollision(updatedSnake)) {
          setGameOver(true);
          return currentSnake;
        }
        if (hasEaten) {
          generateFood();

          setScore((prevScore) => {
            const newScore = prevScore + 10;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem("slitherin_highscore", newScore);
            }
            return newScore;
          });
        }
        return updatedSnake;
      });
    };

    const intervalId = setInterval(handleTick, 150);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [direction, food, gameOver, highScore]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection({ x: 1, y: 0 });
    setFood({ x: 5, y: 5 });
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="game-container">
      <h1>Slitherin</h1>

      {gameOver && (
        <div className="game-over-panel">
          <p>GAME OVER</p>
          <button onClick={resetGame}>PLAY AGAIN</button>
        </div>
      )}

      <div className="score-container">
        <div className="score-box">SCORE: {score}</div>
        <div className="score-box high-score">HIGH SCORE: {highScore}</div>
      </div>

      <div
        className="game-board"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
      >
        {renderBoard(snake, food)}
      </div>
    </div>
  );
}
export default App;

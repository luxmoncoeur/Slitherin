import React, { useEffect, useState } from "react";
import "./App.css";
import { getNextDirection, GRID_SIZE, renderBoard } from "./gameLogic";
import { INITIAL_SNAKE, moveSnake, checkSelfCollision } from "./snakeLogic";
import { swipeLogic } from "./swipeLogic";

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

  const swipeHandlers = swipeLogic(direction, setDirection);

  const generateFood = () => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    setFood(newFood);
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection({ x: 1, y: 0 });
    setFood({ x: 5, y: 5 });
    setGameOver(false);
    setScore(0);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) {
        if (e.key === " " || e.code === "Space") {
          e.preventDefault();
          resetGame();
        }
        return;
      }
      setDirection((currentDir) => getNextDirection(e.key, currentDir));
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
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

    return () => {
      clearInterval(intervalId);
    };
  }, [direction, food, gameOver, highScore]);

  return (
    <div className="app-container" {...swipeHandlers}>
      <h1>Slitherin</h1>

      <div className="score-container">
        <div className="score-box">
          SCORE: <span className="neon-text-cyan">{score}</span>
        </div>
        <div className="score-box">
          HIGH SCORE: <span className="neon-text-pink">{highScore}</span>
        </div>
      </div>

      <div
        className="game-board"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);

          const isSnake = snake.some(
            (segment) => segment.x === x && segment.y === y,
          );
          const isSnakeHead = snake[0] && snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={index}
              className={`cell ${isSnakeHead ? "snake-head" : isSnake ? "snake-body" : isFood ? "food" : ""}`}
            />
          );
        })}
      </div>
      {gameOver && (
        <div className="game-over-overlay" onClick={resetGame}>
          <div className="game-over-panel">
            <h2 className="game-over-title">GAME OVER</h2>
            <p className="game-over-subtitle">
              Tap anywhere or Press Space to Restart
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;

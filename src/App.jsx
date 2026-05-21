import React, { useEffect, useState } from "react";
import "./App.css";

import { getNextDirection, GRID_SIZE } from "./utils/gameLogic";
import {
  INITIAL_SNAKE,
  moveSnake,
  checkSelfCollision,
} from "./utils/snakeLogic";
import { swipeLogic } from "./hooks/swipeLogic";

import ScoreBoard from "./components/ScoreBoard";
import GameBoard from "./components/GameBoard";
import GameOver from "./components/GameOver";

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
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20),
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
        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
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
    return () => clearInterval(intervalId);
  }, [direction, food, gameOver, highScore]);

  return (
    <div className="app-container" {...swipeHandlers}>
      <h1>Slitherin</h1>

      <ScoreBoard score={score} highScore={highScore} />

      <GameBoard snake={snake} food={food} />

      {gameOver && <GameOver resetGame={resetGame} />}
    </div>
  );
}

export default App;

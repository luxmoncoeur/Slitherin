import React from "react";
import { GRID_SIZE } from "../utils/gameLogic";

function GameBoard({ snake, food }) {
  return (
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
  );
}

export default GameBoard;

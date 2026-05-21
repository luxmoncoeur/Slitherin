import React from "react";
import { checkIsSnakePart } from "./snakeLogic";

export const GRID_SIZE = 20;

export function renderBoard(snake, foodPosition) {
  return Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
    const x = index % GRID_SIZE;
    const y = Math.floor(index / GRID_SIZE);

    const isSnake = snake.some((part) => part.x === x && part.y === y);
    const isFood = foodPosition && foodPosition.x === x && foodPosition.y === y;

    return (
      <div
        key={index}
        className={`cell ${isSnake ? "snake" : ""} ${isFood ? "food" : ""}`}
      />
    );
  });
}

export function getNextDirection(key, currentDirection) {
  switch (key) {
    case "ArrowUp":
      if (currentDirection.y !== 1) return { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (currentDirection.y !== -1) return { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (currentDirection.x !== 1) return { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (currentDirection.x !== -1) return { x: 1, y: 0 };
      break;
    default:
      return currentDirection;
  }
  return currentDirection;
}

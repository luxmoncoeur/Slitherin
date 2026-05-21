export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

export function moveSnake(currentSnake, direction, foodPosition) {
  const newHead = {
    x: currentSnake[0].x + direction.x,
    y: currentSnake[0].y + direction.y,
  };

  const newSnake = [newHead, ...currentSnake];

  const hasEaten = newHead.x === foodPosition.x && newHead.y === foodPosition.y;

  if (!hasEaten) {
    newSnake.pop();
  }

  return {
    updatedSnake: newSnake,
    hasEaten: hasEaten,
  };
}

export function checkIsSnakePart(snake, x, y) {
  return snake.some((part) => part.x === x && part.y === y);
}

export function checkSelfCollision(snake) {
  const head = snake[0];
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      return true;
    }
  }
  return false;
}

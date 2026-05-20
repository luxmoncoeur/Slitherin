import { useRef } from "react";

export function swipeLogic(direction, setDirection) {
  const touchStart = useRef({ x: 0, y: 0 });
  const minSwipe = 30;

  const handleTouchStart = (e) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchMove = (e) => {
    if (!touchStart.current.x || !touchStart.current.y) return;

    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;

    const distanceX = touchEndX - touchStart.current.x;
    const distanceY = touchEndY - touchStart.current.y;

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (Math.abs(distanceX) > minSwipe) {
        if (distanceX > 0 && direction != "LEFT") setDirection("RIGHT");
        if (distanceX < 0 && direction !== "RIGHT") setDirection("LEFT");
        resetTouch();
      } else {
        if (Math.abs(distanceY) > minSwipe) {
          if (distanceY > 0 && direction !== "UP") setDirection("DOWN");
          if (distanceY < 0 && direction !== "DOWN") setDirection("UP");
          resetTouch();
        }
      }
    }
  };

  const resetTouch = () => {
    touchStart.current = { x: 0, y: 0 };
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: resetTouch,
  };
}

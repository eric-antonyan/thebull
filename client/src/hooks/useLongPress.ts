// src/hooks/useLongPress.ts
import { useCallback, useRef } from "react";

export const useLongPress = (callback: () => void, ms = 400) => {
  const timeoutRef = useRef<number | null>(null);

  const start = useCallback(() => {
    timeoutRef.current = window.setTimeout(() => {
      callback();
    }, ms);
  }, [callback, ms]);

  const clear = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchStart: start,
    onTouchEnd: clear,
  };
};

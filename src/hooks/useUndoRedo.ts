import { useState, useCallback, useRef } from 'react';

export function useUndoRedo<T>(initialState: T, maxHistory = 50) {
  const [state, setState] = useState(initialState);
  const history = useRef<T[]>([initialState]);
  const pointer = useRef(0);

  const set = useCallback((newState: T | ((prev: T) => T)) => {
    setState(prev => {
      const next = typeof newState === 'function' ? (newState as (prev: T) => T)(prev) : newState;
      // Truncate forward history
      history.current = history.current.slice(0, pointer.current + 1);
      history.current.push(next);
      if (history.current.length > maxHistory) history.current.shift();
      pointer.current = history.current.length - 1;
      return next;
    });
  }, [maxHistory]);

  const undo = useCallback(() => {
    if (pointer.current > 0) {
      pointer.current--;
      setState(history.current[pointer.current]);
    }
  }, []);

  const redo = useCallback(() => {
    if (pointer.current < history.current.length - 1) {
      pointer.current++;
      setState(history.current[pointer.current]);
    }
  }, []);

  const canUndo = pointer.current > 0;
  const canRedo = pointer.current < history.current.length - 1;

  return { state, set, undo, redo, canUndo, canRedo };
}

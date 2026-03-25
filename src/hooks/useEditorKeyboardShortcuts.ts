import { useEffect, type MutableRefObject } from 'react';

interface UseEditorKeyboardShortcutsParams {
  handleSaveRef: MutableRefObject<((emit?: boolean) => void) | undefined>;
  undoRighe: () => void;
  redoRighe: () => void;
}

export function useEditorKeyboardShortcuts({ handleSaveRef, undoRighe, redoRighe }: UseEditorKeyboardShortcutsParams) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === 's' && !e.shiftKey) {
        e.preventDefault();
        handleSaveRef.current?.(false);
      } else if (ctrl && e.key === 's' && e.shiftKey) {
        e.preventDefault();
        handleSaveRef.current?.(true);
      } else if (ctrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undoRighe();
      } else if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redoRighe();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSaveRef, undoRighe, redoRighe]);
}

import { useEffect, useState, useCallback } from 'react';
import { CheatingLog } from '../types/common';

export const useAntiCheat = (isActive: boolean) => {
  const [logs, setLogs] = useState<CheatingLog[]>([]);
  const [warning, setWarning] = useState<string | null>(null);

  const addLog = useCallback((type: CheatingLog['type'], details: string) => {
    if (!isActive) return;
    const newLog: CheatingLog = { timestamp: Date.now(), type, details };
    setLogs(prev => [...prev, newLog]);
    setWarning(`Warning: ${details}`);
    setTimeout(() => setWarning(null), 3000);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        addLog('tab_switch', 'Tab switched or window minimized');
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      addLog('right_click', 'Right-click disabled');
    };

    const handleCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      addLog('copy_paste', 'Copy/Paste disabled');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
    };
  }, [isActive, addLog]);

  return { logs, warning };
};

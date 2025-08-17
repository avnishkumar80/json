/**
 * Custom hook for managing unsaved changes
 */
import { useState, useEffect } from 'react';

export const useUnsavedChanges = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState('');

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const checkUnsavedChanges = (currentContent) => {
    setHasUnsavedChanges(currentContent !== lastSavedContent);
  };

  return {
    hasUnsavedChanges,
    setHasUnsavedChanges,
    lastSavedContent,
    setLastSavedContent,
    checkUnsavedChanges
  };
};

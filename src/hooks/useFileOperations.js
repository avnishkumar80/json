/**
 * Custom hook for managing file operations
 */
import { useState, useRef } from 'react';
import { saveJsonFile, readFileAsText, isJsonFile } from '../utils/fileUtils';
import { validateJson } from '../utils/jsonUtils';
import { trackEvent } from '../utils/analytics';

export const useFileOperations = ({ 
  jsonInput, 
  setJsonInput, 
  setError, 
  hasUnsavedChanges,
  setHasUnsavedChanges,
  setLastSavedContent,
  clearSearch
}) => {
  const [currentFileName, setCurrentFileName] = useState('');
  const fileInputRef = useRef(null);

  const openFile = () => {
    if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Are you sure you want to open a new file?')) {
      return;
    }
    fileInputRef.current?.click();
    trackEvent('open_file');
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!isJsonFile(file)) {
      if (!window.confirm('This doesn\'t appear to be a JSON file. Do you want to continue?')) {
        return;
      }
    }

    try {
      const content = await readFileAsText(file);
      setJsonInput(content);
      setCurrentFileName(file.name);
      setLastSavedContent(content);
      setHasUnsavedChanges(false);
      setError('');
      clearSearch();
      
      const validation = validateJson(content);
      if (!validation.isValid) {
        setError(validation.error);
      }
    } catch (error) {
      alert(error.message);
    }
    
    event.target.value = '';
  };

  const saveFile = () => {
    if (!jsonInput.trim()) {
      alert('Nothing to save. Please enter some JSON content.');
      return;
    }

    const validation = validateJson(jsonInput);
    if (!validation.isValid) {
      if (!window.confirm('The JSON is invalid. Do you want to save it anyway?')) {
        return;
      }
    }

    const fileName = currentFileName || 'untitled.json';
    saveJsonFile(jsonInput, fileName);
    setLastSavedContent(jsonInput);
    setHasUnsavedChanges(false);
    trackEvent('save_file');
  };

  return {
    currentFileName,
    setCurrentFileName,
    fileInputRef,
    openFile,
    handleFileSelect,
    saveFile
  };
};

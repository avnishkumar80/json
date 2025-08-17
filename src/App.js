import React, { useState, useRef } from 'react';
import {
  Header,
  Sidebar,
  SearchBar,
  JsonEditor,
  TreeView,
  SettingsModal,
  SeoContent,
  TrustBar,
  PerformanceBar
} from './components';
import { useTheme } from './hooks/useTheme';
import { useFileOperations } from './hooks/useFileOperations';
import { useSearch } from './hooks/useSearch';
import { useTreeView } from './hooks/useTreeView';
import { useUnsavedChanges } from './hooks/useUnsavedChanges';
import { validateJson, formatJson, minifyJson } from './utils/jsonUtils';
import { trackEvent } from './utils/analytics';
import { VIEW_MODES, DEFAULT_SETTINGS, SAMPLE_JSON } from './constants';

const JsonFormatter = () => {
  // State management
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState(DEFAULT_SETTINGS.INDENT_SIZE);
  const [viewMode, setViewMode] = useState(VIEW_MODES.EDITOR);
  const [showSettings, setShowSettings] = useState(false);
  
  // Refs
  const textareaRef = useRef(null);

  // Custom hooks
  const { darkMode, toggleTheme } = useTheme();
  const { hasUnsavedChanges, setHasUnsavedChanges, setLastSavedContent, checkUnsavedChanges } = useUnsavedChanges();
  const { expandedNodes, toggleNode, expandAll, collapseAll } = useTreeView();
  
  const {
    searchQuery,
    searchResults,
    currentSearchIndex,
    showSearch,
    performSearch,
    navigateSearch,
    handleSearchChange,
    clearSearch,
    toggleSearch
  } = useSearch();

  const {
    currentFileName,
    setCurrentFileName,
    fileInputRef,
    openFile,
    handleFileSelect,
    saveFile
  } = useFileOperations({
    jsonInput,
    setJsonInput,
    setError,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    setLastSavedContent,
    clearSearch
  });

  // Event handlers
  const handleInputChange = (e) => {
    const value = e.target.value;
    setJsonInput(value);
    
    const validation = validateJson(value);
    setError(validation.error);
    checkUnsavedChanges(value);
    
    if (searchQuery) {
      performSearch(searchQuery, value);
    }
  };

  const handleFormatJson = () => {
    const validation = validateJson(jsonInput);
    if (validation.isValid) {
      try {
        const formatted = formatJson(jsonInput, indentSize);
        setJsonInput(formatted);
        checkUnsavedChanges(formatted);
        trackEvent('format_json');
      } catch (e) {
        setError(`Error formatting JSON: ${e.message}`);
      }
    }
  };

  const handleMinifyJson = () => {
    const validation = validateJson(jsonInput);
    if (validation.isValid) {
      try {
        const minified = minifyJson(jsonInput);
        setJsonInput(minified);
        checkUnsavedChanges(minified);
        trackEvent('minify_json');
      } catch (e) {
        setError(`Error minifying JSON: ${e.message}`);
      }
    }
  };

  const handleClearInput = () => {
    if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Are you sure you want to clear?')) {
      return;
    }
    
    setJsonInput('');
    setError('');
    setCurrentFileName('');
    setHasUnsavedChanges(false);
    setLastSavedContent('');
    clearSearch();
    textareaRef.current?.focus();
  };

  const copyToClipboard = async () => {
    if (!jsonInput.trim()) return;
    
    try {
      await navigator.clipboard.writeText(jsonInput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackEvent('copy_json');
    } catch (e) {
      textareaRef.current?.select();
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackEvent('copy_json');
    }
  };

  const switchViewMode = (mode) => {
    setViewMode(mode);
    trackEvent(`switch_to_${mode}`);
  };

  const loadSample = () => {
    const sampleText = JSON.stringify(SAMPLE_JSON, null, indentSize);
    setJsonInput(sampleText);
    setError('');
    setCurrentFileName('sample.json');
    setLastSavedContent(sampleText);
    setHasUnsavedChanges(false);
    clearSearch();
    trackEvent('load_sample');
  };

  const handleExpandAll = () => {
    expandAll(jsonInput);
    trackEvent('expand_all');
  };

  const handleCollapseAll = () => {
    collapseAll();
    trackEvent('collapse_all');
  };

  const handleSearchChangeWrapper = (e) => {
    handleSearchChange(e, jsonInput);
  };

  return (
    <div style={{
      backgroundColor: darkMode ? '#111827' : '#f9fafb',
      color: darkMode ? '#f3f4f6' : '#111827',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh'
    }}>
      {/* Main Application */}
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <Header
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          toggleSearch={toggleSearch}
          showSearch={showSearch}
          currentFileName={currentFileName}
          hasUnsavedChanges={hasUnsavedChanges}
        />

        {/* Trust Bar */}
        <TrustBar darkMode={darkMode} />

        {/* Search Bar */}
        <SearchBar
          showSearch={showSearch}
          searchQuery={searchQuery}
          searchResults={searchResults}
          currentSearchIndex={currentSearchIndex}
          darkMode={darkMode}
          onSearchChange={handleSearchChangeWrapper}
          onNavigateSearch={navigateSearch}
          onClearSearch={clearSearch}
          onToggleSearch={toggleSearch}
        />

        {/* Main Content */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar */}
          <Sidebar
            darkMode={darkMode}
            openFile={openFile}
            saveFile={saveFile}
            jsonInput={jsonInput}
            hasUnsavedChanges={hasUnsavedChanges}
            viewMode={viewMode}
            switchViewMode={switchViewMode}
            error={error}
            formatJson={handleFormatJson}
            minifyJson={handleMinifyJson}
            clearInput={handleClearInput}
            loadSample={loadSample}
            setShowSettings={setShowSettings}
          />

          {/* Content Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {viewMode === VIEW_MODES.EDITOR ? (
              <JsonEditor
                jsonInput={jsonInput}
                error={error}
                darkMode={darkMode}
                copied={copied}
                textareaRef={textareaRef}
                onInputChange={handleInputChange}
                onCopyToClipboard={copyToClipboard}
              />
            ) : (
              <TreeView
                jsonInput={jsonInput}
                error={error}
                darkMode={darkMode}
                copied={copied}
                expandedNodes={expandedNodes}
                onToggleNode={toggleNode}
                onExpandAll={handleExpandAll}
                onCollapseAll={handleCollapseAll}
                onCopyToClipboard={copyToClipboard}
              />
            )}

            {/* Performance Bar */}
            <PerformanceBar 
              jsonInput={jsonInput} 
              error={error} 
              processingTime={0} 
            />
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {/* Settings Modal */}
        <SettingsModal
          showSettings={showSettings}
          onClose={() => setShowSettings(false)}
          darkMode={darkMode}
          indentSize={indentSize}
          setIndentSize={setIndentSize}
          loadSample={loadSample}
        />
      </div>

      {/* SEO Content - Outside the main app container */}
      <SeoContent darkMode={darkMode} />
    </div>
  );
};

export default JsonFormatter;

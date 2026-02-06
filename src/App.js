import React, { useState, useRef, useCallback } from 'react';
import {
  JsonEditor,
  TreeView,
  SettingsModal,
  KeyboardHelpModal,
  ShareModal,
  AutoFixSuggestions,
  CompareView,
  SchemaValidationModal,
  EmptyState,
  StatusBar,
  GraphVisualizer
} from './components';
import SimplifiedHeader from './components/Header/SimplifiedHeader';
import { useTheme } from './hooks/useTheme';
import { useFileOperations } from './hooks/useFileOperations';
import { useSearch } from './hooks/useSearch';
import { useTreeView } from './hooks/useTreeView';
import { useUnsavedChanges } from './hooks/useUnsavedChanges';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useSchemaValidation } from './hooks/useSchemaValidation';
import { validateJson, formatJson, minifyJson } from './utils/jsonUtils';
import { analyzeJsonErrors, applySingleFix, applyAllFixes } from './utils/jsonAutoFix';
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
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [autoFixSuggestions, setAutoFixSuggestions] = useState([]);
  const [showAutoFix, setShowAutoFix] = useState(false);
  const [showSchemaModal, setShowSchemaModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 });
  // Refs
  const textareaRef = useRef(null);

  // Custom hooks
  const { darkMode, toggleTheme } = useTheme();
  const { hasUnsavedChanges, setHasUnsavedChanges, setLastSavedContent, checkUnsavedChanges } = useUnsavedChanges();
  const { expandedNodes, toggleNode, expandAll, collapseAll } = useTreeView();

  const {
    schema,
    schemaString,
    validationErrors: schemaValidationErrors,
    isSchemaValid,
    schemaError,
    updateSchema,
    validate: validateAgainstSchema,
    clearSchema
  } = useSchemaValidation();

  const {
    searchQuery,
    debouncedSearchQuery,
    searchResults,
    currentSearchIndex,
    performSearch,
    navigateSearch,
    handleSearchChange,
    clearSearch,
    setSearchResults,
    setCurrentSearchIndex
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

    // Analyze for auto-fix suggestions when there's an error
    if (!validation.isValid && value.trim()) {
      const analysis = analyzeJsonErrors(value);
      if (analysis.fixes && analysis.fixes.length > 0) {
        setAutoFixSuggestions(analysis.fixes);
        setShowAutoFix(true);
      } else {
        setShowAutoFix(false);
      }
    } else {
      setShowAutoFix(false);

      // If JSON is valid, check against schema if one exists
      if (schema && value.trim()) {
        validateAgainstSchema(value);
      }
    }
  };

  // Effect to perform search when debounced query or json input changes
  React.useEffect(() => {
    if (viewMode === VIEW_MODES.EDITOR) {
      performSearch(debouncedSearchQuery, jsonInput);
    }
  }, [debouncedSearchQuery, jsonInput, performSearch, viewMode]);

  // Effect to update error state when schema validation errors change
  React.useEffect(() => {
    if (schemaValidationErrors.length > 0) {
      const errorMsg = `Schema Error: ${schemaValidationErrors[0].message} (${schemaValidationErrors[0].path})`;
      setError(errorMsg);
    } else if (validateJson(jsonInput).isValid) {
      // Only clear error if JSON syntax is also valid
      setError('');
    }
  }, [schemaValidationErrors, jsonInput]);

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



  // Keyboard shortcuts integration
  const { shortcuts } = useKeyboardShortcuts({
    formatJson: handleFormatJson,
    minifyJson: handleMinifyJson,
    toggleSearch: () => {
      // Focus the search input when Ctrl+K is pressed
      const searchInput = document.querySelector('.search-input');
      if (searchInput) searchInput.focus();
    },
    toggleTheme,
    clearInput: handleClearInput,
    loadSample,
    toggleView: () => switchViewMode(viewMode === VIEW_MODES.EDITOR ? VIEW_MODES.TREE : VIEW_MODES.EDITOR),
    copyToClipboard,
    openSettings: () => setShowSettings(true)
  });

  // Auto-fix handlers
  const handleApplyFix = (fix) => {
    const fixedJson = applySingleFix(jsonInput, fix.type);
    setJsonInput(fixedJson);
    checkUnsavedChanges(fixedJson);

    // Re-analyze for remaining issues
    const validation = validateJson(fixedJson);
    if (!validation.isValid) {
      const analysis = analyzeJsonErrors(fixedJson);
      setAutoFixSuggestions(analysis.fixes || []);
      setShowAutoFix(analysis.fixes && analysis.fixes.length > 0);
    } else {
      setShowAutoFix(false);
      setError('');
    }

    trackEvent('apply_single_fix', { fixType: fix.type });
  };

  const handleApplyAllFixes = () => {
    const fixedJson = applyAllFixes(jsonInput);
    setJsonInput(fixedJson);
    checkUnsavedChanges(fixedJson);

    const validation = validateJson(fixedJson);
    if (validation.isValid) {
      setError('');
      setShowAutoFix(false);
    } else {
      const analysis = analyzeJsonErrors(fixedJson);
      setAutoFixSuggestions(analysis.fixes || []);
      setShowAutoFix(analysis.fixes && analysis.fixes.length > 0);
    }

    trackEvent('apply_all_fixes', { fixCount: autoFixSuggestions.length });
  };

  const handleDismissAutoFix = () => {
    setShowAutoFix(false);
  };

  const handleSearchChangeWrapper = (e) => {
    handleSearchChange(e);
  };

  const handleTreeSearchResultsUpdate = useCallback((results) => {
    // When tree view performs search, update the global search results
    setSearchResults(results);
    setCurrentSearchIndex(prev => {
      if (results.length > 0 && prev >= results.length) {
        return 0;
      }
      return prev;
    });
  }, [setSearchResults, setCurrentSearchIndex]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/json' || file.name.endsWith('.json'))) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        setJsonInput(content);
        setCurrentFileName(file.name);
        checkUnsavedChanges(content);
        // Validate immediately
        const validation = validateJson(content);
        setError(validation.error);
        trackEvent('file_dropped');
      };
      reader.readAsText(file);
    }
  }, [checkUnsavedChanges, setCurrentFileName]);

  // Show compare view
  if (viewMode === 'compare') {
    return (
      <CompareView
        darkMode={darkMode}
        onClose={() => setViewMode(VIEW_MODES.EDITOR)}
      />
    );
  }

  return (
    <div style={{
      backgroundColor: darkMode ? '#111827' : '#f9fafb',
      color: darkMode ? '#f3f4f6' : '#111827',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative' // For drag overlay
    }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag Overlay */}
      {isDragging && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `4px dashed ${darkMode ? '#60a5fa' : '#3b82f6'}`,
          margin: '12px',
          borderRadius: '12px',
          pointerEvents: 'none'
        }}>
          <div style={{
            textAlign: 'center',
            color: darkMode ? '#60a5fa' : '#3b82f6'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>Drop JSON file here</h2>
          </div>
        </div>
      )}

      {/* Simplified Header - Focus on Editor/Tree */}
      <SimplifiedHeader
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        currentFileName={currentFileName}
        hasUnsavedChanges={hasUnsavedChanges}
        openFile={openFile}
        saveFile={saveFile}
        jsonInput={jsonInput}
        error={error}
        viewMode={viewMode}
        switchViewMode={switchViewMode}
        setShowSettings={setShowSettings}
        clearInput={handleClearInput}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChangeWrapper}
        searchResults={searchResults}
        currentSearchIndex={currentSearchIndex}
        navigateSearch={navigateSearch}
        onShowSchemaModal={() => setShowSchemaModal(true)}
        isSchemaValid={isSchemaValid}
        onGoHome={handleClearInput}
      />

      {/* Auto-Fix Suggestions */}
      {showAutoFix && (
        <AutoFixSuggestions
          fixes={autoFixSuggestions}
          onApplyFix={handleApplyFix}
          onApplyAllFixes={handleApplyAllFixes}
          onDismiss={handleDismissAutoFix}
          darkMode={darkMode}
        />
      )}

      {/* Main Content Area - Full Width and Full Height */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '0 24px',
        paddingTop: '16px',
        paddingBottom: '16px',
        minHeight: 0,
        overflow: 'hidden'
      }}>
        {/* JSON Editor/Tree View */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden'
        }}>
          {!jsonInput.trim() ? (
            <EmptyState
              darkMode={darkMode}
              onPaste={async () => {
                try {
                  const text = await navigator.clipboard.readText();
                  if (text) {
                    setJsonInput(text);
                    checkUnsavedChanges(text);
                    // Validate
                    const validation = validateJson(text);
                    setError(validation.error);
                    trackEvent('pasted_from_empty_state');
                  }
                } catch (e) {
                  console.error('Failed to read clipboard:', e);
                }
              }}
              onLoadSample={loadSample}
              onOpenFile={openFile}
            />
          ) : viewMode === VIEW_MODES.EDITOR ? (
            <JsonEditor
              jsonInput={jsonInput}
              error={error}
              darkMode={darkMode}
              copied={copied}
              textareaRef={textareaRef}
              onInputChange={handleInputChange}
              onCopyToClipboard={copyToClipboard}
              searchResults={searchResults}
              currentSearchIndex={currentSearchIndex}
              onCursorChange={setCursorPosition}
            />
          ) : viewMode === VIEW_MODES.TREE ? (
            <TreeView
              jsonInput={jsonInput}
              error={error}
              darkMode={darkMode}
              copied={copied}
              expandedNodes={expandedNodes}
              onToggleNode={toggleNode}
              onCopyToClipboard={copyToClipboard}
              searchQuery={searchQuery}
              searchResults={searchResults}
              currentSearchIndex={currentSearchIndex}
              onSearchResultsUpdate={handleTreeSearchResultsUpdate}
            />
          ) : (
            <GraphVisualizer
              jsonInput={jsonInput}
              darkMode={darkMode}
            />
          )}
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar
        darkMode={darkMode}
        cursorPosition={cursorPosition}
        jsonSize={new Blob([jsonInput]).size}
        isSchemaValid={schema ? isSchemaValid : undefined}
        indentSize={indentSize}
        onIndentChange={setIndentSize}
      />

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Modals */}
      <SettingsModal
        showSettings={showSettings}
        onClose={() => setShowSettings(false)}
        darkMode={darkMode}
        indentSize={indentSize}
        setIndentSize={setIndentSize}
        loadSample={loadSample}
        formatJson={handleFormatJson}
        minifyJson={handleMinifyJson}
        jsonInput={jsonInput}
        error={error}
        switchViewMode={switchViewMode}
        onShowShareModal={() => setShowShareModal(true)}
        onShowKeyboardHelp={() => setShowKeyboardHelp(true)}
      />

      <KeyboardHelpModal
        isOpen={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
        shortcuts={shortcuts}
        darkMode={darkMode}
      />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        darkMode={darkMode}
      />

      <SchemaValidationModal
        isOpen={showSchemaModal}
        onClose={() => setShowSchemaModal(false)}
        schemaString={schemaString}
        onSchemaChange={updateSchema}
        isSchemaValid={isSchemaValid}
        schemaError={schemaError}
        darkMode={darkMode}
        onClearSchema={clearSchema}
      />
    </div>
  );
};

export default JsonFormatter;

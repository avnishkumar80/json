import React, { useState, useRef } from 'react';
import { useTheme } from './hooks/useTheme';
import { useFileOperations } from './hooks/useFileOperations';
import { useSearch } from './hooks/useSearch';
import { useTreeView } from './hooks/useTreeView';
import { useUnsavedChanges } from './hooks/useUnsavedChanges';
import { validateJson, formatJson, minifyJson } from './utils/jsonUtils';
import { analyzeJsonErrors, applySingleFix, applyAllFixes } from './utils/jsonAutoFix';
import { trackEvent } from './utils/analytics';
import { SAMPLE_JSON, DEFAULT_SETTINGS, VIEW_MODES, STORAGE_KEYS } from './constants';
import SimplifiedHeader from './components/SimplifiedHeader/SimplifiedHeader';
import SimplifiedEditor from './components/SimplifiedEditor/SimplifiedEditor';
import SimplifiedToolbar from './components/SimplifiedToolbar/SimplifiedToolbar';
import SimplifiedSearchBar from './components/SimplifiedSearchBar/SimplifiedSearchBar';
import SimplifiedTreeView from './components/SimplifiedTreeView/SimplifiedTreeView';
import CompareView from './components/CompareView';

const SimplifiedJsonFormatter = () => {
  // State management
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState(DEFAULT_SETTINGS.INDENT_SIZE);
  const [viewMode, setViewMode] = useState(VIEW_MODES.EDITOR);
  const [autoFixSuggestions, setAutoFixSuggestions] = useState([]);
  const [showAutoFix, setShowAutoFix] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [useVscodeTheme, setUseVscodeTheme] = useState(false);

  // Refs
  const textareaRef = useRef(null);

  // Custom hooks
  const { darkMode, toggleTheme } = useTheme();
  const { hasUnsavedChanges, setHasUnsavedChanges, setLastSavedContent, checkUnsavedChanges } = useUnsavedChanges();
  const { expandedNodes, toggleNode, expandAll, collapseAll } = useTreeView();

  React.useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.VSCODE_THEME);
    if (savedTheme !== null) {
      setUseVscodeTheme(savedTheme === 'true');
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VSCODE_THEME, String(useVscodeTheme));
  }, [useVscodeTheme]);
  
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
  const handleInputChange = (value) => {
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
    }
    
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

  const handleSearchChangeWrapper = (e) => {
    handleSearchChange(e, jsonInput);
  };

  const handleApplyFix = (fix) => {
    const fixedJson = applySingleFix(jsonInput, fix.type);
    setJsonInput(fixedJson);
    checkUnsavedChanges(fixedJson);
    
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
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
      color: darkMode ? '#e2e8f0' : '#1e293b',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Minimal Header */}
      <SimplifiedHeader
        darkMode={darkMode}
        currentFileName={currentFileName}
        hasUnsavedChanges={hasUnsavedChanges}
        onOpenFile={openFile}
        onSaveFile={saveFile}
        jsonInput={jsonInput}
        toggleTheme={toggleTheme}
        onShowSettings={() => setShowSettings(true)}
      />

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Editor or Tree View */}
        {viewMode === VIEW_MODES.EDITOR ? (
          <SimplifiedEditor
            jsonInput={jsonInput}
            error={error}
            darkMode={darkMode}
            useVscodeTheme={useVscodeTheme}
            textareaRef={textareaRef}
            onInputChange={handleInputChange}
            searchResults={searchResults}
            currentSearchIndex={currentSearchIndex}
            showAutoFix={showAutoFix}
            autoFixSuggestions={autoFixSuggestions}
            onApplyFix={handleApplyFix}
            onApplyAllFixes={handleApplyAllFixes}
            onDismissAutoFix={() => setShowAutoFix(false)}
          />
        ) : (
          <SimplifiedTreeView
            jsonInput={jsonInput}
            error={error}
            darkMode={darkMode}
            useVscodeTheme={useVscodeTheme}
            expandedNodes={expandedNodes}
            onToggleNode={toggleNode}
            onExpandAll={() => expandAll(jsonInput)}
            onCollapseAll={collapseAll}
            searchQuery={searchQuery}
            searchResults={searchResults}
            currentSearchIndex={currentSearchIndex}
          />
        )}
      </div>

      {/* Bottom Toolbar */}
      <SimplifiedToolbar
        darkMode={darkMode}
        viewMode={viewMode}
        setViewMode={setViewMode}
        jsonInput={jsonInput}
        error={error}
        formatJson={handleFormatJson}
        minifyJson={handleMinifyJson}
        clearInput={handleClearInput}
        copyToClipboard={copyToClipboard}
        loadSample={loadSample}
        copied={copied}
        indentSize={indentSize}
        setIndentSize={setIndentSize}
      />

      {/* Bottom Search Bar */}
      <SimplifiedSearchBar
        darkMode={darkMode}
        showSearch={showSearch}
        searchQuery={searchQuery}
        searchResults={searchResults}
        currentSearchIndex={currentSearchIndex}
        onSearchChange={handleSearchChangeWrapper}
        onNavigateSearch={navigateSearch}
        onClearSearch={clearSearch}
        onToggleSearch={toggleSearch}
        jsonInput={jsonInput}
      />

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Settings Modal */}
      {showSettings && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: darkMode ? '#1e293b' : '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ margin: '0 0 16px 0' }}>Settings</h3>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={Boolean(useVscodeTheme)}
                  onChange={() => setUseVscodeTheme((prev) => !prev)}
                />
                <span>VSCode dark theme (Editor/Tree/Graph)</span>
              </label>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>
                Indent Size: {indentSize}
              </label>
              <input
                type="range"
                min="1"
                max="8"
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <button
              onClick={() => setShowSettings(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimplifiedJsonFormatter;

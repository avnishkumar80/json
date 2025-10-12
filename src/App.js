import React, { useState, useRef } from 'react';
import {
  Header,
  Sidebar,
  SearchBar,
  JsonEditor,
  TreeView,
  SettingsModal,
  SeoContent,
  PerformanceBar,
  KeyboardHelpModal,
  ShareModal,
  AutoFixSuggestions,
  CompareView
} from './components';
import { useTheme } from './hooks/useTheme';
import { useFileOperations } from './hooks/useFileOperations';
import { useSearch } from './hooks/useSearch';
import { useTreeView } from './hooks/useTreeView';
import { useUnsavedChanges } from './hooks/useUnsavedChanges';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
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

  // Keyboard shortcuts integration
  const { shortcuts } = useKeyboardShortcuts({
    formatJson: handleFormatJson,
    minifyJson: handleMinifyJson,
    toggleSearch: () => toggleSearch(),
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
    handleSearchChange(e, jsonInput);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
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
      backgroundColor: darkMode ? '#111827' : '#f9fafb',
      color: darkMode ? '#f3f4f6' : '#111827',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Sticky Header */}
      <Header
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        toggleSearch={toggleSearch}
        showSearch={showSearch}
        currentFileName={currentFileName}
        hasUnsavedChanges={hasUnsavedChanges}
        onShowKeyboardHelp={() => setShowKeyboardHelp(true)}
        onShowShareModal={() => setShowShareModal(true)}
      />

      {/* Search Bar - Only show in editor mode, hidden in tree mode as search is integrated there */}
      {viewMode === VIEW_MODES.EDITOR && (
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
      )}

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

      {/* Main Content Area with Scroll Container */}
      <div style={{ 
        display: 'flex', 
        flex: 1, 
        overflow: 'hidden',
        minHeight: '500px', // Ensure minimum content height
        height: 'calc(100vh - 150px)' // Adjusted for cleaner header
      }}>
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
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />

        {/* Scrollable Content Area */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
          minHeight: 0 // Critical for proper flex behavior
        }}>
          {/* JSON Editor/Tree View */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '600px', // Ensure substantial minimum height
            paddingBottom: '20px' // Extra space to prevent footer overlap
          }}>
            {viewMode === VIEW_MODES.EDITOR ? (
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
                showSearch={showSearch}
                searchQuery={searchQuery}
                searchResults={searchResults}
                currentSearchIndex={currentSearchIndex}
                onSearchChange={handleSearchChangeWrapper}
                onNavigateSearch={navigateSearch}
                onClearSearch={clearSearch}
                onToggleSearch={toggleSearch}
              />
            )}
          </div>

          {/* Performance Bar - Fixed at bottom of content area */}
          <PerformanceBar 
            jsonInput={jsonInput} 
            error={error} 
            processingTime={0} 
          />
        </div>
      </div>

      {/* SEO Content - Separate scrollable section */}
      <div style={{
        backgroundColor: darkMode ? '#0f172a' : '#ffffff',
        borderTop: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
      }}>
        <SeoContent darkMode={darkMode} />
      </div>
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
        jsonContent={jsonInput}
        darkMode={darkMode}
      />
    </div>
  );
};

export default JsonFormatter;

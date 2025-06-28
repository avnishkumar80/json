import React, { useState, useRef, useEffect } from 'react';
import { Copy, Sun, Moon, FileText, Minimize2, RotateCcw, Check, TreePine, ChevronRight, ChevronDown, Search, X, Upload, Download, Save, FolderOpen, Settings } from 'lucide-react';

const JsonFormatter = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState(2);
  const [viewMode, setViewMode] = useState('editor');
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [currentFileName, setCurrentFileName] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('json-formatter-theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('json-formatter-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const validateJson = (text) => {
    if (!text.trim()) {
      setError('');
      return false;
    }

    try {
      JSON.parse(text);
      setError('');
      return true;
    } catch (e) {
      const match = e.message.match(/at position (\d+)/);
      if (match) {
        const position = parseInt(match[1]);
        const lines = text.substring(0, position).split('\n');
        const line = lines.length;
        const column = lines[lines.length - 1].length + 1;
        setError(`Invalid JSON: ${e.message.split(' at')[0]} at line ${line}, column ${column}`);
      } else {
        setError(`Invalid JSON: ${e.message}`);
      }
      return false;
    }
  };

  const formatJson = () => {
    if (validateJson(jsonInput)) {
      try {
        const parsed = JSON.parse(jsonInput);
        const formatted = JSON.stringify(parsed, null, indentSize);
        setJsonInput(formatted);
        setHasUnsavedChanges(formatted !== lastSavedContent);
      } catch (e) {
        setError(`Error formatting JSON: ${e.message}`);
      }
    }
  };

  const minifyJson = () => {
    if (validateJson(jsonInput)) {
      try {
        const parsed = JSON.parse(jsonInput);
        const minified = JSON.stringify(parsed);
        setJsonInput(minified);
        setHasUnsavedChanges(minified !== lastSavedContent);
      } catch (e) {
        setError(`Error minifying JSON: ${e.message}`);
      }
    }
  };

  const clearInput = () => {
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
    } catch (e) {
      textareaRef.current?.select();
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setJsonInput(value);
    validateJson(value);
    setHasUnsavedChanges(value !== lastSavedContent);
    
    if (searchQuery) {
      performSearch(searchQuery);
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const openFile = () => {
    if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Are you sure you want to open a new file?')) {
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.json') && file.type !== 'application/json') {
      if (!window.confirm('This doesn\'t appear to be a JSON file. Do you want to continue?')) {
        return;
      }
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setJsonInput(content);
      setCurrentFileName(file.name);
      setLastSavedContent(content);
      setHasUnsavedChanges(false);
      setError('');
      clearSearch();
      validateJson(content);
    };
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const saveFile = () => {
    if (!jsonInput.trim()) {
      alert('Nothing to save. Please enter some JSON content.');
      return;
    }

    if (!validateJson(jsonInput)) {
      if (!window.confirm('The JSON is invalid. Do you want to save it anyway?')) {
        return;
      }
    }

    const fileName = currentFileName || 'untitled.json';
    const blob = new Blob([jsonInput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    setLastSavedContent(jsonInput);
    setHasUnsavedChanges(false);
  };

  const performSearch = (query) => {
    if (!query.trim() || !jsonInput.trim() || error) {
      setSearchResults([]);
      setCurrentSearchIndex(0);
      return;
    }

    const text = jsonInput.toLowerCase();
    const searchTerm = query.toLowerCase();
    const results = [];
    let index = 0;

    while (index < text.length) {
      const foundIndex = text.indexOf(searchTerm, index);
      if (foundIndex === -1) break;
      results.push({
        start: foundIndex,
        end: foundIndex + searchTerm.length,
        text: jsonInput.substring(foundIndex, foundIndex + searchTerm.length)
      });
      index = foundIndex + 1;
    }

    setSearchResults(results);
    setCurrentSearchIndex(0);

    if (results.length > 0 && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(results[0].start, results[0].end);
    }
  };

  const navigateSearch = (direction) => {
    if (searchResults.length === 0) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = (currentSearchIndex + 1) % searchResults.length;
    } else {
      newIndex = currentSearchIndex === 0 ? searchResults.length - 1 : currentSearchIndex - 1;
    }

    setCurrentSearchIndex(newIndex);

    if (textareaRef.current) {
      const result = searchResults[newIndex];
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(result.start, result.end);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    performSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setCurrentSearchIndex(0);
    setShowSearch(false);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      clearSearch();
    }
  };

  const switchViewMode = (mode) => {
    setViewMode(mode);
    clearSearch();
    
    if (mode === 'tree' && jsonInput.trim() && !error) {
      try {
        const parsed = JSON.parse(jsonInput);
        const firstLevelPaths = new Set();
        
        if (Array.isArray(parsed)) {
          parsed.forEach((_, index) => {
            firstLevelPaths.add(`[${index}]`);
          });
        } else if (typeof parsed === 'object' && parsed !== null) {
          Object.keys(parsed).forEach(key => {
            firstLevelPaths.add(key);
          });
        }
        
        setExpandedNodes(firstLevelPaths);
      } catch (e) {
        // Invalid JSON
      }
    }
  };

  const loadSample = () => {
    if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Are you sure you want to load sample data?')) {
      return;
    }
    
    const sample = {
      "project": {
        "name": "Enterprise API Gateway",
        "version": "2.1.0",
        "environment": "production"
      },
      "services": [
        {
          "id": "auth-service",
          "name": "Authentication Service",
          "endpoints": ["/auth/login", "/auth/refresh", "/auth/logout"],
          "health": {
            "status": "healthy",
            "uptime": 99.99,
            "lastCheck": "2024-01-15T10:30:00Z"
          }
        }
      ],
      "configuration": {
        "database": {
          "host": "prod-db.company.com",
          "port": 5432,
          "ssl": true,
          "connectionPool": {
            "min": 5,
            "max": 20,
            "idle": 10000
          }
        }
      }
    };
    
    const sampleJson = JSON.stringify(sample, null, 2);
    setJsonInput(sampleJson);
    setError('');
    setCurrentFileName('enterprise-config.json');
    setLastSavedContent(sampleJson);
    setHasUnsavedChanges(false);
    clearSearch();
  };

  const toggleNode = (path) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedNodes(newExpanded);
  };

  const expandAll = () => {
    if (!jsonInput.trim() || error) return;
    try {
      const parsed = JSON.parse(jsonInput);
      const allPaths = new Set();
      const collectPaths = (obj, currentPath = '') => {
        if (typeof obj === 'object' && obj !== null) {
          if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
              const path = currentPath ? `${currentPath}[${index}]` : `[${index}]`;
              allPaths.add(path);
              collectPaths(item, path);
            });
          } else {
            Object.keys(obj).forEach(key => {
              const path = currentPath ? `${currentPath}.${key}` : key;
              allPaths.add(path);
              collectPaths(obj[key], path);
            });
          }
        }
      };
      collectPaths(parsed);
      setExpandedNodes(allPaths);
    } catch (e) {
      // Invalid JSON
    }
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  const renderTreeNode = (data, key, path = '', level = 0) => {
    const nodeKey = path ? `${path}.${key}` : key;
    const isExpanded = expandedNodes.has(nodeKey);
    const isObject = typeof data === 'object' && data !== null;
    const isArray = Array.isArray(data);
    
    const getValueType = (value) => {
      if (value === null) return 'null';
      if (typeof value === 'string') return 'string';
      if (typeof value === 'number') return 'number';
      if (typeof value === 'boolean') return 'boolean';
      if (Array.isArray(value)) return 'array';
      if (typeof value === 'object') return 'object';
      return 'unknown';
    };

    const getValueColor = (type) => {
      const colors = {
        string: darkMode ? 'text-emerald-400' : 'text-emerald-600',
        number: darkMode ? 'text-blue-400' : 'text-blue-600',
        boolean: darkMode ? 'text-purple-400' : 'text-purple-600',
        null: darkMode ? 'text-gray-500' : 'text-gray-400',
        object: darkMode ? 'text-yellow-400' : 'text-yellow-600',
        array: darkMode ? 'text-orange-400' : 'text-orange-600'
      };
      return colors[type] || (darkMode ? 'text-gray-300' : 'text-gray-700');
    };

    const renderValue = (value) => {
      const type = getValueType(value);
      const colorClass = getValueColor(type);
      
      if (type === 'string') {
        return <span className={colorClass}>"{value}"</span>;
      } else if (type === 'null') {
        return <span className={colorClass}>null</span>;
      } else {
        return <span className={colorClass}>{String(value)}</span>;
      }
    };

    return (
      <div key={nodeKey} className="select-text">
        <div 
          className={`flex items-center py-1.5 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}
          style={{ paddingLeft: `${level * 24 + 12}px` }}
        >
          {isObject ? (
            <>
              <button
                onClick={() => toggleNode(nodeKey)}
                className={`mr-2 p-0.5 rounded transition-colors ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
              >
                {isExpanded ? 
                  <ChevronDown className="h-4 w-4" /> : 
                  <ChevronRight className="h-4 w-4" />
                }
              </button>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {key}:
              </span>
              <span className={`ml-2 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {isArray ? 
                  `Array(${data.length})` : 
                  `Object(${Object.keys(data).length})`
                }
              </span>
            </>
          ) : (
            <>
              <div className="w-5 mr-2"></div>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {key}:
              </span>
              <span className="ml-2">
                {renderValue(data)}
              </span>
            </>
          )}
        </div>
        
        {isObject && isExpanded && (
          <div>
            {isArray ? 
              data.map((item, index) => 
                renderTreeNode(item, `[${index}]`, nodeKey, level + 1)
              ) :
              Object.entries(data).map(([childKey, childValue]) => 
                renderTreeNode(childValue, childKey, nodeKey, level + 1)
              )
            }
          </div>
        )}
      </div>
    );
  };

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

  return (
    <div className={`h-screen flex flex-col ${
      darkMode 
        ? 'bg-gray-950 text-gray-100' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`border-b ${
        darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
      }`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    JSON Formatter Pro
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Professional JSON editor and validator
                  </p>
                </div>
              </div>
              
              {currentFileName && (
                <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-md ${
                  darkMode ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {currentFileName}
                  </span>
                  {hasUnsavedChanges && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleSearch}
                className={`p-2.5 rounded-lg transition-colors ${
                  showSearch
                    ? 'bg-blue-500 text-white'
                    : darkMode 
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-lg transition-colors ${
                  darkMode 
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Toggle theme"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-2.5 rounded-lg transition-colors ${
                    showSettings
                      ? 'bg-gray-200 dark:bg-gray-800'
                      : darkMode 
                        ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  title="Settings"
                >
                  <Settings className="h-5 w-5" />
                </button>
                
                {showSettings && (
                  <div className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg border z-50 ${
                    darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    <div className="p-4">
                      <h3 className="font-medium mb-3">Settings</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Indentation
                          </label>
                          <select 
                            value={indentSize} 
                            onChange={(e) => setIndentSize(Number(e.target.value))}
                            className={`w-full px-3 py-2 rounded-md border text-sm ${
                              darkMode 
                                ? 'bg-gray-800 border-gray-600 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          >
                            <option value={2}>2 spaces</option>
                            <option value={4}>4 spaces</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      {showSearch && (
        <div className={`border-b ${
          darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
        }`}>
          <div className="px-6 py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search in JSON..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
              
              {searchResults.length > 0 && (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {currentSearchIndex + 1} of {searchResults.length}
                  </span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => navigateSearch('prev')}
                      className={`p-1.5 rounded transition-colors ${
                        darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                      }`}
                    >
                      <ChevronRight className="h-4 w-4 rotate-180" />
                    </button>
                    <button
                      onClick={() => navigateSearch('next')}
                      className={`p-1.5 rounded transition-colors ${
                        darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                      }`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
              
              <button
                onClick={clearSearch}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-800 text-gray-500' : 'hover:bg-gray-100 text-gray-400'
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`w-72 border-r flex flex-col ${
          darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
        }`}>
          {/* File Operations */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">File</h3>
            <div className="space-y-3">
              <button
                onClick={openFile}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  darkMode 
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <FolderOpen className="h-4 w-4" />
                <span>Open File</span>
              </button>
              
              <button
                onClick={saveFile}
                disabled={!jsonInput.trim()}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  !jsonInput.trim()
                    ? 'text-gray-400 cursor-not-allowed'
                    : hasUnsavedChanges
                      ? darkMode 
                        ? 'text-orange-300 hover:bg-orange-900/20' 
                        : 'text-orange-700 hover:bg-orange-50'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {hasUnsavedChanges ? <Save className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                <span>{hasUnsavedChanges ? 'Save Changes' : 'Download'}</span>
              </button>
            </div>
          </div>

          {/* View Controls */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">View</h3>
            <div className={`flex rounded-lg p-1 ${
              darkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <button
                onClick={() => switchViewMode('editor')}
                className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'editor'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Editor</span>
              </button>
              <button
                onClick={() => switchViewMode('tree')}
                disabled={!jsonInput.trim() || !!error}
                className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'tree'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : !jsonInput.trim() || !!error
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <TreePine className="h-4 w-4" />
                <span>Tree</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 flex-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Actions</h3>
            <div className="space-y-3">
              {viewMode === 'editor' ? (
                <>
                  <button
                    onClick={formatJson}
                    disabled={!jsonInput.trim()}
                    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      !jsonInput.trim()
                        ? 'text-gray-400 cursor-not-allowed'
                        : darkMode 
                          ? 'text-blue-300 hover:bg-blue-900/20' 
                          : 'text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Format JSON</span>
                  </button>
                  
                  <button
                    onClick={minifyJson}
                    disabled={!jsonInput.trim()}
                    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      !jsonInput.trim()
                        ? 'text-gray-400 cursor-not-allowed'
                        : darkMode 
                          ? 'text-green-300 hover:bg-green-900/20' 
                          : 'text-green-700 hover:bg-green-50'
                    }`}
                  >
                    <Minimize2 className="h-4 w-4" />
                    <span>Minify JSON</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={expandAll}
                    disabled={!jsonInput.trim() || !!error}
                    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      !jsonInput.trim() || !!error
                        ? 'text-gray-400 cursor-not-allowed'
                        : darkMode 
                          ? 'text-green-300 hover:bg-green-900/20' 
                          : 'text-green-700 hover:bg-green-50'
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                    <span>Expand All</span>
                  </button>
                  
                  <button
                    onClick={collapseAll}
                    disabled={!jsonInput.trim() || !!error}
                    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      !jsonInput.trim() || !!error
                        ? 'text-gray-400 cursor-not-allowed'
                        : darkMode 
                          ? 'text-orange-300 hover:bg-orange-900/20' 
                          : 'text-orange-700 hover:bg-orange-50'
                    }`}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span>Collapse All</span>
                  </button>
                </>
              )}
              
              <button
                onClick={copyToClipboard}
                disabled={!jsonInput.trim()}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  !jsonInput.trim()
                    ? 'text-gray-400 cursor-not-allowed'
                    : copied
                      ? 'text-green-600 dark:text-green-400'
                      : darkMode 
                        ? 'text-purple-300 hover:bg-purple-900/20' 
                        : 'text-purple-700 hover:bg-purple-50'
                }`}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
              </button>
              
              <button
                onClick={clearInput}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  darkMode 
                    ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-300' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <RotateCcw className="h-4 w-4" />
                <span>Clear</span>
              </button>
              
              <button
                onClick={loadSample}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  darkMode 
                    ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-300' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Upload className="h-4 w-4" />
                <span>Load Sample</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Status Bar */}
          {error && (
            <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                  {error}
                </p>
              </div>
            </div>
          )}

          {hasUnsavedChanges && (
            <div className="px-6 py-3 bg-orange-50 dark:bg-orange-900/20 border-b border-orange-200 dark:border-orange-800">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                  You have unsaved changes
                </p>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-hidden">
            {viewMode === 'editor' ? (
              <div className={`h-full rounded-lg border ${
                darkMode ? 'border-gray-700' : 'border-gray-300'
              }`}>
                <div className={`px-4 py-3 border-b text-sm font-medium ${
                  darkMode 
                    ? 'border-gray-700 bg-gray-800 text-gray-300' 
                    : 'border-gray-200 bg-gray-50 text-gray-700'
                }`}>
                  <div className="flex items-center justify-between">
                    <span>JSON Editor</span>
                    {jsonInput.trim() && (
                      <span className={`text-xs px-2 py-1 rounded ${
                        error 
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' 
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      }`}>
                        {error ? 'Invalid' : 'Valid JSON'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4 h-full">
                  <textarea
                    ref={textareaRef}
                    value={jsonInput}
                    onChange={handleInputChange}
                    placeholder="Paste or type your JSON here..."
                    className={`w-full h-full resize-none font-mono text-sm leading-relaxed bg-transparent border-none outline-none ${
                      darkMode ? 'text-gray-100 placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                    }`}
                    style={{ minHeight: 'calc(100% - 2rem)' }}
                  />
                </div>
              </div>
            ) : (
              <div className={`h-full rounded-lg border ${
                darkMode ? 'border-gray-700' : 'border-gray-300'
              }`}>
                <div className={`px-4 py-3 border-b text-sm font-medium ${
                  darkMode 
                    ? 'border-gray-700 bg-gray-800 text-gray-300' 
                    : 'border-gray-200 bg-gray-50 text-gray-700'
                }`}>
                  <div className="flex items-center justify-between">
                    <span>JSON Tree View</span>
                    <span className="text-xs text-gray-500">
                      Click nodes to expand/collapse
                    </span>
                  </div>
                </div>
                
                <div className={`p-4 h-full overflow-auto ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                  {jsonInput.trim() && !error ? (
                    <div className="font-mono text-sm">
                      {(() => {
                        try {
                          const parsed = JSON.parse(jsonInput);
                          if (Array.isArray(parsed)) {
                            return parsed.map((item, index) => 
                              renderTreeNode(item, `[${index}]`, '', 0)
                            );
                          } else if (typeof parsed === 'object' && parsed !== null) {
                            return Object.entries(parsed).map(([key, value]) => 
                              renderTreeNode(value, key, '', 0)
                            );
                          } else {
                            return (
                              <div className="p-8 text-center">
                                <span className={`text-lg ${
                                  darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  {typeof parsed === 'string' ? `"${parsed}"` : String(parsed)}
                                </span>
                                <div className={`text-sm mt-2 ${
                                  darkMode ? 'text-gray-500' : 'text-gray-500'
                                }`}>
                                  Primitive value - no tree structure
                                </div>
                              </div>
                            );
                          }
                        } catch (e) {
                          return null;
                        }
                      })()}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <TreePine className={`h-16 w-16 mx-auto mb-4 ${
                          darkMode ? 'text-gray-600' : 'text-gray-400'
                        }`} />
                        <p className={`text-lg font-medium ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {error ? 'Fix JSON errors to view tree' : 'Enter valid JSON to view tree structure'}
                        </p>
                        <p className={`text-sm mt-2 ${
                          darkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          Switch to Editor mode to input JSON
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Stats */}
          {jsonInput.trim() && !error && (
            <div className={`px-6 py-3 border-t text-sm ${
              darkMode ? 'border-gray-800 bg-gray-900 text-gray-400' : 'border-gray-200 bg-gray-50 text-gray-600'
            }`}>
              <div className="flex items-center space-x-6">
                <span>Characters: {jsonInput.length.toLocaleString()}</span>
                <span>Lines: {jsonInput.split('\n').length.toLocaleString()}</span>
                <span>Size: {(new Blob([jsonInput]).size / 1024).toFixed(1)} KB</span>
                {searchResults.length > 0 && (
                  <span>Search Results: {searchResults.length}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json,text/plain"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default JsonFormatter;
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

  useEffect(() => {
    const savedTheme = localStorage.getItem('json-formatter-theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  useEffect(() => {
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
    
    const getValueColor = (value) => {
      if (value === null) return darkMode ? '#6b7280' : '#9ca3af';
      if (typeof value === 'string') return darkMode ? '#34d399' : '#059669';
      if (typeof value === 'number') return darkMode ? '#60a5fa' : '#2563eb';
      if (typeof value === 'boolean') return darkMode ? '#a78bfa' : '#7c3aed';
      if (Array.isArray(value)) return darkMode ? '#fb923c' : '#ea580c';
      if (typeof value === 'object') return darkMode ? '#fbbf24' : '#d97706';
      return darkMode ? '#d1d5db' : '#374151';
    };

    const renderValue = (value) => {
      const color = getValueColor(value);
      
      if (typeof value === 'string') {
        return <span style={{ color }}>{`"${value}"`}</span>;
      } else if (value === null) {
        return <span style={{ color }}>null</span>;
      } else {
        return <span style={{ color }}>{String(value)}</span>;
      }
    };

    return (
      <div key={nodeKey} style={{ userSelect: 'text' }}>
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            paddingLeft: `${level * 24 + 12}px`,
            color: darkMode ? '#d1d5db' : '#374151'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = darkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(248, 250, 252, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {isObject ? (
            <>
              <button
                onClick={() => toggleNode(nodeKey)}
                style={{
                  marginRight: '8px',
                  padding: '2px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: 'inherit'
                }}
              >
                {isExpanded ? 
                  <ChevronDown size={16} /> : 
                  <ChevronRight size={16} />
                }
              </button>
              <span style={{ fontWeight: '500', color: darkMode ? '#f1f5f9' : '#1e293b' }}>
                {key}:
              </span>
              <span style={{ marginLeft: '8px', fontSize: '14px', color: darkMode ? '#6b7280' : '#6b7280' }}>
                {isArray ? 
                  `Array(${data.length})` : 
                  `Object(${Object.keys(data).length})`
                }
              </span>
            </>
          ) : (
            <>
              <div style={{ width: '20px', marginRight: '8px' }}></div>
              <span style={{ fontWeight: '500', color: darkMode ? '#f1f5f9' : '#1e293b' }}>
                {key}:
              </span>
              <span style={{ marginLeft: '8px' }}>
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
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: darkMode ? '#111827' : '#f9fafb',
      color: darkMode ? '#f3f4f6' : '#111827',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
        padding: '16px 24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                padding: '8px',
                backgroundColor: '#3b82f6',
                borderRadius: '8px',
                color: 'white'
              }}>
                <FileText size={24} />
              </div>
              <div>
                <h1 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  margin: 0,
                  color: darkMode ? '#f3f4f6' : '#111827'
                }}>
                  JSON Formatter Pro
                </h1>
                <p style={{
                  fontSize: '14px',
                  color: darkMode ? '#9ca3af' : '#6b7280',
                  margin: 0
                }}>
                  Professional JSON editor and validator
                </p>
              </div>
            </div>
            
            {currentFileName && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                <FileText size={16} style={{ color: darkMode ? '#9ca3af' : '#6b7280' }} />
                <span>{currentFileName}</span>
                {hasUnsavedChanges && (
                  <div style={{ width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></div>
                )}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={toggleSearch}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: showSearch ? '#3b82f6' : 'transparent',
                color: showSearch ? 'white' : (darkMode ? '#9ca3af' : '#6b7280'),
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Search"
            >
              <Search size={20} />
            </button>
            
            <button
              onClick={toggleTheme}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'transparent',
                color: darkMode ? '#9ca3af' : '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Toggle theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowSettings(!showSettings)}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: showSettings ? (darkMode ? '#374151' : '#f3f4f6') : 'transparent',
                  color: darkMode ? '#9ca3af' : '#6b7280',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                title="Settings"
              >
                <Settings size={20} />
              </button>
              
              {showSettings && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  marginTop: '8px',
                  width: '256px',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  zIndex: 50
                }}>
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ fontWeight: '500', marginBottom: '12px', margin: 0 }}>Settings</h3>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                        Indentation
                      </label>
                      <select 
                        value={indentSize} 
                        onChange={(e) => setIndentSize(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: `1px solid ${darkMode ? '#374151' : '#d1d5db'}`,
                          backgroundColor: darkMode ? '#374151' : '#ffffff',
                          color: darkMode ? '#ffffff' : '#111827',
                          fontSize: '14px'
                        }}
                      >
                        <option value={2}>2 spaces</option>
                        <option value={4}>4 spaces</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      {showSearch && (
        <div style={{
          borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          padding: '16px 24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search 
                size={16} 
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: darkMode ? '#6b7280' : '#9ca3af'
                }} 
              />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search in JSON..."
                style={{
                  width: '100%',
                  paddingLeft: '40px',
                  paddingRight: '16px',
                  paddingTop: '10px',
                  paddingBottom: '10px',
                  borderRadius: '8px',
                  border: `1px solid ${darkMode ? '#374151' : '#d1d5db'}`,
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  color: darkMode ? '#ffffff' : '#111827',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
            
            {searchResults.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280' }}>
                  {currentSearchIndex + 1} of {searchResults.length}
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => navigateSearch('prev')}
                    style={{
                      padding: '6px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      color: darkMode ? '#9ca3af' : '#6b7280'
                    }}
                  >
                    <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />
                  </button>
                  <button
                    onClick={() => navigateSearch('next')}
                    style={{
                      padding: '6px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      color: darkMode ? '#9ca3af' : '#6b7280'
                    }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
            
            <button
              onClick={clearSearch}
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                color: darkMode ? '#6b7280' : '#9ca3af'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{
          width: '280px',
          borderRight: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* File Operations */}
          <div style={{
            padding: '20px',
            borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '12px',
              margin: '0 0 12px 0',
              color: darkMode ? '#f3f4f6' : '#111827'
            }}>
              File
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={openFile}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: darkMode ? '#d1d5db' : '#374151',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = darkMode ? '#374151' : '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <FolderOpen size={16} />
                <span>Open File</span>
              </button>
              
              <button
                onClick={saveFile}
                disabled={!jsonInput.trim()}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: !jsonInput.trim() 
                    ? '#9ca3af' 
                    : hasUnsavedChanges
                      ? '#f59e0b'
                      : (darkMode ? '#d1d5db' : '#374151'),
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: !jsonInput.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (jsonInput.trim()) {
                    e.target.style.backgroundColor = darkMode ? '#374151' : '#f3f4f6';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                {hasUnsavedChanges ? <Save size={16} /> : <Download size={16} />}
                <span>{hasUnsavedChanges ? 'Save Changes' : 'Download'}</span>
              </button>
            </div>
          </div>

          {/* View Controls */}
          <div style={{
            padding: '20px',
            borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '12px',
              margin: '0 0 12px 0',
              color: darkMode ? '#f3f4f6' : '#111827'
            }}>
              View
            </h3>
            <div style={{
              display: 'flex',
              borderRadius: '8px',
              padding: '4px',
              backgroundColor: darkMode ? '#374151' : '#f3f4f6'
            }}>
              <button
                onClick={() => switchViewMode('editor')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: viewMode === 'editor' ? (darkMode ? '#4b5563' : '#ffffff') : 'transparent',
                  color: viewMode === 'editor' ? (darkMode ? '#f3f4f6' : '#111827') : (darkMode ? '#9ca3af' : '#6b7280'),
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <FileText size={16} />
                <span>Editor</span>
              </button>
              <button
                onClick={() => switchViewMode('tree')}
                disabled={!jsonInput.trim() || !!error}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: viewMode === 'tree' ? (darkMode ? '#4b5563' : '#ffffff') : 'transparent',
                  color: !jsonInput.trim() || !!error 
                    ? '#9ca3af' 
                    : viewMode === 'tree' 
                      ? (darkMode ? '#f3f4f6' : '#111827') 
                      : (darkMode ? '#9ca3af' : '#6b7280'),
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: !jsonInput.trim() || !!error ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <TreePine size={16} />
                <span>Tree</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div style={{
            padding: '20px',
            flex: 1
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '12px',
              margin: '0 0 12px 0',
              color: darkMode ? '#f3f4f6' : '#111827'
            }}>
              Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {viewMode === 'editor' ? (
                <>
                  <button
                    onClick={formatJson}
                    disabled={!jsonInput.trim()}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: !jsonInput.trim() ? '#9ca3af' : '#3b82f6',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: !jsonInput.trim() ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      if (jsonInput.trim()) {
                        e.target.style.backgroundColor = darkMode ? '#374151' : '#f3f4f6';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    <FileText size={16} />
                    <span>Format JSON</span>
                  </button>
                  
                  <button
                    onClick={minifyJson}
                    disabled={!jsonInput.trim()}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: !jsonInput.trim() ? '#9ca3af' : '#10b981',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: !jsonInput.trim() ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      if (jsonInput.trim()) {
                        e.target.style.backgroundColor = darkMode ? '#374151' : '#f3f4f6';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Minimize2 size={16} />
                    <span>Minify JSON</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={expandAll}
                    disabled={!jsonInput.trim() || !!error}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: !jsonInput.trim() || !!error ? '#9ca3af' : '#10b981',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: !jsonInput.trim() || !!error ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      if (jsonInput.trim() && !error) {
                        e.target.style.backgroundColor = darkMode ? '#374151' : '#f3f4f6';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    <ChevronDown size={16} />
                    <span>Expand All</span>
                  </button>
                  
                  <button
                    onClick={collapseAll}
                    disabled={!jsonInput.trim() || !!error}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: !jsonInput.trim() || !!error ? '#9ca3af' : '#f59e0b',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: !jsonInput.trim() || !!error ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      if (jsonInput.trim() && !error) {
                        e.target.style.backgroundColor = darkMode ? '#374151' : '#f3f4f6';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    <ChevronRight size={16} />
                    <span>Collapse All</span>
                  </button>
                </>
              )}
              
              <button
                onClick={copyToClipboard}
                disabled={!jsonInput.trim()}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: !jsonInput.trim() 
                    ? '#9ca3af' 
                    : copied 
                      ? '#10b981' 
                      : '#8b5cf6',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: !jsonInput.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (jsonInput.trim()) {
                    e.target.style.backgroundColor = darkMode ? '#374151' : '#f3f4f6';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              
              <button
                onClick={clearInput}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: darkMode ? '#9ca3af' : '#6b7280',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = darkMode ? '#374151' : '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <RotateCcw size={16} />
                <span>Clear</span>
              </button>
              
              <button
                onClick={loadSample}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: darkMode ? '#9ca3af' : '#6b7280',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = darkMode ? '#374151' : '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <Upload size={16} />
                <span>Load Sample</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Editor Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Status Bars */}
          {error && (
            <div style={{
              padding: '12px 24px',
              backgroundColor: darkMode ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2',
              borderBottom: `1px solid ${darkMode ? '#dc2626' : '#fecaca'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#dc2626', borderRadius: '50%' }}></div>
              <p style={{ fontSize: '14px', fontWeight: '500', color: darkMode ? '#fca5a5' : '#dc2626', margin: 0 }}>
                {error}
              </p>
            </div>
          )}

          {hasUnsavedChanges && (
            <div style={{
              padding: '12px 24px',
              backgroundColor: darkMode ? 'rgba(245, 158, 11, 0.1)' : '#fffbeb',
              borderBottom: `1px solid ${darkMode ? '#f59e0b' : '#fed7aa'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></div>
              <p style={{ fontSize: '14px', fontWeight: '500', color: darkMode ? '#fbbf24' : '#f59e0b', margin: 0 }}>
                You have unsaved changes
              </p>
            </div>
          )}

          {/* Content Area */}
          <div style={{ flex: 1, padding: '24px', overflow: 'hidden' }}>
            {viewMode === 'editor' ? (
              <div style={{
                height: '100%',
                borderRadius: '8px',
                border: `1px solid ${darkMode ? '#374151' : '#d1d5db'}`,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '12px 16px',
                  borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  backgroundColor: darkMode ? '#374151' : '#f9fafb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  <span>JSON Editor</span>
                  {jsonInput.trim() && (
                    <span style={{
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontWeight: '500',
                      backgroundColor: error 
                        ? (darkMode ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2')
                        : (darkMode ? 'rgba(34, 197, 94, 0.2)' : '#dcfce7'),
                      color: error 
                        ? (darkMode ? '#f87171' : '#dc2626')
                        : (darkMode ? '#4ade80' : '#166534')
                    }}>
                      {error ? 'Invalid' : 'Valid JSON'}
                    </span>
                  )}
                </div>
                <div style={{ flex: 1, padding: '16px', overflow: 'hidden' }}>
                  <textarea
                    ref={textareaRef}
                    value={jsonInput}
                    onChange={handleInputChange}
                    placeholder="Paste or type your JSON here..."
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      outline: 'none',
                      resize: 'none',
                      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      backgroundColor: 'transparent',
                      color: darkMode ? '#f3f4f6' : '#111827'
                    }}
                  />
                </div>
              </div>
            ) : (
              <div style={{
                height: '100%',
                borderRadius: '8px',
                border: `1px solid ${darkMode ? '#374151' : '#d1d5db'}`,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '12px 16px',
                  borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  backgroundColor: darkMode ? '#374151' : '#f9fafb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  <span>JSON Tree View</span>
                  <span style={{ fontSize: '12px', color: darkMode ? '#9ca3af' : '#6b7280' }}>
                    Click nodes to expand/collapse
                  </span>
                </div>
                
                <div style={{
                  flex: 1,
                  padding: '16px',
                  overflow: 'auto',
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  fontSize: '14px'
                }}>
                  {jsonInput.trim() && !error ? (
                    <div>
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
                              <div style={{ padding: '32px', textAlign: 'center' }}>
                                <span style={{
                                  fontSize: '18px',
                                  color: darkMode ? '#d1d5db' : '#374151'
                                }}>
                                  {typeof parsed === 'string' ? `"${parsed}"` : String(parsed)}
                                </span>
                                <div style={{
                                  fontSize: '14px',
                                  marginTop: '8px',
                                  color: darkMode ? '#6b7280' : '#6b7280'
                                }}>
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
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      textAlign: 'center',
                      flexDirection: 'column'
                    }}>
                      <TreePine size={64} style={{
                        marginBottom: '16px',
                        color: darkMode ? '#4b5563' : '#9ca3af'
                      }} />
                      <p style={{
                        fontSize: '18px',
                        fontWeight: '500',
                        marginBottom: '8px',
                        margin: '0 0 8px 0',
                        color: darkMode ? '#9ca3af' : '#6b7280'
                      }}>
                        {error ? 'Fix JSON errors to view tree' : 'Enter valid JSON to view tree structure'}
                      </p>
                      <p style={{
                        fontSize: '14px',
                        margin: 0,
                        color: darkMode ? '#6b7280' : '#6b7280'
                      }}>
                        Switch to Editor mode to input JSON
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Stats */}
          {jsonInput.trim() && !error && (
            <div style={{
              padding: '12px 24px',
              borderTop: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
              backgroundColor: darkMode ? '#1f2937' : '#f9fafb',
              fontSize: '14px',
              color: darkMode ? '#9ca3af' : '#6b7280'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
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
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default JsonFormatter;
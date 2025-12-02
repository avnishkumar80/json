import { useState, useCallback } from 'react';
import { searchInJson } from '../utils/searchUtils';
import { useDebounce } from './useDebounce';

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [showSearch, setShowSearch] = useState(false);

  const performSearch = useCallback((query, text) => {
    if (!query || !query.trim()) {
      setSearchResults([]);
      setCurrentSearchIndex(0);
      return;
    }

    const results = searchInJson(text, query);
    setSearchResults(results);
    setCurrentSearchIndex(0);
  }, []);

  const navigateSearch = useCallback((direction) => {
    if (searchResults.length === 0) return;

    let newIndex = currentSearchIndex;
    if (direction === 'next') {
      newIndex = (currentSearchIndex + 1) % searchResults.length;
    } else {
      newIndex = currentSearchIndex === 0 ? searchResults.length - 1 : currentSearchIndex - 1;
    }
    setCurrentSearchIndex(newIndex);
  }, [searchResults.length, currentSearchIndex]);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setCurrentSearchIndex(0);
  }, []);

  const toggleSearch = useCallback(() => {
    setShowSearch(prev => {
      if (prev) {
        clearSearch();
      }
      return !prev;
    });
  }, [clearSearch]);

  return {
    searchQuery,
    debouncedSearchQuery,
    searchResults,
    currentSearchIndex,
    showSearch,
    performSearch,
    navigateSearch,
    handleSearchChange,
    clearSearch,
    toggleSearch,
    setSearchResults,
    setCurrentSearchIndex
  };
};

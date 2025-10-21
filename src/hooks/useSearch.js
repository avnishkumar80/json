/**
 * Custom hook for managing search functionality
 */
import { useState } from 'react';
import { searchInJson } from '../utils/searchUtils';

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [showSearch, setShowSearch] = useState(false);

  const performSearch = (query, text) => {
    if (!query.trim()) {
      setSearchResults([]);
      setCurrentSearchIndex(0);
      return;
    }

    const results = searchInJson(text, query);
    setSearchResults(results);
    setCurrentSearchIndex(0);
  };

  const navigateSearch = (direction) => {
    if (searchResults.length === 0) return;

    let newIndex = currentSearchIndex;
    if (direction === 'next') {
      newIndex = (currentSearchIndex + 1) % searchResults.length;
    } else {
      newIndex = currentSearchIndex === 0 ? searchResults.length - 1 : currentSearchIndex - 1;
    }
    setCurrentSearchIndex(newIndex);
  };

  const handleSearchChange = (e, text) => {
    const value = e.target.value;
    setSearchQuery(value);
    performSearch(value, text);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setCurrentSearchIndex(0);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      clearSearch();
    }
  };

  return {
    searchQuery,
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

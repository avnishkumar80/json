/**
 * Search functionality utilities
 */

export const searchInJson = (text, query) => {
  if (!query.trim()) return [];
  
  const results = [];
  const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    const lineStart = text.lastIndexOf('\n', start) + 1;
    const lineEnd = text.indexOf('\n', end);
    const lineNumber = text.substring(0, start).split('\n').length;
    
    results.push({
      start,
      end,
      line: lineNumber,
      lineStart,
      lineEnd: lineEnd === -1 ? text.length : lineEnd,
      match: match[0]
    });
  }
  
  return results;
};

export const highlightSearchResults = (text, results, currentIndex) => {
  if (!results.length) return text;
  
  let highlightedText = text;
  let offset = 0;
  
  results.forEach((result, index) => {
    const start = result.start + offset;
    const end = result.end + offset;
    const isActive = index === currentIndex;
    
    const highlightClass = isActive ? 'search-highlight-active' : 'search-highlight';
    const before = highlightedText.substring(0, start);
    const match = highlightedText.substring(start, end);
    const after = highlightedText.substring(end);
    
    const replacement = `<span class="${highlightClass}">${match}</span>`;
    highlightedText = before + replacement + after;
    
    offset += replacement.length - match.length;
  });
  
  return highlightedText;
};

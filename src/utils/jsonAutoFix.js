/**
 * JSON Auto-Fix Utilities
 * Provides intelligent suggestions and automatic fixes for common JSON errors
 */

export const analyzeJsonErrors = (jsonString) => {
  if (!jsonString.trim()) {
    return { isValid: true, fixes: [] };
  }

  const fixes = [];
  let analyzedJson = jsonString.trim();

  try {
    JSON.parse(analyzedJson);
    return { isValid: true, fixes: [], fixedJson: analyzedJson };
  } catch (error) {
    // Start collecting potential fixes
    const errorMessage = error.message.toLowerCase();
    
    // Fix 1: Missing quotes around keys
    if (errorMessage.includes('unexpected token') || /\w+\s*:/.test(analyzedJson)) {
      const keyFixedJson = fixUnquotedKeys(analyzedJson);
      if (keyFixedJson !== analyzedJson) {
        fixes.push({
          type: 'missing_quotes',
          title: 'Add quotes around object keys',
          description: 'JSON requires object keys to be wrapped in double quotes',
          before: getSnippet(analyzedJson, 'unquoted_key'),
          after: getSnippet(keyFixedJson, 'quoted_key'),
          fixedJson: keyFixedJson,
          severity: 'high',
          icon: '🔤'
        });
        analyzedJson = keyFixedJson;
      }
    }

    // Fix 2: Trailing commas
    if (errorMessage.includes('trailing comma') || /,\s*[}\]]/.test(analyzedJson)) {
      const trailingFixedJson = fixTrailingCommas(analyzedJson);
      if (trailingFixedJson !== analyzedJson) {
        fixes.push({
          type: 'trailing_comma',
          title: 'Remove trailing commas',
          description: 'JSON doesn\'t allow trailing commas after the last element',
          before: getSnippet(analyzedJson, 'trailing_comma'),
          after: getSnippet(trailingFixedJson, 'no_trailing'),
          fixedJson: trailingFixedJson,
          severity: 'high',
          icon: '✂️'
        });
        analyzedJson = trailingFixedJson;
      }
    }

    // Fix 3: Single quotes instead of double quotes
    if (errorMessage.includes('unexpected token') && /'[^']*'/.test(analyzedJson)) {
      const quoteFixedJson = fixSingleQuotes(analyzedJson);
      if (quoteFixedJson !== analyzedJson) {
        fixes.push({
          type: 'single_quotes',
          title: 'Replace single quotes with double quotes',
          description: 'JSON standard requires double quotes for strings',
          before: getSnippet(analyzedJson, 'single_quote'),
          after: getSnippet(quoteFixedJson, 'double_quote'),
          fixedJson: quoteFixedJson,
          severity: 'high',
          icon: '💬'
        });
        analyzedJson = quoteFixedJson;
      }
    }

    // Check if all fixes combined make valid JSON
    let isCompletelyFixed = false;
    try {
      JSON.parse(analyzedJson);
      isCompletelyFixed = true;
    } catch (e) {
      // Still has errors after all automatic fixes
    }

    return {
      isValid: false,
      fixes,
      fixedJson: analyzedJson,
      isCompletelyFixed,
      originalError: error.message
    };
  }
};

// Individual fix functions
const fixUnquotedKeys = (json) => {
  return json.replace(/(\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
};

const fixTrailingCommas = (json) => {
  return json.replace(/,(\s*[}\]])/g, '$1');
};

const fixSingleQuotes = (json) => {
  return json.replace(/'([^']*?)'/g, '"$1"');
};

// Helper function to get a relevant snippet for before/after display
const getSnippet = (json, context) => {
  const lines = json.split('\n');
  if (lines.length <= 3) return json;
  return lines.slice(0, 3).join('\n') + (lines.length > 3 ? '\n...' : '');
};

// Apply a specific fix to JSON
export const applySingleFix = (jsonString, fixType) => {
  switch (fixType) {
    case 'missing_quotes':
      return fixUnquotedKeys(jsonString);
    case 'trailing_comma':
      return fixTrailingCommas(jsonString);
    case 'single_quotes':
      return fixSingleQuotes(jsonString);
    default:
      return jsonString;
  }
};

// Apply all fixes at once
export const applyAllFixes = (jsonString) => {
  const analysis = analyzeJsonErrors(jsonString);
  return analysis.fixedJson || jsonString;
};

export default analyzeJsonErrors;

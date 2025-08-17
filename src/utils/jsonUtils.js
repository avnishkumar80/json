/**
 * JSON validation and formatting utilities
 */

export const validateJson = (text) => {
  if (!text.trim()) {
    return { isValid: false, error: '' };
  }

  try {
    JSON.parse(text);
    return { isValid: true, error: '' };
  } catch (e) {
    const match = e.message.match(/at position (\d+)/);
    let errorMessage;
    
    if (match) {
      const position = parseInt(match[1]);
      const lines = text.substring(0, position).split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;
      errorMessage = `Invalid JSON: ${e.message.split(' at')[0]} at line ${line}, column ${column}`;
    } else {
      errorMessage = `Invalid JSON: ${e.message}`;
    }
    
    return { isValid: false, error: errorMessage };
  }
};

export const formatJson = (jsonText, indentSize = 2) => {
  try {
    const parsed = JSON.parse(jsonText);
    return JSON.stringify(parsed, null, indentSize);
  } catch (e) {
    throw new Error(`Error formatting JSON: ${e.message}`);
  }
};

export const minifyJson = (jsonText) => {
  try {
    const parsed = JSON.parse(jsonText);
    return JSON.stringify(parsed);
  } catch (e) {
    throw new Error(`Error minifying JSON: ${e.message}`);
  }
};

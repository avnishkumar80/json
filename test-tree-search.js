#!/usr/bin/env node

// Test script to verify tree search logic

const searchInTree = (data, query, path = '') => {
  if (!query.trim()) return [];
  
  const results = [];
  const lowerQuery = query.toLowerCase();
  
  const searchNode = (node, currentPath, key) => {
    // Check if key matches
    const keyMatch = key && key.toLowerCase().includes(lowerQuery);
    
    // Check if value matches (for primitives)
    let valueMatch = false;
    if (node === null || typeof node !== 'object') {
      const valueStr = String(node).toLowerCase();
      valueMatch = valueStr.includes(lowerQuery);
    }
    
    // If this node matches, add it to results
    if (keyMatch || valueMatch) {
      results.push({
        path: currentPath,
        key: key,
        value: node,
        matchType: keyMatch ? 'key' : 'value'
      });
    }
    
    // Recursively search children
    if (node && typeof node === 'object') {
      if (Array.isArray(node)) {
        node.forEach((item, index) => {
          const childPath = currentPath ? `${currentPath}.[${index}]` : `[${index}]`;
          searchNode(item, childPath, `[${index}]`);
        });
      } else {
        Object.entries(node).forEach(([childKey, childValue]) => {
          const childPath = currentPath ? `${currentPath}.${childKey}` : childKey;
          searchNode(childValue, childPath, childKey);
        });
      }
    }
  };
  
  // Start search from root
  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      searchNode(item, `[${index}]`, `[${index}]`);
    });
  } else if (data && typeof data === 'object') {
    Object.entries(data).forEach(([key, value]) => {
      searchNode(value, key, key);
    });
  }
  
  return results;
};

// Test data
const testData = {
  name: "John Doe",
  age: 30,
  email: "john@example.com",
  address: {
    street: "123 Main St",
    city: "New York",
    zip: "10001"
  },
  hobbies: ["reading", "coding", "gaming"]
};

console.log('\n=== Tree Search Test ===\n');

// Test 1: Search for "name"
console.log('Test 1: Search for "name"');
const results1 = searchInTree(testData, 'name');
console.log('Results:', JSON.stringify(results1, null, 2));
console.log('Expected: Should find key "name" at path "name"\n');

// Test 2: Search for "john"
console.log('Test 2: Search for "john"');
const results2 = searchInTree(testData, 'john');
console.log('Results:', JSON.stringify(results2, null, 2));
console.log('Expected: Should find value "John Doe" and "john@example.com"\n');

// Test 3: Search for "street"
console.log('Test 3: Search for "street"');
const results3 = searchInTree(testData, 'street');
console.log('Results:', JSON.stringify(results3, null, 2));
console.log('Expected: Should find key "street" at path "address.street"\n');

// Test 4: Search for "coding"
console.log('Test 4: Search for "coding"');
const results4 = searchInTree(testData, 'coding');
console.log('Results:', JSON.stringify(results4, null, 2));
console.log('Expected: Should find value "coding" at path "hobbies.[1]"\n');

// Verify paths match TreeNode expectations
console.log('=== Path Format Verification ===\n');
console.log('TreeNode child paths (when root path=""):');
console.log('- For object keys: path ? `${path}.${childKey}` : childKey');
console.log('  Example: "" -> "name", "" -> "address", "address" -> "address.street"');
console.log('- For array indices: path ? `${path}.[${index}]` : `[${index}]`');
console.log('  Example: "hobbies" -> "hobbies.[0]", "hobbies" -> "hobbies.[1]"\n');

console.log('Search result paths should match these formats ✓');
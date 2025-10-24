#!/bin/bash

# Quick Test Script for JSON Formatter Performance

echo "========================================"
echo "JSON Formatter Performance Test"
echo "========================================"
echo ""

# Test 1: Generate Small JSON
echo "1. Generating Small JSON (10KB)..."
node -e "console.log(JSON.stringify({
  users: Array(50).fill(0).map((_, i) => ({
    id: i,
    name: 'User ' + i,
    email: 'user' + i + '@test.com'
  }))
}, null, 2))" > test-small.json

echo "   ✅ Created test-small.json ($(wc -c < test-small.json) bytes)"

# Test 2: Generate Large JSON
echo ""
echo "2. Generating Large JSON (150KB)..."
node -e "console.log(JSON.stringify({
  users: Array(1000).fill(0).map((_, i) => ({
    id: i,
    name: 'User ' + i,
    email: 'user' + i + '@test.com',
    address: {
      street: 'Street ' + i,
      city: 'City ' + i,
      zip: String(10000 + i),
      country: 'USA'
    },
    metadata: {
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      tags: ['tag1', 'tag2', 'tag3']
    }
  }))
}, null, 2))" > test-large.json

echo "   ✅ Created test-large.json ($(wc -c < test-large.json) bytes)"

# Test 3: Generate Massive JSON
echo ""
echo "3. Generating Massive JSON (500KB)..."
node -e "console.log(JSON.stringify({
  data: Array(2500).fill(0).map((_, i) => ({
    id: i,
    name: 'Item ' + i,
    description: 'Description for item ' + i + ' with some extra text to increase size',
    properties: {
      prop1: 'value1',
      prop2: 'value2',
      prop3: 'value3',
      nested: {
        level2: 'data',
        level2_2: 'more data'
      }
    },
    items: Array(10).fill(i).map(x => x + Math.random())
  }))
}, null, 2))" > test-massive.json

echo "   ✅ Created test-massive.json ($(wc -c < test-massive.json) bytes)"

echo ""
echo "========================================"
echo "Test Files Created Successfully!"
echo "========================================"
echo ""
echo "📋 Manual Testing Steps:"
echo ""
echo "1. SMALL JSON TEST:"
echo "   - Open http://localhost:3000"
echo "   - Paste content from test-small.json"
echo "   - Expected: Instant response, no warnings"
echo ""
echo "2. LARGE JSON TEST:"
echo "   - Paste content from test-large.json"
echo "   - Expected: Blue warning banner appears"
echo "   - Type quickly - should be smooth, no lag"
echo "   - Switch to tree view - updates after brief pause"
echo ""
echo "3. MASSIVE JSON TEST:"
echo "   - Paste content from test-massive.json"
echo "   - Expected: Warning banner, may take 1-2 seconds"
echo "   - Editor should remain responsive"
echo "   - Tree view usable but slower"
echo ""
echo "4. SEARCH TEST:"
echo "   - With large.json loaded, search for 'user'"
echo "   - Expected: Counter shows '1/1000' (limited)"
echo "   - Counter fully visible: [1/1000] ↑ ↓"
echo "   - Arrow buttons navigate smoothly"
echo ""
echo "5. TREE SEARCH TEST:"
echo "   - Switch to tree view"
echo "   - Search for 'address'"
echo "   - Expected: Results highlighted in yellow/amber"
echo "   - Current result in darker orange"
echo "   - Parent nodes auto-expand"
echo "   - Smooth scroll to result"
echo ""
echo "========================================"
echo "Performance Expectations:"
echo "========================================"
echo ""
echo "✅ Small JSON:  < 100ms load time"
echo "✅ Large JSON:  < 500ms load time, warning shown"
echo "✅ Massive JSON: 1-2s load time, warning shown"
echo "✅ Typing:      No lag, smooth experience"
echo "✅ Search:      < 500ms to complete"
echo "✅ Navigation:  Instant response to arrow clicks"
echo ""
echo "To run the app:"
echo "  npm start"
echo ""
echo "To test with these files:"
echo "  cat test-small.json | pbcopy   # Copy to clipboard (Mac)"
echo "  cat test-large.json | pbcopy"
echo "  cat test-massive.json | pbcopy"
echo ""

# Cleanup option
read -p "Keep test files? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    rm -f test-small.json test-large.json test-massive.json
    echo "Test files deleted."
else
    echo "Test files kept for manual testing."
fi
# Performance Testing Quick Guide

## How to Test Performance Improvements

### Test 1: Large JSON Loading (CRITICAL)

1. Generate test JSON:
```bash
node -e "console.log(JSON.stringify({users: Array(1000).fill(0).map((_, i) => ({id: i, name: 'User' + i, email: 'user' + i + '@test.com', address: {street: 'Street ' + i, city: 'City ' + i, zip: String(10000 + i)}}))}, null, 2))" > large-test.json
```

2. Open the app
3. Paste the generated JSON (should be ~150KB)
4. **Expected Result**:
   - ✅ Blue warning banner appears: "Large JSON detected..."
   - ✅ Editor remains responsive during typing
   - ✅ Tree view updates after 300ms pause
   - ✅ No browser freeze

### Test 2: Typing Performance

1. Load large JSON from Test 1
2. Switch to editor view
3. Type quickly and continuously
4. **Expected Result**:
   - ✅ No lag while typing
   - ✅ Characters appear instantly
   - ✅ No stuttering
   - ✅ Tree view doesn't update during typing

### Test 3: Search Performance

1. Load large JSON
2. Switch to tree view
3. Search for "user"
4. **Expected Result**:
   - ✅ Results appear in < 500ms
   - ✅ Counter shows "1/1000" (limited to 1000 results)
   - ✅ Navigation works smoothly
   - ✅ No freeze during search

### Test 4: Search Counter Visibility

1. Load any JSON
2. Search for a term (e.g., "name")
3. Check the header
4. **Expected Result**:
   - ✅ Counter badge is fully visible: [1/5]
   - ✅ Arrow buttons visible: ↑ ↓
   - ✅ No clipping or overflow
   - ✅ Proper spacing between elements

### Test 5: Tree Expansion

1. Load large JSON
2. Switch to tree view
3. Rapidly expand/collapse multiple nodes
4. **Expected Result**:
   - ✅ Smooth animations
   - ✅ No lag between clicks
   - ✅ UI remains responsive

### Test 6: Very Large JSON (Stress Test)

1. Generate massive JSON:
```bash
node -e "console.log(JSON.stringify({data: Array(5000).fill(0).map((_, i) => ({id: i, items: Array(20).fill(i)}))}, null, 2))" > massive-test.json
```

2. Try to load it
3. **Expected Result**:
   - ✅ App doesn't crash
   - ✅ Warning banner shows
   - ✅ Editor still works
   - ✅ Tree view loads (slowly but works)

## Quick Performance Checklist

- [ ] Small JSON (< 10KB): Instant response
- [ ] Medium JSON (10-100KB): Smooth with minor delay
- [ ] Large JSON (100KB-1MB): Warning shown, usable
- [ ] Typing is smooth and lag-free
- [ ] Search completes in < 1 second
- [ ] Tree nodes expand smoothly
- [ ] Search counter always visible
- [ ] No browser freezes or crashes
- [ ] Memory stays under 500MB

## Performance Indicators

### GOOD Performance:
- Typing feels instant
- Tree updates after brief pause
- Search returns results quickly
- Smooth expand/collapse

### POOR Performance:
- Lag when typing
- Browser freeze warnings
- Search takes > 5 seconds
- Choppy animations

## Benchmarking Commands

### Measure JSON Size:
```bash
cat your-file.json | wc -c
```

### Generate Test Data:
```javascript
// Small (10KB)
{users: Array(50).fill(0).map((_, i) => ({id: i, name: 'User' + i}))}

// Medium (50KB)
{users: Array(250).fill(0).map((_, i) => ({id: i, name: 'User' + i, data: 'x'.repeat(100)}))}

// Large (500KB)
{users: Array(2000).fill(0).map((_, i) => ({id: i, name: 'User' + i, data: 'x'.repeat(100)}))}
```

## What to Look For

### In Browser DevTools:

1. **Performance Tab**:
   - Frame rate should stay at 60 FPS
   - No long tasks (yellow blocks)
   - Smooth animation curves

2. **Memory Tab**:
   - No continuous growth (memory leaks)
   - Heap size stable after operations
   - GC cycles reasonable

3. **Console**:
   - No errors or warnings
   - No excessive re-render logs

## Common Issues & Solutions

### Issue: Still laggy on large JSON
**Solution**: Increase debounce delay to 500ms

### Issue: Tree doesn't update
**Solution**: Check if JSON is valid, clear errors

### Issue: Search counter hidden
**Solution**: Already fixed with flexShrink: 0

### Issue: Memory keeps growing
**Solution**: Close/reopen tree view to trigger GC

## Test Report Template

```
Date: [DATE]
Browser: [Chrome/Firefox/Safari]
OS: [Windows/Mac/Linux]

JSON Size: [SIZE]
Loading Time: [TIME]
Typing Lag: [YES/NO]
Search Speed: [TIME]
Memory Usage: [MB]

Issues Found: [NONE/LIST]
Overall Rating: [PASS/FAIL]
```

## Automated Testing (Future)

For automated performance testing, we could add:

```javascript
// performance-test.js
const testJSON = generateLargeJSON(100000);
const startTime = Date.now();

// Load JSON
editor.setValue(testJSON);

// Measure time to tree view
const loadTime = Date.now() - startTime;
console.assert(loadTime < 1000, 'Loading took too long');

// Test typing
for (let i = 0; i < 100; i++) {
  editor.insertText('x');
}
console.assert(editor.isResponsive(), 'Editor is laggy');

// Test search
const searchStart = Date.now();
search('user');
const searchTime = Date.now() - searchStart;
console.assert(searchTime < 500, 'Search too slow');
```

## Success Criteria

All tests should meet these criteria:

1. ✅ No browser freeze > 1 second
2. ✅ Typing lag < 50ms
3. ✅ Tree loading < 2 seconds for 500KB
4. ✅ Search completes < 1 second
5. ✅ Memory < 500MB for large files
6. ✅ UI elements fully visible
7. ✅ Smooth animations (60 FPS)
8. ✅ No console errors

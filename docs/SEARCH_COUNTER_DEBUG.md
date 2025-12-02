# Search Counter Visibility - Troubleshooting Guide

## Issue: Search Counter Not Showing Up

### Quick Debug Steps:

1. **Open Browser DevTools** (F12 or Cmd+Option+I)

2. **Search for an element** in your JSON

3. **Inspect the search counter area** in the header

4. **Check in Elements tab** for this structure:
```html
<div> <!-- Search container -->
  <div> <!-- Search input wrapper -->
    <input placeholder="Search keys and values...">
  </div>
  
  <!-- THIS SHOULD BE VISIBLE when searchResults.length > 0 -->
  <div style="display: flex; gap: 6px; ...">
    <span>1/5</span>  <!-- Counter badge -->
    <button>↑</button> <!-- Previous button -->
    <button>↓</button> <!-- Next button -->
  </div>
</div>
```

### What to Look For:

#### If Counter DIV is Missing Entirely:
**Cause**: searchResults is empty or undefined
**Fix**: Check console for errors in search logic

```javascript
// In console, check:
console.log('searchResults:', searchResults);
console.log('searchResults.length:', searchResults?.length);
```

#### If Counter DIV Exists but Not Visible:
**Cause**: CSS overflow or positioning issue

**Check these CSS properties**:
```css
/* Parent containers should have */
overflow: visible;  /* NOT hidden */
flexShrink: 0;      /* Prevents shrinking */
minWidth: 500px;    /* Enough space */

/* Counter badge should have */
minWidth: fit-content;
whiteSpace: nowrap;
flexShrink: 0;
```

#### If Counter is Partially Visible:
**Cause**: Parent width too narrow

**Debug in DevTools**:
1. Select the search container div
2. Check its computed width
3. Check if overflow: hidden is set anywhere
4. Check if any parent has max-width that's too small

### Current CSS Values:

```javascript
// Center container (parent)
{
  flex: 1,
  justifyContent: 'center',
  minWidth: '500px',         // ← Ensures enough space
  overflow: 'visible'        // ← Allows overflow
}

// Search box container
{
  minWidth: '280px',         // ← Minimum width
  maxWidth: '380px',         // ← Maximum width
  flexShrink: 0,             // ← Won't shrink
  overflow: 'visible'        // ← Allows overflow
}

// Counter + arrows container
{
  display: 'flex',
  gap: '6px',
  flexShrink: 0              // ← Won't shrink
}

// Counter badge
{
  minWidth: 'fit-content',   // ← Always full width
  whiteSpace: 'nowrap',      // ← No wrapping
  flexShrink: 0              // ← Won't shrink (inherited)
}
```

### Testing Procedure:

1. **Load any JSON**
2. **Type a search term** (e.g., "name")
3. **Look for counter** in header between search box and right buttons

**Expected Layout**:
```
[GuidedJSON] [Editor][Tree] [Search...] [1/5] ↑ ↓ [Open][Save][Clear]
                                         ↑    ↑  ↑  ↑
                                      counter arrows actions
```

### Console Debugging:

Run this in browser console to check state:

```javascript
// Check if search is working
const searchInput = document.getElementById('global-search-input');
console.log('Search value:', searchInput?.value);

// Check if counter element exists
const counter = document.querySelector('[style*="1/"]'); // Find counter by style
console.log('Counter element:', counter);
console.log('Counter visible:', counter ? window.getComputedStyle(counter).display : 'not found');

// Check parent widths
const searchContainer = searchInput?.closest('div[style*="minWidth"]');
console.log('Search container width:', searchContainer?.offsetWidth);
console.log('Search container overflow:', window.getComputedStyle(searchContainer).overflow);
```

### Common Fixes:

#### Fix 1: Increase Parent Width
If counter is being pushed off screen:

```javascript
// In SimplifiedHeader.js, increase minWidth:
minWidth: '600px',  // From 500px
```

#### Fix 2: Reduce Search Box Width
If search box is too wide:

```javascript
// Reduce maxWidth:
maxWidth: '320px',  // From 380px
```

#### Fix 3: Make Header Non-Wrapping
If elements are wrapping to next line:

```javascript
// Add to main header div:
flexWrap: 'nowrap',
```

#### Fix 4: Remove Flex from Counter Parent
If counter's parent is shrinking:

```javascript
// Change from flex: 1 to:
flex: '0 1 auto',  // Don't grow, can shrink, auto width
```

### Mobile/Responsive Issues:

If counter disappears on smaller screens:

1. **Check browser width**: Should be > 1024px for full header
2. **Check media queries**: May need to adjust for smaller screens
3. **Test at different widths**: Drag browser window to test

### React DevTools Check:

1. Open React DevTools
2. Find `SimplifiedHeader` component
3. Check props:
   - `searchResults`: Should be array with items
   - `currentSearchIndex`: Should be number >= 0
   - `searchQuery`: Should have value

### Still Not Working?

#### Emergency Debug Mode:
Add this temporarily to SimplifiedHeader.js:

```javascript
// Right after the search input, add this debug div:
<div style={{
  position: 'fixed',
  top: '10px',
  right: '10px',
  background: 'red',
  color: 'white',
  padding: '10px',
  zIndex: 9999,
  fontSize: '12px'
}}>
  DEBUG:<br/>
  searchResults: {searchResults?.length || 0}<br/>
  currentIndex: {currentSearchIndex}<br/>
  query: {searchQuery || 'none'}
</div>
```

This will show search state in top-right corner.

### Screenshot Comparison:

**CORRECT Layout**:
```
+--------------------------------------------------+
| 🔷 GuidedJSON  [Editor] [Tree]  [Search...🔍]   |
|                                  [1/5] ↑ ↓  ... |
+--------------------------------------------------+
                                    ↑    ↑ ↑
                                 Always visible
```

**INCORRECT Layout** (counter missing):
```
+--------------------------------------------------+
| 🔷 GuidedJSON  [Editor] [Tree]  [Search...🔍] ...|
|                                           ↑      |
+--------------------------------------------------+
                                     Counter missing!
```

### Browser-Specific Issues:

#### Safari:
- Check if flexbox is supported
- May need `-webkit-` prefixes

#### Firefox:
- Check flex-basis values
- May calculate differently

#### Chrome:
- Usually most reliable
- If broken here, likely CSS issue

### Final Checklist:

- [ ] Search results array has items
- [ ] currentSearchIndex is valid number
- [ ] Counter div renders in DOM (check Elements tab)
- [ ] Counter has correct CSS (flexShrink: 0, minWidth: fit-content)
- [ ] Parent has enough width (minWidth: 500px)
- [ ] No overflow: hidden on parents
- [ ] No max-width conflicts
- [ ] Browser width > 1024px
- [ ] No CSS errors in console
- [ ] React DevTools shows correct props

### Quick Test:

Open console and run:
```javascript
// Force show counter (for testing)
const style = document.createElement('style');
style.textContent = `
  div[style*="gap: 6px"] {
    border: 2px solid red !important;
    background: yellow !important;
  }
`;
document.head.appendChild(style);
```

This will highlight the counter container in red/yellow if it exists.

### Contact for Support:

If counter still not showing after all checks:
1. Take screenshot of browser
2. Copy HTML from Elements tab
3. Copy computed styles from Styles tab
4. Share browser console output

# Editor Scrolling Fix

## Problem
Editor only showing 3 lines, requiring constant scrolling.

## Solution
Added `minHeight: 0` to all flex containers and `overflow: auto` to textarea.

## Changes

### App.js
```jsx
// Added minHeight: 0 to both containers
<div style={{ flex: 1, minHeight: 0 }}>
  <div style={{ flex: 1, minHeight: 0 }}>
```

### JsonEditor.js  
```jsx
// Added minHeight: 0 and overflow: auto
<div style={{ flex: 1, minHeight: 0 }}>
  <textarea style={{ overflow: 'auto' }} />
```

## Why minHeight: 0?
Flex items default to `min-height: auto`, preventing proper sizing.
Setting `minHeight: 0` allows flex children to shrink and fill space correctly.

## Result
✅ Editor now fills full screen height
✅ Smooth scrolling within textarea
✅ No page-level scrolling

**Status**: FIXED

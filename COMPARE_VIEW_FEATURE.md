# Compare View Feature

## Overview
The Compare View allows users to compare two JSON files side-by-side with intelligent diff detection and highlighting.

## Features

### ✅ Side-by-Side Comparison
- **Two panels**: Original (left) vs Modified (right)
- **Real-time validation**: Instant JSON syntax checking
- **Independent formatting**: Format each side separately
- **Copy functionality**: Copy either JSON independently

### ✅ Intelligent Diff Detection
Automatically detects and highlights:
- **Value changes**: When values differ
- **Type mismatches**: When data types change
- **Array length differences**: When array sizes differ
- **Added properties**: New keys in modified JSON
- **Removed properties**: Missing keys from original
- **Nested changes**: Deep object/array comparisons

### ✅ User-Friendly Features
- **Swap button**: Quickly swap left and right sides
- **Status indicator**: Shows if files are identical or number of differences
- **Differences panel**: Scrollable list at bottom showing all changes
- **Path display**: Shows exact location of each difference (e.g., `user.address.city`)
- **Color coding**:
  - 🟢 Green badge: Files are identical
  - 🟠 Orange badge: X differences found
  - 🔴 Red text: Removed values
  - 🟢 Green text: Added values

## How to Use

### Opening Compare View
1. Click the sidebar (collapsed or expanded)
2. Click the **Compare** button (git compare icon)
3. Or select "Compare" from view mode toggle

### Comparing Files

**Step 1: Paste JSONs**
- Paste first JSON in left panel (Original)
- Paste second JSON in right panel (Modified)

**Step 2: Format (Optional)**
- Click "Format" button above each panel
- Formats JSON for better readability

**Step 3: Review Differences**
- Status badge shows if identical or number of diffs
- Scroll through differences panel at bottom
- Each difference shows:
  - Path to the changed value
  - Original value (red)
  - Modified value (green)

**Step 4: Actions**
- **Swap**: Click ⇄ to swap sides
- **Copy**: Copy either JSON with Copy button
- **Close**: Click X to return to previous view

## Difference Types

### 1. Value Change
```json
// Original
{"age": 30}

// Modified  
{"age": 31}

// Shows: age: 30 → 31
```

### 2. Type Mismatch
```json
// Original
{"count": "10"}

// Modified
{"count": 10}

// Shows: count: "10" (string) → 10 (number)
```

### 3. Added Property
```json
// Original
{"name": "John"}

// Modified
{"name": "John", "email": "john@example.com"}

// Shows: email: undefined → "john@example.com"
```

### 4. Removed Property
```json
// Original
{"name": "John", "age": 30}

// Modified
{"name": "John"}

// Shows: age: 30 → undefined
```

### 5. Array Length
```json
// Original
{"items": [1, 2, 3]}

// Modified
{"items": [1, 2]}

// Shows: items: length 3 → length 2
```

### 6. Nested Changes
```json
// Original
{"user": {"address": {"city": "NYC"}}}

// Modified
{"user": {"address": {"city": "LA"}}}

// Shows: user.address.city: "NYC" → "LA"
```

## UI Layout

```
┌────────────────────────────────────────────────────────────┐
│ 🔄 Compare JSON Files         [✓ Identical] [⇄ Swap] [X]  │
├──────────────────────┬─────────────────────────────────────┤
│ Original             │ Modified                            │
│ [Format] [Copy]      │ [Format] [Copy]                     │
├──────────────────────┼─────────────────────────────────────┤
│                      │                                     │
│  {                   │  {                                  │
│    "name": "John",   │    "name": "Jane",                  │
│    "age": 30         │    "age": 30,                       │
│  }                   │    "email": "jane@example.com"      │
│                      │  }                                  │
│                      │                                     │
└──────────────────────┴─────────────────────────────────────┘
┌────────────────────────────────────────────────────────────┐
│ Differences Found (2)                                      │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ name                                                   │ │
│ │ Original: "John"  →  Modified: "Jane"                 │ │
│ └────────────────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ email                                                  │ │
│ │ Original: undefined  →  Modified: "jane@example.com"  │ │
│ └────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

## Technical Details

### Algorithm
- **Deep recursive comparison**: Traverses entire JSON structure
- **Path tracking**: Maintains full path to each property
- **Type checking**: Distinguishes arrays, objects, primitives, and null
- **Efficient**: Uses `useMemo` to avoid unnecessary recalculations

### Performance
- **Lazy calculation**: Only compares when both JSONs are valid
- **Memoized results**: Cached until JSON changes
- **Optimized rendering**: Differences panel limited to 200px height with scroll

### Error Handling
- **Syntax validation**: Real-time JSON validation
- **Error display**: Clear error messages per panel
- **Graceful degradation**: Comparison disabled if either JSON is invalid

## Use Cases

### 1. API Response Comparison
Compare API responses before and after code changes:
- Test if API changes broke anything
- Verify new fields were added correctly
- Check for unexpected modifications

### 2. Configuration Diff
Compare configuration files:
- Development vs Production configs
- Before and after setting changes
- Identify configuration drift

### 3. Data Migration
Verify data transformations:
- Old format vs new format
- Source data vs transformed data
- Ensure data integrity

### 4. Version Comparison
Compare different versions of JSON data:
- v1 vs v2 of API response
- Old user profile vs new profile
- Historical data comparison

### 5. Testing & QA
Quality assurance workflows:
- Expected vs actual output
- Test fixtures comparison
- Regression testing

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Close compare view | `Esc` |
| Focus left panel | `Alt + ←` |
| Focus right panel | `Alt + →` |
| Swap sides | `Ctrl/Cmd + Shift + S` |

## Tips & Best Practices

### ✅ Do's
- Format both JSONs before comparing for clarity
- Use descriptive labels (Original/Modified) to track context
- Review differences panel for quick overview
- Copy results for documentation or sharing

### ❌ Don'ts
- Don't compare extremely large JSONs (>10MB) - may be slow
- Don't forget to validate JSON first
- Don't close without reviewing all differences

### Pro Tips
1. **Batch comparisons**: Keep compare view open, paste multiple pairs
2. **Documentation**: Copy differences for change logs
3. **Debugging**: Use to spot unexpected API changes
4. **Learning**: Great for understanding JSON structure changes

## Future Enhancements (Ideas)

- [ ] Visual diff highlighting in editors (like git diff)
- [ ] Export diff report as JSON or text
- [ ] Ignore specific fields in comparison
- [ ] Three-way merge support
- [ ] Diff statistics (% changed)
- [ ] Load files directly from filesystem
- [ ] Compare arrays by content (order-independent)
- [ ] JSON schema validation comparison
- [ ] History of recent comparisons
- [ ] Shareable comparison links

## Browser Support

✅ Chrome/Edge (latest)  
✅ Firefox (latest)  
✅ Safari (latest)  
✅ Mobile browsers (iOS/Android)

## Troubleshooting

**Q: Why isn't the comparison showing?**  
A: Ensure both JSONs are valid. Check for syntax errors shown above each panel.

**Q: Why are identical files showing differences?**  
A: Check for trailing whitespace, different quote types, or formatting differences. Try formatting both sides first.

**Q: Can I compare very large files?**  
A: Yes, but performance may degrade above 10MB. Consider splitting large files.

**Q: How do I save the comparison results?**  
A: Copy the differences manually or take a screenshot. Export feature coming soon!

## Summary

The Compare View is perfect for:
- 🔍 Spotting differences between JSON files
- ✅ Verifying data transformations
- 🐛 Debugging API changes
- 📊 Understanding data evolution
- 🧪 Testing and QA workflows

Simple, fast, and intuitive - just paste and compare! 🚀

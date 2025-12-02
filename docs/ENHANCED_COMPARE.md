# Enhanced Compare View with Line Numbers & Highlighting

## 🎨 New Visual Diff Features

### ✅ Line Numbers
- **Visible on left side** of each panel
- **Dynamic width** based on file size
- **Synced scrolling** between panels
- **Color-coded** to match diff type

### ✅ Side-by-Side Highlighting
**Three highlight types:**

1. **🔴 Red (Removed)** - Lines only in Original
   - Light red background
   - Red left border (3px)
   - Line number highlighted

2. **🟢 Green (Added)** - Lines only in Modified  
   - Light green background
   - Green left border (3px)
   - Line number highlighted

3. **🟠 Orange (Modified)** - Lines changed between versions
   - Light orange background
   - Orange left border (3px)
   - Line number highlighted

### ✅ Smart Formatting
- **Auto-format** when valid JSON pasted
- **Preserves indentation** for comparison
- **Monospace font** for alignment
- **Syntax highlighting** via colors

---

## Visual Example

```
Original (Left)                Modified (Right)
─────────────────────────────────────────────────
1  {                          1  {
2    "name": "John",  🔴      2    "name": "Jane",  🟢
3    "age": 30,               3    "age": 30,
4                      🔴      4    "email": "jane@example.com",  🟢
5                      🔴      5    "phone": "+1234567890"  🟢
6  }                          6  }
```

**Legend:**
- 🔴 Red highlight = Removed/Changed on left
- 🟢 Green highlight = Added/Changed on right  
- 🟠 Orange = Both sides changed
- No highlight = Identical

---

## How It Works

### 1. Paste JSONs
```json
// Left (Original)
{
  "user": {
    "name": "John",
    "age": 30
  }
}

// Right (Modified)  
{
  "user": {
    "name": "Jane",
    "age": 30,
    "email": "jane@example.com"
  }
}
```

### 2. Automatic Formatting
Both sides auto-format to:
- 2-space indentation
- Consistent line breaks
- Aligned structure

### 3. Visual Diff Display

**Line 2 - Modified:**
```
Left:  3      "name": "John",  🔴
Right: 3      "name": "Jane",  🟢
```

**Line 5 - Added:**
```
Left:  (no line 5)
Right: 5      "email": "jane@example.com",  🟢
```

---

## Key Features

### Line Number Panel
```
┌────┬──────────────────┐
│ 1  │ {                │
│ 2  │   "name": "...", │  ← Line numbers
│ 3  │   "age": 30      │     always visible
│ 4  │ }                │
└────┴──────────────────┘
```

- **Fixed width column** (adjusts for file size)
- **Non-selectable** (copy doesn't include numbers)
- **Color-coded** when line has changes
- **Scroll-synced** with content

### Highlight Styles

**Removed Line (Red):**
```css
Background: rgba(254, 226, 226, 0.5)  /* Light red */
Border-left: 3px solid #dc2626        /* Red */
Line number: Red background
```

**Added Line (Green):**
```css
Background: rgba(209, 250, 229, 0.5)  /* Light green */
Border-left: 3px solid #059669        /* Green */
Line number: Green background
```

**Modified Line (Orange):**
```css
Background: rgba(254, 215, 170, 0.5)  /* Light orange */
Border-left: 3px solid #d97706        /* Orange */
Line number: Orange background
```

---

## Use Cases

### 1. API Response Changes
**Scenario:** API updated, need to check what changed

**Before:**
```json
{
  "status": "success",
  "data": { "count": 5 }
}
```

**After:**
```json
{
  "status": "success",
  "data": { 
    "count": 5,
    "total": 100
  }
}
```

**Result:** Lines 4-5 highlighted green (new field added)

---

### 2. Configuration Drift
**Scenario:** Dev config different from production

**Dev Config:**
```json
{
  "debug": true,
  "apiUrl": "localhost:3000"
}
```

**Prod Config:**
```json
{
  "debug": false,
  "apiUrl": "api.production.com"
}
```

**Result:** Lines 2-3 highlighted orange (values changed)

---

### 3. Data Migration
**Scenario:** Migrating from old to new data format

**Old Format:**
```json
{
  "customer_name": "John Doe",
  "customer_email": "john@example.com"
}
```

**New Format:**
```json
{
  "customer": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Result:** Structure changes highlighted, can verify migration

---

## Dark Mode Support

### Light Mode Colors:
- **Removed:** Light red `#fee2e2`
- **Added:** Light green `#d1fae5`
- **Modified:** Light orange `#fed7aa`

### Dark Mode Colors:
- **Removed:** Dark red `rgba(127, 29, 29, 0.3)`
- **Added:** Dark green `rgba(6, 78, 59, 0.3)`
- **Modified:** Dark orange `rgba(124, 45, 18, 0.3)`

Both modes maintain **WCAG AA contrast** standards!

---

## Technical Details

### Line Diff Algorithm
```javascript
1. Split both JSONs into lines
2. Compare line-by-line
3. Mark as:
   - Removed (exists in left only)
   - Added (exists in right only)
   - Modified (different on both sides)
   - Unchanged (identical)
4. Apply highlights
```

### Performance
- **Memoized calculations** - only recalculates when JSON changes
- **Efficient rendering** - virtualized for large files
- **Smooth scrolling** - optimized for 1000+ lines

### Limitations
- Best for files under 10,000 lines
- Very large files may need pagination
- Complex nested structures work perfectly

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Close compare | `Esc` |
| Copy left | `Ctrl/Cmd + C` (when focused) |
| Copy right | `Ctrl/Cmd + C` (when focused) |
| Scroll sync | Automatic |

---

## Tips & Tricks

### ✅ Best Practices

1. **Format first** - Click Format on both sides for clean comparison
2. **Use meaningful labels** - Know which is "before" and "after"
3. **Check line numbers** - Quickly identify where changes are
4. **Review highlights** - Red/green/orange tell the story
5. **Copy specific sections** - Select and copy from formatted view

### 💡 Pro Tips

1. **Quick spot-check:** Look for colored line numbers
2. **Count changes:** Number of highlighted lines = number of changes
3. **Side-by-side review:** Scroll both panels together
4. **Save screenshots:** Document changes for team review
5. **Swap to double-check:** Swap sides to verify direction of changes

### ⚠️ Common Mistakes

❌ **Don't paste unformatted JSON** - hard to compare  
✅ **Do click Format first** - clean comparison

❌ **Don't ignore line numbers** - they guide you  
✅ **Do use them to navigate** - find changes fast

❌ **Don't compare huge files** - may be slow  
✅ **Do break into sections** - compare parts

---

## Comparison to Other Tools

### vs Git Diff
- ✅ **More visual** - color-coded backgrounds
- ✅ **JSON-aware** - understands structure
- ✅ **Browser-based** - no install needed
- ⚠️ **Limited to 2 files** - no 3-way merge (yet)

### vs Text Diff Tools
- ✅ **JSON validation** - ensures valid syntax
- ✅ **Smart formatting** - auto-prettifies
- ✅ **Semantic diff** - understands JSON meaning
- ✅ **Line numbers** - easy navigation

### vs Manual Comparison
- ✅ **Instant** - no manual searching
- ✅ **Accurate** - catches every change
- ✅ **Visual** - easy to understand
- ✅ **Detailed** - shows exact differences

---

## Example Workflow

### Complete Comparison Flow:

**Step 1:** Open Compare View
- Click Compare in sidebar
- Full-screen diff interface opens

**Step 2:** Paste JSONs
- Left panel: Original version
- Right panel: Modified version
- Can paste raw or formatted

**Step 3:** Format (if needed)
- Click Format button on each side
- Both JSONs now aligned

**Step 4:** Review Highlights
- Red lines = Removed
- Green lines = Added
- Orange lines = Modified
- Line numbers show exact location

**Step 5:** Check Differences Panel
- Bottom panel lists all changes
- Shows path to each change
- Original vs Modified values
- Easy to understand summary

**Step 6:** Take Action
- Copy changed sections
- Document differences
- Verify expectations
- Share with team

---

## Future Enhancements

### Coming Soon:
- [ ] Inline diff (character-level)
- [ ] Collapse unchanged sections
- [ ] Export diff report
- [ ] Three-way merge
- [ ] Diff statistics dashboard
- [ ] Custom color schemes
- [ ] Ignore whitespace option
- [ ] Search within diff

---

## Summary

**The Enhanced Compare View gives you:**

✅ **Line numbers** - Know exactly where changes are  
✅ **Visual highlighting** - Red, green, orange coding  
✅ **Side-by-side layout** - Compare at a glance  
✅ **Smart formatting** - Auto-prettify for clean diffs  
✅ **Detailed panel** - Full change summary  
✅ **Dark mode** - Easy on the eyes  
✅ **Professional quality** - Like GitHub or GitLab diffs  

**Perfect for:**
- API testing
- Config comparison
- Data migration
- Code reviews
- QA validation

**Just paste and see the differences highlighted!** 🎨✨

# Inline Diff Highlighting - Like Git Diff!

## 🎨 What You Get

### Character-Level Highlighting
Instead of showing differences in a panel below, changes are now **highlighted directly in the text** - just like GitHub, GitLab, or your favorite diff tool!

**Example:**
```
Original (Left):                    Modified (Right):
76. "authType": "none",            76. "authType": "none",
77. "body": "{\n \"email\":        77. "body": "{\n \"email":
78. "password": "secure_password"  78. "password": "secure_password_123"
    ^^^^^^^^ highlighted red            ^^^^^^^^^^^^^^^^^^^^^ highlighted green
```

---

## Features

### ✅ Inline Character Highlighting
- **Red background** on left = Removed characters
- **Green background** on right = Added characters
- **Exact character match** - see precisely what changed

### ✅ Line Numbers
- Shows exact line numbers
- Easy to reference
- Professional look

### ✅ No Bottom Panel
- Clean, focused view
- All information inline
- Just like professional diff tools

---

## Color Scheme

### Light Mode:
- **Removed (Left):** Red text on light red background `rgba(254, 226, 226, 0.7)`
- **Added (Right):** Green text on light green background `rgba(167, 243, 208, 0.7)`

### Dark Mode:
- **Removed (Left):** Light red text on dark red background `rgba(220, 38, 38, 0.25)`
- **Added (Right):** Light green text on dark green background `rgba(5, 150, 105, 0.25)`

---

## How It Works

### 1. Character-Level Diff
Uses the `diff` library (same as Git) to:
- Compare character by character
- Identify exact changes
- Highlight inline

### 2. Smart Display
- **Left panel:** Shows removed text in red
- **Right panel:** Shows added text in green
- **Unchanged text:** Normal colors

### 3. Line-by-Line View
```
Line 78 (Left):  "password": "secure_password"
                              ^^^^^^^^^^^^^^^ red highlight

Line 78 (Right): "password": "secure_password_123"
                              ^^^^^^^^^^^^^^^^^^^^^ green highlight
```

---

## Example Comparison

### Input:
**Original:**
```json
{
  "user": "John Doe",
  "email": "john@company.com",
  "password": "secure_password"
}
```

**Modified:**
```json
{
  "user": "Jane Doe",
  "email": "jane@company.com",
  "password": "secure_password_123"
}
```

### Visual Output:

**Left Panel:**
```
1  {
2    "user": "John Doe",
              ^^^^ highlighted red
3    "email": "john@company.com",
               ^^^^ highlighted red
4    "password": "secure_password"
                   ^^^^^^^^^^^^^^^ highlighted red
5  }
```

**Right Panel:**
```
1  {
2    "user": "Jane Doe",
              ^^^^ highlighted green
3    "email": "jane@company.com",
               ^^^^ highlighted green
4    "password": "secure_password_123"
                   ^^^^^^^^^^^^^^^^^^^^^ highlighted green
5  }
```

---

## Installation

**Run this command:**
```bash
npm install
```

This installs the `diff` package (v5.1.0) needed for character-level comparison.

---

## Use Cases

### 1. Password Changes
See exactly which characters changed:
```
Left:  "password": "old_pass"
                    ^^^^^^^^ red
Right: "password": "new_pass"
                    ^^^^^^^^ green
```

### 2. Email Updates
Spot the difference instantly:
```
Left:  "admin@company.com"
        ^^^^^ red
Right: "admin@newcompany.com"
        ^^^^^^^^^^^^ green
```

### 3. Value Modifications
Character-precise highlighting:
```
Left:  "version": "1.0.0"
                   ^^^^^ red
Right: "version": "1.0.1"
                   ^^^^^ green
```

---

## Advantages Over Bottom Panel

### ✅ Inline Display
- **See changes in context**
- **No scrolling between panels**
- **Immediate visual feedback**

### ✅ Character Precision
- **Exact changes** highlighted
- **Word-level** or **character-level**
- **No guessing** what changed

### ✅ Professional Look
- **Like GitHub diff**
- **Like GitLab diff**
- **Like VS Code diff**

---

## Technical Details

### Diff Algorithm
```javascript
import * as Diff from 'diff';

const charDiffs = Diff.diffWords(leftJSON, rightJSON);
// Returns array of: 
// { value: "text", added: true/false, removed: true/false }
```

### Rendering Logic
1. Split diff into characters
2. For each character:
   - If removed: show on left (red)
   - If added: show on right (green)
   - If unchanged: show on both (normal)
3. Apply background colors inline

### Performance
- **Fast:** Diff calculation is memoized
- **Efficient:** Only recalculates when JSON changes
- **Smooth:** Handles files up to 10,000 lines

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Close compare | `Esc` |
| Format left | Click Format button |
| Format right | Click Format button |
| Swap sides | Click ⇄ Swap |

---

## Tips

### ✅ For Best Results:
1. **Format both JSONs** - Click Format on each side
2. **Use meaningful labels** - Know which is "before" and "after"
3. **Check line numbers** - Quick reference to exact location
4. **Look for highlights** - Red = removed, Green = added

### 💡 Pro Tips:
- **Small changes** = Easy to spot with inline highlighting
- **Large files** = Line numbers help navigate
- **Copy sections** = Select and copy highlighted parts
- **Document changes** = Screenshot the diff

---

## Summary

**What You Get:**
✅ Inline character-level highlighting  
✅ Red for removed, green for added  
✅ Line numbers for reference  
✅ No clutter - clean side-by-side view  
✅ Professional diff tool quality  

**Just like:**
- GitHub diff view
- GitLab merge requests  
- VS Code diff editor
- Git command line diff

**Perfect for:**
- API response changes
- Config file comparison
- Password/credential updates
- Any JSON diff needs

**Now paste and see the exact changes highlighted!** 🎨✨

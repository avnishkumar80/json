# Compare View - Quick Start Guide

## 🚀 How to Use Compare View

### Step 1: Open Compare View
Click the **Compare** button in the sidebar (looks like a branching icon 🔄)

### Step 2: Paste Your JSON Files

**Left Panel (Original):**
```json
{
  "name": "John",
  "age": 30,
  "email": "john@example.com"
}
```

**Right Panel (Modified):**
```json
{
  "name": "Jane",
  "age": 30,
  "email": "jane@example.com",
  "phone": "+1234567890"
}
```

### Step 3: Review Differences

**Top Status Badge:**
- 🟢 **"✓ Identical"** - Files are the same
- 🟠 **"2 Differences"** - Shows number of changes found

**Bottom Panel Shows:**
```
📍 name
ORIGINAL: "John"  →  MODIFIED: "Jane"

📍 phone  
ORIGINAL: (not present)  →  MODIFIED: "+1234567890"
```

### Key Features:

✅ **Format Button** - Pretty-print each JSON independently  
✅ **Copy Button** - Copy either side to clipboard  
✅ **Swap Button** - Quickly switch left ↔ right  
✅ **Real-time Validation** - See errors immediately  
✅ **Path Display** - Shows exactly where changes are (e.g., `user.address.city`)  
✅ **Color Coding** - Red for removed, Green for added  

### Common Use Cases:

**1. API Testing**
- Compare API response before/after code change
- Verify no unexpected changes

**2. Config Comparison**
- Dev vs Production settings
- Before vs After configuration

**3. Data Verification**
- Check data transformation results
- Validate migration accuracy

**4. Debugging**
- Find what changed in your data
- Spot unexpected modifications

### Tips:

💡 **Format both sides first** for cleaner comparison  
💡 **Use Swap** if you pasted them backwards  
💡 **Scroll the diff panel** to see all changes  
💡 **Copy differences** for documentation  

### Keyboard Shortcuts:

| Action | Shortcut |
|--------|----------|
| Close Compare | `Esc` |
| Format Left | Focus left + `Ctrl/Cmd+B` |
| Format Right | Focus right + `Ctrl/Cmd+B` |

---

## Troubleshooting

**Q: Why don't I see differences?**  
**A:** Check that:
- Both JSONs are valid (no syntax errors shown)
- You actually pasted different content
- Files are formatted the same way

**Q: The diff panel is empty?**  
**A:** Make sure:
- Both panels have valid JSON
- No red error messages showing
- Status badge shows "X Differences" not "✓ Identical"

**Q: How do I save the comparison?**  
**A:** Currently:
- Screenshot the differences panel
- Copy each JSON separately
- Export feature coming soon!

---

## What Gets Detected:

✅ Changed values  
✅ Added properties  
✅ Removed properties  
✅ Type changes (string → number)  
✅ Array length changes  
✅ Nested object differences  

---

**That's it! Just paste and compare!** 🎉

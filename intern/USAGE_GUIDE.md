# 📖 Interactive Mindmap UI - User Guide

## Welcome! 👋

This guide will help you master the Interactive Mindmap UI. Whether you're a beginner or power user, you'll find everything you need here.

---

## 🎯 Getting Started

### First Launch

1. **Open the application** in your browser
2. **Explore the interface**:
   - Main canvas in the center
   - Toolbar at the top
   - Side panel on the right (opens when node is selected)
   - Mini-map in bottom-left corner

3. **Try basic interactions**:
   - Click a node to select it
   - Scroll to zoom
   - Drag to pan

---

## 🖱️ Mouse Interactions

### Selecting Nodes

- **Single Click**: Select a node
  - Node gets blue border and glow
  - Connected edges animate
  - Details panel opens on right

- **Click Empty Space**: Deselect all nodes

### Expanding/Collapsing

- **Click Expand Button**: Arrow icon on nodes with children
- **Visual Feedback**: 
  - Expanded: Arrow points down
  - Collapsed: Arrow points right
- **Smooth Animation**: Children appear/disappear smoothly

### Editing Nodes

- **Click Edit Button**: Pencil icon on any node
- **Edit Dialog Opens**: Two tabs available
- **Save Changes**: Click "Save Changes" button

### Context Menu

- **Right-Click** any node
- **Menu Appears** with options:
  - Edit Node
  - Add Child
  - Add Sibling
  - Duplicate
  - Delete

---

## ⌨️ Keyboard Shortcuts

### Navigation

| Key | Action |
|-----|--------|
| `↑` `↓` `←` `→` | Navigate to adjacent nodes |
| `Enter` | Expand/Collapse selected node |
| `Escape` | Deselect node / Close dialogs |

### Editing

| Key | Action |
|-----|--------|
| `E` | Edit selected node |
| `N` | Add child to selected node |
| `Delete` / `Backspace` | Delete selected node |

### Actions

| Key | Action |
|-----|--------|
| `Ctrl+Z` / `Cmd+Z` | Undo last action |
| `Ctrl+Y` / `Cmd+Y` | Redo action |
| `Ctrl+S` / `Cmd+S` | Manual save |
| `?` | Show keyboard shortcuts help |

### Tips

- **Focus Required**: Some shortcuts only work when canvas is focused
- **No Input Fields**: Shortcuts disabled when typing in text fields
- **Help Dialog**: Press `?` anytime to see all shortcuts

---

## 🔍 Search Feature

### Using Search

1. **Click search bar** in top toolbar
2. **Type your query**:
   - Searches titles, summaries, descriptions
   - Case-insensitive
   - Real-time results

3. **View results**:
   - Dropdown shows matching nodes
   - Breadcrumb path for each result
   - Number of matches

4. **Navigate to result**:
   - Click any result
   - Auto-expands parent nodes
   - Auto-zooms to selected node
   - Opens details panel

### Search Tips

- **Partial matches**: "react" finds "React", "ReactJS", etc.
- **Multiple words**: Searches all fields
- **Clear search**: Click X icon or clear text

---

## 📝 Working with Nodes

### Adding Nodes

#### Method 1: Context Menu
1. Right-click a node
2. Choose "Add Child" or "Add Sibling"
3. New node appears with default name
4. Edit to customize

#### Method 2: Keyboard
1. Select a node
2. Press `N` to add child
3. Or use context menu for sibling

#### Method 3: Edit Dialog
- Not directly, but you can duplicate and edit

### Editing Nodes

1. **Select node** to edit
2. **Click edit button** or press `E`
3. **Edit Dialog Opens**:

   **Basic Tab:**
   - Title (required)
   - Summary (tooltip text)
   - Description (supports markdown)

   **Metadata Tab:**
   - Status dropdown
   - Tags (add/remove)
   - Custom fields (key-value pairs)

4. **Save Changes**

### Deleting Nodes

1. **Select node** to delete
2. **Right-click** → "Delete"
   - OR press `Delete` / `Backspace`
3. **Confirmation dialog** appears
4. **Confirm deletion**
   - Cannot delete root node
   - Children are also deleted

### Duplicating Nodes

1. **Right-click** node
2. **Choose "Duplicate"**
3. **New node created** with:
   - Same title + " (Copy)"
   - All children duplicated
   - Same metadata

---

## 🏷️ Metadata Management

### Status

Set node status to track progress:

- **Draft**: Work in progress
- **Completed**: Finished task
- **Important**: High priority
- **Archived**: Archived content

**How to set:**
1. Edit node → Metadata tab
2. Select from Status dropdown
3. Save changes

### Tags

Organize nodes with tags:

**Adding Tags:**
1. Edit node → Metadata tab
2. Type tag name in "Add tag" field
3. Press Enter or click "Add"
4. Tag appears as chip

**Removing Tags:**
- Click X on tag chip
- Or edit and remove

**Tag Tips:**
- Use consistent naming
- Keep tags short
- Use for categorization

### Custom Fields

Store additional data:

**Adding Fields:**
1. Edit node → Metadata tab
2. Click "Add Field"
3. Enter Key and Value
4. Value auto-detects type:
   - Numbers: `123` → number
   - Booleans: `true` / `false` → boolean
   - Text: Everything else → string

**Removing Fields:**
- Click delete icon on field

**Use Cases:**
- Priority levels
- Due dates
- Custom properties
- External IDs

---

## 🎨 Themes

### Switching Themes

1. **Click theme toggle** in toolbar (moon/sun icon)
2. **Theme switches** instantly
3. **Preference saved** to localStorage
4. **Persists** across sessions

### Light Mode

- Clean, bright interface
- Good for daytime use
- High contrast
- Professional appearance

### Dark Mode

- Easy on the eyes
- Good for low-light
- Modern aesthetic
- Reduced eye strain

---

## 💾 Saving & Exporting

### Autosave

- **Automatic**: Saves to localStorage every second after changes
- **No action needed**: Works in background
- **Indicator**: Save icon shows dot when unsaved changes

### Manual Save

- **Press `Ctrl+S`** / `Cmd+S`
- **Or click Save icon** in toolbar
- **Confirms save** with visual feedback

### Export JSON

1. **Click Download icon** in toolbar
2. **JSON file downloads** automatically
3. **Filename**: `mindmap-YYYY-MM-DD.json`
4. **Contains**: All nodes, metadata, structure

### Import JSON

1. **Replace** `src/data/mindmap.json`
2. **Restart** development server
3. **Or** use localStorage import (coming soon)

---

## 🔄 Undo & Redo

### Using Undo/Redo

- **Undo**: `Ctrl+Z` / `Cmd+Z` or click Undo button
- **Redo**: `Ctrl+Y` / `Cmd+Y` or click Redo button

### What's Tracked

- Node edits
- Node additions
- Node deletions
- Node moves (if implemented)

### History Limits

- **50 actions** stored
- **Older actions** automatically removed
- **Future cleared** when new action added

---

## 🗺️ Navigation Tips

### Using Mini-map

- **Bottom-left corner**
- **Shows overview** of entire mindmap
- **Click to jump** to area
- **Color-coded** by hierarchy level

### Breadcrumbs

- **In side panel** when node selected
- **Shows path** from root to current node
- **Click any breadcrumb** to navigate
- **Auto-expands** to show selected node

### Fit to View

- **Click floating button** (bottom-right)
- **Or use controls** in bottom-left
- **Centers and zooms** to show all nodes

---

## 🎯 Best Practices

### Organizing Your Mindmap

1. **Start with root** - Clear main topic
2. **Use hierarchy** - Logical parent-child relationships
3. **Keep balanced** - Don't make one branch too deep
4. **Use tags** - For cross-category organization
5. **Set status** - Track progress

### Naming Conventions

- **Clear titles** - Descriptive and concise
- **Consistent style** - Use same format
- **Avoid duplicates** - Unless intentional

### Performance Tips

- **Collapse unused branches** - Faster rendering
- **Use search** - Instead of scrolling
- **Export regularly** - Backup your work

---

## ❓ Troubleshooting

### Nodes Not Appearing

- **Check if parent is expanded**
- **Try fit to view**
- **Check console for errors**

### Search Not Working

- **Clear search and try again**
- **Check spelling**
- **Try partial words**

### Changes Not Saving

- **Check browser console**
- **Verify localStorage enabled**
- **Try manual save**

### Keyboard Shortcuts Not Working

- **Click on canvas** to focus
- **Close any open dialogs**
- **Check if input field is active**

---

## 🆘 Getting Help

### Keyboard Shortcuts Help

- **Press `?`** anytime
- **Shows all shortcuts**
- **Organized by category**

### Context Menu

- **Right-click** for quick actions
- **Most common tasks** available
- **No need to remember shortcuts**

---

## 🎓 Advanced Tips

### Power User Workflow

1. **Use keyboard navigation** - Faster than mouse
2. **Search frequently** - Find nodes quickly
3. **Use tags** - Organize by multiple categories
4. **Set status** - Track progress visually
5. **Export regularly** - Backup important work

### Keyboard-Only Workflow

- `Arrow Keys` - Navigate
- `Enter` - Expand/Collapse
- `E` - Edit
- `N` - Add child
- `Delete` - Delete
- `Ctrl+Z` - Undo mistakes

### Efficient Editing

- **Edit multiple nodes** in sequence
- **Use duplicate** for similar nodes
- **Bulk edit** by selecting parent and editing children

---

**Happy Mindmapping! 🎉**


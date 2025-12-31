# 🔄 Complete CRUD Operations Guide

This document provides a comprehensive guide to all Create, Read, Update, and Delete operations for nodes and sub-nodes in the Interactive Mindmap UI.

---

## 📋 Table of Contents

1. [CREATE Operations](#create-operations)
2. [READ Operations](#read-operations)
3. [UPDATE Operations](#update-operations)
4. [DELETE Operations](#delete-operations)
5. [Bulk Operations](#bulk-operations)
6. [Best Practices](#best-practices)

---

## ➕ CREATE Operations

### Adding Child Nodes

**Method 1: Visual Button (Recommended for Non-Technical Users)**
```
1. Click node to select it
2. Green + button appears
3. Click green + button
4. New child node created
```

**Method 2: Context Menu**
```
1. Right-click node
2. Select "Add Child"
3. New child node created
```

**Method 3: Keyboard Shortcut**
```
1. Select node
2. Press 'N' key
3. New child node created
```

**Method 4: Toolbar Button**
```
1. Click + button in toolbar
2. Adds child to root node
```

### Adding Sibling Nodes

**Method 1: Context Menu**
```
1. Right-click node
2. Select "Add Sibling"
3. New sibling node created
```

**Method 2: Programmatic**
- Use `handleAddSibling(nodeId)` function
- Finds parent automatically
- Inserts after current node

### Adding Root-Level Nodes

```
1. Click + button in toolbar
2. New node added to root level
```

### Node Creation Details

**Default Properties:**
- Title: "New Child Node" or "New Sibling Node"
- Summary: Empty
- Description: Empty
- Children: None
- Metadata: None

**Auto-Actions:**
- Parent automatically expanded
- New node automatically selected
- View auto-zooms to new node
- Added to history for undo

---

## 👁️ READ Operations

### Viewing Node Information

**Basic View:**
- Click node → Details in side panel
- Hover node → Tooltip with summary
- Selected node → Blue border, animated edges

**Detailed View:**
- Side panel shows:
  - Full title
  - Summary
  - Description
  - Breadcrumb path
  - Tags
  - Status
  - Custom fields
  - Children list

### Navigating the Mindmap

**Expand/Collapse:**
- Click arrow button on node
- Or press Enter when selected
- Shows/hides children

**Search:**
- Type in search bar
- Results show with breadcrumbs
- Click to navigate

**Breadcrumbs:**
- In side panel when node selected
- Click any breadcrumb to navigate
- Shows full hierarchy path

### Reading Node Hierarchy

**Visual Indicators:**
- Color coding by level
- Indentation in breadcrumbs
- Connected lines show relationships

**Tree Structure:**
- Root at top/left
- Children branch out
- Siblings at same level

---

## ✏️ UPDATE Operations

### Quick Title Edit

**Method: Double-Click**
```
1. Double-click node title
2. Title becomes editable
3. Type new title
4. Press Enter to save
5. Or Escape to cancel
```

**Features:**
- Inline editing
- No dialog needed
- Instant feedback
- Tracked in history

### Full Node Edit

**Method 1: Edit Button**
```
1. Click edit button (pencil icon)
2. Edit dialog opens
3. Make changes
4. Click "Save Changes"
```

**Method 2: Context Menu**
```
1. Right-click node
2. Select "Edit Node"
3. Edit dialog opens
```

**Method 3: Keyboard**
```
1. Select node
2. Press 'E' key
3. Edit dialog opens
```

### Editing Fields

**Basic Tab:**
- Title (required)
- Summary (tooltip text)
- Description (supports markdown)

**Metadata Tab:**
- Status dropdown
- Tags (add/remove)
- Custom fields (key-value pairs)

### Updating Sub-Nodes

**Individual Update:**
- Edit each node separately
- Changes are independent

**Bulk Update:**
- Currently manual (edit each)
- Future: Select multiple nodes

### Update Tracking

**History:**
- All updates tracked
- Can undo/redo
- Shows old vs new values

**Auto-Save:**
- Changes saved automatically
- Debounced (1 second delay)
- Manual save also available

---

## 🗑️ DELETE Operations

### Deleting Single Node

**Method 1: Visual Button**
```
1. Select node
2. Click red trash button
3. Confirm deletion
4. Node deleted
```

**Method 2: Context Menu**
```
1. Right-click node
2. Select "Delete"
3. Confirm deletion
4. Node deleted
```

**Method 3: Keyboard**
```
1. Select node
2. Press Delete or Backspace
3. Confirm deletion
4. Node deleted
```

### Deleting with Children

**Behavior:**
- Deleting a node deletes ALL children
- Cascading deletion
- Cannot be undone (except via Undo)

**Warning:**
- Confirmation dialog appears
- Shows node title
- Warns about children deletion

### Deleting Restrictions

**Cannot Delete:**
- Root node (protected)
- Confirmation required for all deletions

### Delete Confirmation

**Dialog Shows:**
- Node title
- Warning message
- Cancel button
- Delete button (red)

**Safety:**
- Always requires confirmation
- Clear warning
- Can cancel at any time

---

## 🔄 Bulk Operations

### Selecting Multiple Nodes

**Current:**
- One node at a time
- Future: Multi-select with Ctrl/Shift

### Duplicating Nodes

**Method:**
```
1. Right-click node
2. Select "Duplicate"
3. Node copied with all children
4. Title gets " (Copy)" suffix
```

**Features:**
- Recursive duplication
- All children copied
- Metadata preserved
- New IDs generated

---

## 📊 Operation Examples

### Example 1: Create a Project Plan

```
1. CREATE root: "Project Plan"
2. CREATE child: "Phase 1"
   - CREATE child: "Research"
   - CREATE child: "Design"
3. CREATE sibling: "Phase 2"
   - CREATE child: "Development"
   - CREATE child: "Testing"
4. UPDATE: Add tags to phases
5. READ: Expand/collapse to view
```

### Example 2: Reorganize Structure

```
1. READ: View current structure
2. CREATE: Add new parent node
3. UPDATE: Edit node titles
4. DELETE: Remove outdated nodes
5. READ: Verify new structure
```

### Example 3: Update Project Status

```
1. READ: Select project node
2. UPDATE: Change status to "Completed"
3. UPDATE: Add "done" tag
4. UPDATE: Add completion date in custom field
5. READ: View updated information
```

---

## ✅ Best Practices

### CREATE Best Practices

1. **Plan Structure First**
   - Think about hierarchy before creating
   - Start with main categories
   - Add details later

2. **Use Meaningful Titles**
   - Clear, descriptive names
   - Avoid generic "New Node"
   - Update immediately after creation

3. **Organize with Tags**
   - Add tags as you create
   - Use consistent naming
   - Helps with search later

### READ Best Practices

1. **Use Search for Large Mindmaps**
   - Faster than scrolling
   - Finds by content
   - Auto-navigates

2. **Collapse Unused Branches**
   - Keeps view clean
   - Focuses attention
   - Better performance

3. **Use Breadcrumbs**
   - Always know location
   - Quick navigation
   - Understand hierarchy

### UPDATE Best Practices

1. **Use Inline Editing for Quick Changes**
   - Double-click title
   - Fast and easy
   - No dialog needed

2. **Use Full Edit for Details**
   - Add descriptions
   - Set metadata
   - Organize with tags

3. **Keep Descriptions Updated**
   - Helps understanding
   - Useful for search
   - Better documentation

### DELETE Best Practices

1. **Verify Before Deleting**
   - Check for children
   - Confirm it's correct node
   - Use Undo if mistake

2. **Delete from Bottom Up**
   - Delete children first
   - Then delete parent
   - Safer approach

3. **Use Undo Liberally**
   - Mistakes happen
   - Undo is your friend
   - Experiment freely

---

## 🔍 Operation Details

### CREATE - Technical Details

**Function**: `handleAddChild(parentId)`
- Generates unique ID
- Creates node object
- Adds to parent's children array
- Updates tree structure
- Tracks in history
- Auto-expands parent
- Auto-selects new node

**Function**: `handleAddSibling(nodeId)`
- Finds parent node
- Gets sibling index
- Inserts after current node
- Maintains order
- Same tracking as child

### READ - Technical Details

**Function**: `findNodeById(nodes, id)`
- Recursive search
- Returns node or null
- Searches entire tree

**Function**: `getPathToNode(root, targetId)`
- Returns array of IDs
- Path from root to target
- Used for breadcrumbs

### UPDATE - Technical Details

**Function**: `handleTitleUpdate(nodeId, newTitle)`
- Validates title (not empty)
- Updates node object
- Tracks in history
- Updates tree structure

**Function**: `updateNodeInTree(nodes, nodeId, updates)`
- Recursive tree update
- Preserves structure
- Returns updated tree

### DELETE - Technical Details

**Function**: `handleDeleteNode(nodeId)`
- Validates (not root)
- Shows confirmation
- Finds parent
- Removes from tree
- Cascades to children
- Tracks in history

**Function**: `removeNodeFromTree(nodes, nodeId)`
- Recursive removal
- Filters out target
- Removes from all levels
- Preserves other nodes

---

## 🎯 Quick Reference

### CREATE
- **Visual**: Click green + button
- **Menu**: Right-click → Add Child/Sibling
- **Keyboard**: Press 'N' for child
- **Toolbar**: + button for root child

### READ
- **Select**: Click node
- **Expand**: Click arrow or Enter
- **Search**: Type in search bar
- **Navigate**: Click breadcrumbs

### UPDATE
- **Title**: Double-click title
- **Full**: Click edit button or 'E'
- **Save**: Enter or Save button
- **Cancel**: Escape or Cancel

### DELETE
- **Visual**: Click red trash button
- **Menu**: Right-click → Delete
- **Keyboard**: Delete/Backspace
- **Confirm**: Always required

---

## 🚨 Error Handling

### CREATE Errors
- **No parent found**: Node not created, error logged
- **Invalid ID**: Auto-generates new ID
- **Duplicate ID**: Very rare, auto-handled

### READ Errors
- **Node not found**: Returns null, handled gracefully
- **Invalid path**: Shows error, allows retry

### UPDATE Errors
- **Empty title**: Validation prevents save
- **Invalid data**: Form validation
- **Node not found**: Error message shown

### DELETE Errors
- **Root node**: Prevents deletion, shows message
- **Node not found**: Handled gracefully
- **Confirmation cancelled**: No action taken

---

## 📈 Performance Considerations

### CREATE Performance
- **Fast**: O(1) for single node
- **Scalable**: Works with 1000+ nodes
- **Optimized**: Minimal re-renders

### READ Performance
- **Search**: O(n) but optimized
- **Navigation**: Instant
- **Rendering**: Only visible nodes

### UPDATE Performance
- **Title**: Instant (inline)
- **Full edit**: Dialog opens quickly
- **Save**: Fast tree update

### DELETE Performance
- **Single node**: Fast
- **With children**: Recursive but optimized
- **Large trees**: May take moment

---

## ✅ Testing Checklist

### CREATE
- [ ] Add child via button
- [ ] Add child via menu
- [ ] Add sibling
- [ ] Add to root
- [ ] Auto-expand works
- [ ] Auto-select works

### READ
- [ ] Click to select
- [ ] Side panel opens
- [ ] Breadcrumbs work
- [ ] Search finds nodes
- [ ] Expand/collapse works

### UPDATE
- [ ] Double-click title edit
- [ ] Full edit dialog
- [ ] Save changes
- [ ] Cancel works
- [ ] Validation works

### DELETE
- [ ] Delete via button
- [ ] Delete via menu
- [ ] Confirmation appears
- [ ] Children deleted
- [ ] Undo works

---

**All CRUD operations are fully functional and user-friendly!** 🎉


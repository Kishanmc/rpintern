# 🗺️ Interactive Mindmap UI

A powerful, feature-rich mindmap application built with Next.js, Material UI, and React Flow. Create, edit, and visualize hierarchical data structures with an intuitive, modern interface.

![Mindmap UI](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Material UI](https://img.shields.io/badge/MUI-5-blue?style=for-the-badge&logo=mui)

## ✨ Features

### 🎯 Core Features
- **Fully JSON-driven** - No hardcoded nodes, completely data-driven
- **Recursive hierarchical structure** - Unlimited depth support
- **Automatic node & edge generation** - From JSON to visualization
- **Smart auto-layout** - Intelligent positioning algorithm
- **Expand/Collapse branches** - Lazy rendering for large trees
- **Node grouping & subtrees** - Organize complex information

### 🎨 Visual Design
- **Modern, clean UI** - Professional Material Design
- **Light/Dark mode** - Toggle between themes
- **Depth-based color coding** - Visual hierarchy
- **Smooth animations** - Hover, focus, and selection effects
- **Animated transitions** - Expand/collapse with style
- **Responsive layout** - Works on all screen sizes
- **Mini-map navigation** - Navigate large mindmaps easily
- **Background grid** - Snap-to-grid positioning

### 🧩 Node Interaction
- **Click to select** - Highlight nodes and connections
- **Hover tooltips** - Quick preview of node content
- **Double-click to edit** - Fast editing workflow
- **Context menu** - Right-click for quick actions
- **Keyboard navigation** - Arrow keys, shortcuts
- **Drag-and-drop** - Reposition nodes freely
- **Multi-node selection** - Select multiple nodes

### 📝 Node Management
- **Add child/sibling nodes** - Build your mindmap
- **Delete nodes** - With confirmation dialog
- **Edit metadata** - Title, description, tags, status
- **Rich metadata editor** - Tags, key-value pairs
- **Markdown support** - Format descriptions
- **Status indicators** - Draft, completed, important
- **Duplicate nodes** - Copy with children

### 🔍 Search & Navigation
- **Global search bar** - Find nodes instantly
- **Auto-zoom on results** - Navigate to matches
- **Breadcrumb navigation** - See hierarchy path
- **Jump to parent/root** - Quick navigation

### 🔄 State Management
- **Undo/Redo** - Full action history (Ctrl+Z, Ctrl+Y)
- **Autosave** - Automatic localStorage backup
- **Manual save** - Save indicator
- **Import/Export JSON** - Backup and restore
- **Version control** - Track changes

### ♿ Accessibility
- **Keyboard accessible** - Full keyboard support
- **ARIA compliant** - Screen reader friendly
- **High contrast mode** - Better visibility
- **Touch support** - Works on tablets

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0+ or **yarn** 1.22+
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mindmap-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start

# Or use the production build
npm run start
```

---

## 📖 Usage Guide

### Basic Navigation

#### Mouse Controls
- **Zoom**: Scroll mouse wheel or pinch on trackpad
- **Pan**: Click and drag on empty canvas area
- **Select Node**: Click on any node
- **Fit to View**: Click the floating action button (bottom-right)

#### Touch Controls (Tablets)
- **Zoom**: Pinch to zoom in/out
- **Pan**: Drag with one finger
- **Select**: Tap on node
- **Context Menu**: Long press on node

### Node Interactions

#### Selecting Nodes
1. **Click** any node to select it
2. Selected node shows blue border and glow effect
3. Connected edges animate and highlight
4. Node details appear in right-side panel

#### Expanding/Collapsing
1. Click the **expand/collapse button** (arrow icon) on nodes with children
2. Or press **Enter** when node is selected
3. Children appear with smooth animation
4. Collapsed nodes show expand icon

#### Editing Nodes
1. Click the **edit button** (pencil icon) on any node
2. Or press **E** when node is selected
3. Edit dialog opens with two tabs:
   - **Basic**: Title, summary, description
   - **Metadata**: Status, tags, custom fields
4. Click **Save Changes** to apply

### Context Menu (Right-Click)

Right-click any node to access:
- **Edit Node** - Open edit dialog
- **Add Child** - Create new child node
- **Add Sibling** - Create sibling node
- **Duplicate** - Copy node with children
- **Delete** - Remove node (with confirmation)

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Arrow Keys` | Navigate between nodes |
| `Enter` | Expand/Collapse selected node |
| `E` | Edit selected node |
| `N` | Add child to selected node |
| `Delete` / `Backspace` | Delete selected node |
| `Ctrl+Z` / `Cmd+Z` | Undo last action |
| `Ctrl+Y` / `Cmd+Y` | Redo action |
| `Ctrl+S` / `Cmd+S` | Manual save |
| `?` | Show keyboard shortcuts help |

### Search Functionality

1. **Type in search bar** (top toolbar)
2. **Real-time results** appear in dropdown
3. **Click result** to navigate to node
4. **Auto-expands** parent nodes to reveal match
5. **Auto-zooms** to selected node

### Theme Switching

- Click the **theme toggle** button (moon/sun icon) in toolbar
- Toggle between **Light** and **Dark** mode
- Preference saved to localStorage
- All components adapt automatically

### Export & Import

#### Export JSON
1. Click **Download** icon in toolbar
2. Mindmap exports as JSON file
3. File named with current date
4. Includes all nodes and metadata

#### Import JSON
1. Replace `src/data/mindmap.json` with your file
2. Restart development server
3. Or use localStorage import (coming soon)

### Working with Metadata

#### Adding Tags
1. Select a node and click **Edit**
2. Go to **Metadata** tab
3. Type tag name and press **Enter** or click **Add**
4. Tags appear as chips
5. Click **X** on tag to remove

#### Setting Status
1. Edit node → **Metadata** tab
2. Select status from dropdown:
   - **Draft** - Work in progress
   - **Completed** - Finished
   - **Important** - High priority
   - **Archived** - Archived

#### Custom Fields
1. Edit node → **Metadata** tab
2. Click **Add Field**
3. Enter **Key** and **Value**
4. Values auto-detect type (string, number, boolean)
5. Remove fields with delete icon

---

## 🎨 Customization

### Modifying Node Colors

Edit `src/components/MindmapNode.tsx`:

```typescript
const getNodeColor = () => {
  const colors = [
    '#e3f2fd', // level 0 - blue
    '#f3e5f5', // level 1 - purple
    '#e8f5e8', // level 2 - green
    // Add more colors...
  ];
  return colors[data.level % colors.length] || '#f5f5f5';
};
```

### Changing Theme Colors

Edit `src/lib/theme.tsx`:

```typescript
palette: {
  mode,
  primary: {
    main: mode === 'dark' ? '#90caf9' : '#1976d2',
  },
  // Customize other colors...
}
```

### Adjusting Grid Size

Edit `src/components/MindmapApp.tsx`:

```typescript
snapGrid={[20, 20]} // Change to [10, 10] for smaller grid
```

---

## 📁 Project Structure

```
mindmap-ui/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with theme provider
│   │   ├── page.tsx            # Main page
│   │   └── globals.css         # Global styles & animations
│   ├── components/
│   │   ├── MindmapApp.tsx      # Main application component
│   │   ├── MindmapNode.tsx     # Individual node component
│   │   ├── NodeDetailsPanel.tsx # Side panel for details
│   │   ├── EditNodeDialog.tsx   # Edit dialog with metadata
│   │   └── ContextMenu.tsx     # Right-click context menu
│   ├── data/
│   │   └── mindmap.json        # Mindmap data structure
│   ├── lib/
│   │   ├── mindmapUtils.ts     # Data transformation utilities
│   │   ├── theme.tsx            # Theme provider & customization
│   │   ├── history.ts           # Undo/redo history manager
│   │   ├── storage.ts           # LocalStorage utilities
│   │   └── keyboardNavigation.ts # Keyboard nav utilities
│   └── types/
│       └── mindmap.ts           # TypeScript type definitions
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

---

## 🔧 Data Structure

### JSON Schema

```json
{
  "id": "unique-identifier",
  "title": "Node Title",
  "summary": "Brief summary for tooltips",
  "description": "Detailed description with markdown support",
  "metadata": {
    "status": "draft" | "completed" | "important" | "archived",
    "tags": ["tag1", "tag2"],
    "customFields": {
      "key": "value",
      "number": 123,
      "boolean": true
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "children": [
    {
      "id": "child-id",
      "title": "Child Node",
      // ... same structure
    }
  ]
}
```

### Example

```json
{
  "id": "root",
  "title": "My Project",
  "summary": "Main project node",
  "description": "This is the root of my mindmap",
  "metadata": {
    "status": "important",
    "tags": ["project", "main"]
  },
  "children": [
    {
      "id": "task1",
      "title": "Task 1",
      "summary": "First task",
      "description": "Details about task 1"
    }
  ]
}
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow prompts** to connect your repository

### Netlify

1. **Build command**: `npm run build`
2. **Publish directory**: `.next`
3. **Node version**: 18.x

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] All nodes render correctly
- [ ] Search finds nodes
- [ ] Keyboard navigation works
- [ ] Undo/redo functions properly
- [ ] Theme switching works
- [ ] Export/import JSON
- [ ] Context menu appears
- [ ] Metadata saves correctly
- [ ] Animations are smooth
- [ ] Responsive on mobile

---

## 📸 Screenshots & Demo

### Recommended Screenshots

1. **Main View** - Full mindmap with nodes expanded
2. **Dark Mode** - Same view in dark theme
3. **Node Selected** - Highlighted node with animated edges
4. **Edit Dialog** - Metadata tab showing tags and custom fields
5. **Context Menu** - Right-click menu visible
6. **Search Results** - Search dropdown with results
7. **Breadcrumbs** - Side panel showing breadcrumb navigation
8. **Mini-map** - Mini-map in action

### Demo Video Script

1. **Introduction (0:00-0:15)**
   - Show the application
   - Highlight main features

2. **Basic Navigation (0:15-0:45)**
   - Zoom and pan
   - Select nodes
   - Expand/collapse

3. **Editing (0:45-1:30)**
   - Edit a node
   - Add metadata
   - Show tags and custom fields

4. **Advanced Features (1:30-2:30)**
   - Search functionality
   - Context menu
   - Keyboard shortcuts
   - Undo/redo

5. **Theme & Export (2:30-3:00)**
   - Switch themes
   - Export JSON
   - Show localStorage autosave

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **React Flow** - Node visualization library
- **Material UI** - Component library
- **Next.js** - React framework
- **Open Source Community** - Inspiration and tools

---

**Built with ❤️ using Next.js, Material UI, and React Flow**

# SQL Schema Flow

A visual SQL schema designer built with React and React Flow. Design database tables, define columns with full type support, establish foreign key relationships, and generate SQL — all from an interactive drag-and-drop canvas.

## Features

- **Visual Table Designer** — Create and arrange tables on an infinite canvas with snap-to-grid support
- **Column Editor** — Add columns with data type, size, primary key, foreign key, nullable, unique, auto-increment, and default value options
- **Foreign Key Relationships** — Connect tables visually to define foreign key constraints; edges are drawn automatically
- **SQL Generation** — Generate `CREATE TABLE` statements with a single click, with syntax highlighting in a resizable bottom drawer
- **Project Management** — Save/load projects as JSON, rename your project inline, and download generated `.sql` files
- **Properties Panel** — Select any table or column to inspect and edit its properties in the right sidebar
- **Search & Navigate** — Filter tables in the left sidebar and click to pan/zoom to them on the canvas
- **Dark Mode** — Toggle between light and dark themes
- **Keyboard Shortcuts** — `⌘J` / `Ctrl+J` to toggle the SQL drawer

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — Dev server and bundler
- **React Flow (@xyflow/react)** — Node-based canvas
- **Zustand** — Lightweight state management
- **Tailwind CSS 4** — Utility-first styling
- **Radix UI** — Accessible select and slot primitives
- **Lucide React** — Icon library

## Getting Started

```bash
# Clone the repository
git clone https://github.com/prasadkarmalkar/sql-schema-flow.git
cd sql-schema-flow

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── App.tsx                # Main app with React Flow canvas
├── components/
│   ├── TopNavBar.tsx      # Project name, add table, generate SQL, save/load, theme toggle
│   ├── LeftSidebar.tsx    # Searchable table list with pan-to-table
│   ├── RightSidebar.tsx   # Properties panel for selected table/column
│   ├── TableNode.tsx      # Custom React Flow node for a database table
│   ├── BottomDrawer.tsx   # SQL output drawer with syntax highlighting
│   └── ui/                # Reusable UI primitives (Button, Input, Select)
├── data/
│   └── data.tsx           # SQL data type definitions
├── stores/
│   └── sql-tables.ts      # Zustand store for tables, edges, and app state
└── lib/
    └── utils.ts           # Utility helpers
```

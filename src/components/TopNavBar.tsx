import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { 
  Table2, 
  Download, 
  Moon, 
  Sun,
  Sparkles,
  GitBranch,
  Upload,
  Save
} from "lucide-react";
import { useSQLTables, type Column } from "../stores/sql-tables";
import { useState, useEffect, useRef } from "react";

const TopNavBar = () => {
  const { 
    projectName, 
    setProjectName, 
    isDark, 
    toggleTheme,
    addTable,
    nodes,
    edges,
    toggleSQLDrawer,
    setGeneratedSQL,
    loadProject
  } = useSQLTables();
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(projectName);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync tempName when projectName changes externally
  useEffect(() => {
    if (!isEditingName) setTempName(projectName);
  }, [projectName, isEditingName]);

  // Keyboard shortcut ⌘J / Ctrl+J to toggle SQL drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault();
        toggleSQLDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSQLDrawer]);

  const handleAddTable = () => {
    const newTable = {
      id: `table-${Date.now()}`,
      type: "tableNode",
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: {
        label: `Table${nodes.length + 1}`,
        columns: [
          {
            id: Date.now().toString(),
            name: 'id',
            dataType: 'INT',
            size: '',
            isPrimaryKey: true,
            isForeignKey: false,
            isNullable: false,
            isUnique: true,
            isAutoIncrement: true,
            defaultValue: '',
            description: 'Primary key'
          },
        ],
      },
    };
    addTable(newTable);
  };

  const handleNameEdit = () => {
    setIsEditingName(false);
    if (tempName.trim()) {
      setProjectName(tempName);
    } else {
      setTempName(projectName);
    }
  };

  const buildSQL = () => {
    // Topological sort to handle dependency chains
    const sortNodesByDependencies = () => {
      const nodeMap = new Map(nodes.map(n => [n.data.label, n]));
      const visited = new Set<string>();
      const sorted: typeof nodes = [];
      
      const visit = (tableName: string) => {
        if (visited.has(tableName)) return;
        visited.add(tableName);
        const node = nodeMap.get(tableName);
        if (!node) return;
        const columns = Array.isArray(node.data.columns) ? node.data.columns : [];
        columns.forEach((col: Column) => {
          if (col.isForeignKey && col.foreignKeyTable) {
            visit(col.foreignKeyTable);
          }
        });
        sorted.push(node);
      };
      
      nodes.forEach(node => visit(node.data.label));
      return sorted;
    };
    
    const sortedNodes = sortNodesByDependencies();
    let generatedQuery = "";

    sortedNodes.forEach((node) => {
      const tableName = node.data.label;
      const columns = Array.isArray(node.data.columns) ? node.data.columns : [];
      if (columns.length === 0 || !tableName) return;

      let createTableQuery = `CREATE TABLE \`${tableName}\` (\n`;
      const columnDefinitions: string[] = [];
      const primaryKeys: string[] = [];
      const foreignKeys: string[] = [];

      columns.forEach((col: Column) => {
        if (!col.name || !col.dataType) return;
        let columnDef = `  \`${col.name}\` ${col.dataType}`;
        if (col.size) columnDef += `(${col.size})`;
        if (!col.isNullable) columnDef += ' NOT NULL';
        if (col.isUnique && !col.isPrimaryKey) columnDef += ' UNIQUE';
        if (col.isAutoIncrement) columnDef += ' AUTO_INCREMENT';
        if (col.defaultValue) columnDef += ` DEFAULT ${col.defaultValue}`;
        columnDefinitions.push(columnDef);
        if (col.isPrimaryKey) primaryKeys.push(`\`${col.name}\``);
        if (col.isForeignKey && col.foreignKeyTable && col.foreignKeyColumn) {
          foreignKeys.push(
            `  FOREIGN KEY (\`${col.name}\`) REFERENCES \`${col.foreignKeyTable}\`(\`${col.foreignKeyColumn}\`)`
          );
        }
      });

      createTableQuery += columnDefinitions.join(',\n');
      if (primaryKeys.length > 0) {
        createTableQuery += `,\n  PRIMARY KEY (${primaryKeys.join(', ')})`;
      }
      if (foreignKeys.length > 0) {
        createTableQuery += ',\n' + foreignKeys.join(',\n');
      }
      createTableQuery += "\n);\n\n";
      generatedQuery += createTableQuery;
    });

    return generatedQuery;
  };

  const generateSQL = () => {
    const sql = buildSQL();
    setGeneratedSQL(sql);
    toggleSQLDrawer();
  };

  const handleExport = () => {
    const sql = buildSQL();
    setGeneratedSQL(sql);
    const blob = new Blob([sql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveProject = () => {
    const data = { nodes, edges, projectName };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoadProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.nodes && data.edges && data.projectName) {
          loadProject(data);
        } else {
          alert('Invalid project file.');
        }
      } catch {
        alert('Failed to parse project file.');
      }
    };
    reader.readAsText(file);
    // Reset input so the same file can be re-loaded
    e.target.value = '';
  };

  return (
    <div className="py-3 bg-neutral-900 border-b border-neutral-700 flex items-center justify-between px-4 shadow-md">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <GitBranch className="size-6 text-white" />
          <span className="text-app-title text-white">SQL Schema Flow</span>
        </div>
        
        {isEditingName ? (
          <Input
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleNameEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleNameEdit();
              if (e.key === 'Escape') {
                setTempName(projectName);
                setIsEditingName(false);
              }
            }}
            className="w-48 h-8 text-white"
            autoFocus
          />
        ) : (
          <button
            onClick={() => { setTempName(projectName); setIsEditingName(true); }}
            className="text-sm text-neutral-300 hover:text-white px-2 py-1 rounded hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Click to rename project"
          >
            {projectName}
          </button>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        <Button
          onClick={handleAddTable}
          size="default"
          variant="secondary"
          className="cursor-pointer"
        >
          <Table2 className="h-4 w-4" />
          Add Table
        </Button>
        
        <Button
          onClick={generateSQL}
          size="default"
          variant="default"
          className="cursor-pointer bg-green-500 hover:bg-green-600 text-white"
        >
          <Sparkles className="h-4 w-4" />
          Generate SQL
        </Button>
        
        <div className="w-px h-6 bg-neutral-700 mx-1" />

        <Button
          onClick={handleSaveProject}
          size="icon"
          variant="ghost"
          className="text-neutral-300 hover:text-white hover:bg-neutral-800"
          title="Save project as JSON"
        >
          <Save className="h-4 w-4" />
        </Button>

        <Button
          onClick={() => fileInputRef.current?.click()}
          size="icon"
          variant="ghost"
          className="text-neutral-300 hover:text-white hover:bg-neutral-800"
          title="Load project from JSON"
        >
          <Upload className="h-4 w-4" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleLoadProject}
        />
        
        <Button
          onClick={handleExport}
          size="icon"
          variant="ghost"
          className="text-neutral-300 hover:text-white hover:bg-neutral-800"
          title="Export SQL file"
        >
          <Download className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-neutral-700 mx-1" />
        
        <Button
          onClick={toggleTheme}
          size="icon"
          variant="ghost"
          className="text-neutral-300 hover:text-white hover:bg-neutral-800"
          title="Toggle theme"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default TopNavBar;

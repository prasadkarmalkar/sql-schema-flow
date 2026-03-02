import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { 
  Table2, 
  Download, 
  Moon, 
  Sun, 
  Sparkles,
  GitBranch
} from "lucide-react";
import { useSQLTables, type Column } from "../stores/sql-tables";
import { useState } from "react";

const TopNavBar = () => {
  const { 
    projectName, 
    setProjectName, 
    isDark, 
    toggleTheme,
    addTable,
    nodes,
    toggleSQLDrawer,
    setGeneratedSQL
  } = useSQLTables();
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(projectName);

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

  const generateSQL = () => {
    let generatedQuery = "";
    nodes.forEach((node) => {
      const tableName = node.data.label;
      const columns = Array.isArray(node.data.columns) ? node.data.columns : [];
      
      if (columns.length === 0 || !tableName) return;
      
      let createTableQuery = `CREATE TABLE ${tableName} (\n`;
      const columnDefinitions: string[] = [];
      const primaryKeys: string[] = [];
      
      columns.forEach((col: Column) => {
        if (!col.name || !col.dataType) return;
        
        let columnDef = `  ${col.name} ${col.dataType}`;
        
        if (col.size) {
          columnDef += `(${col.size})`;
        }
        
        if (!col.isNullable) {
          columnDef += ' NOT NULL';
        }
        
        if (col.isUnique && !col.isPrimaryKey) {
          columnDef += ' UNIQUE';
        }
        
        if (col.isAutoIncrement) {
          columnDef += ' AUTO_INCREMENT';
        }
        
        if (col.defaultValue) {
          columnDef += ` DEFAULT ${col.defaultValue}`;
        }
        
        columnDefinitions.push(columnDef);
        
        if (col.isPrimaryKey) {
          primaryKeys.push(col.name);
        }
      });
      
      createTableQuery += columnDefinitions.join(',\n');
      
      if (primaryKeys.length > 0) {
        createTableQuery += `,\n  PRIMARY KEY (${primaryKeys.join(', ')})`;
      }
      
      createTableQuery += "\n);\n\n";
      generatedQuery += createTableQuery;
    });
    
    setGeneratedSQL(generatedQuery);
    toggleSQLDrawer();
  };

  const handleExport = () => {
    generateSQL();
    // Create download link
    const blob = new Blob([useSQLTables.getState().generatedSQL], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-3 bg-neutral-900  border-b border-neutral-700 flex items-center justify-between px-4 shadow-md">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <GitBranch className="size-6 text-white" />
          <span className="text-app-title text-white dark:text-foreground">SQL Schema Flow</span>
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
            onClick={() => setIsEditingName(true)}
            className="text-sm text-neutral-300 dark:text-muted-foreground hover:text-white dark:hover:text-foreground px-2 py-1 rounded hover:bg-neutral-800 dark:hover:bg-muted transition-colors cursor-pointer"
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
          variant={'secondary'}
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
        
        <div className="w-px h-6 bg-neutral-700 dark:bg-border mx-1" />
        
        <Button
          onClick={handleExport}
          size="icon"
          variant="ghost"
          className="text-neutral-300 dark:text-muted-foreground hover:text-white dark:hover:text-foreground hover:bg-neutral-800 dark:hover:bg-muted"
          title="Export SQL"
        >
          <Download className="h-4 w-4" />
        </Button>
        
        
        <div className="w-px h-6 bg-neutral-700 dark:bg-border mx-1" />
        
        <Button
          onClick={toggleTheme}
          size="icon"
          variant="ghost"
          className="text-neutral-300 dark:text-muted-foreground hover:text-white dark:hover:text-foreground hover:bg-neutral-800 dark:hover:bg-muted"
          title="Toggle theme"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default TopNavBar;

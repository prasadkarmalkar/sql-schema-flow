import { useState } from "react";
import { Input } from "./ui/input";
import { Search, Table2, Layers } from "lucide-react";
import { useSQLTables } from "../stores/sql-tables";
import { useReactFlow } from "@xyflow/react";

const LeftSidebar = () => {
  const { nodes, setSelectedItem } = useSQLTables();
  const [searchQuery, setSearchQuery] = useState("");
  const reactFlow = useReactFlow();

  const filteredTables = nodes.filter((node) => {
    const label = node.data?.label as string || '';
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleTableClick = (tableId: string) => {
    setSelectedItem({ type: 'table', tableId });
    
    // Focus the table on canvas
    const node = nodes.find(n => n.id === tableId);
    if (node && reactFlow) {
      reactFlow.setCenter(node.position.x + 150, node.position.y + 100, {
        zoom: 1,
        duration: 400
      });
    }
  };

  const getColumnCount = (tableId: string) => {
    const node = nodes.find(n => n.id === tableId);
    const columns = node?.data?.columns as unknown[];
    return columns?.length || 0;
  };

  return (
    <div className="w-64 h-full bg-neutral-50 dark:bg-card border-r border-neutral-200 dark:border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 dark:border-border">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="h-5 w-5 text-primary" />
          <h2 className="text-table-title text-foreground">Tables</h2>
          <span className="ml-auto text-xs text-muted-foreground bg-neutral-200 dark:bg-muted px-2 py-0.5 rounded-full">
            {nodes.length}
          </span>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tables..."
            className="pl-9 h-9 bg-white dark:bg-background border-neutral-300 dark:border-border text-sm"
          />
        </div>
      </div>

      {/* Table List */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredTables.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground text-sm">
            <Table2 className="h-8 w-8 mb-2 opacity-50" />
            {searchQuery ? 'No tables found' : 'No tables yet'}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredTables.map((node) => (
              <button
                key={node.id}
                onClick={() => handleTableClick(node.id)}
                className="w-full text-left p-3 rounded-lg hover:bg-white dark:hover:bg-background border border-transparent hover:border-neutral-200 dark:hover:border-border transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Table2 className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">
                      {(node.data?.label as string) || 'Untitled'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getColumnCount(node.id)} columns
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="p-3 border-t border-neutral-200 dark:border-border bg-neutral-100 dark:bg-background">
        <p className="text-xs text-muted-foreground text-center">
          Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-card border border-neutral-300 dark:border-border rounded text-xs font-mono">A</kbd> to add table
        </p>
      </div>
    </div>
  );
};

export default LeftSidebar;

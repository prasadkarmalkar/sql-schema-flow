import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { SQLDataTypes } from "../data/data";
import { useSQLTables, type Column } from "../stores/sql-tables";
import { Settings, Key, Link, Database, Info } from "lucide-react";

const RightSidebar = () => {
  const { 
    selectedItem, 
    getSelectedTable, 
    getSelectedColumn,
    updateTableName,
    updateColumn,
    nodes
  } = useSQLTables();

  const selectedTable = getSelectedTable();
  const selectedColumn = getSelectedColumn();

  const handleColumnUpdate = (field: keyof Column, value: string | boolean) => {
    if (selectedItem.tableId && selectedItem.columnId) {
      updateColumn(selectedItem.tableId, selectedItem.columnId, field, value);
    }
  };

  const getDataTypeSupportsSize = (dataType: string): boolean => {
    const selectedType = SQLDataTypes.flatMap((group) => group.types).find(
      (type) => type.type === dataType
    );
    return selectedType?.size || false;
  };

  if (!selectedItem.type) {
    return (
      <div className="w-80 h-full bg-neutral-50 dark:bg-card border-l border-neutral-200 dark:border-border flex flex-col">
        <div className="flex-1 flex items-center justify-center text-center p-6">
          <div>
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <h3 className="text-sm font-medium text-foreground mb-1">No Selection</h3>
            <p className="text-xs text-muted-foreground">
              Select a table or column to view properties
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Table Properties View
  if (selectedItem.type === 'table' && selectedTable) {
    return (
      <div className="w-80 h-full bg-neutral-50 dark:bg-card border-l border-neutral-200 dark:border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-border">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <h2 className="text-table-title text-foreground">Table Properties</h2>
          </div>
        </div>

        {/* Properties */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Table Name
            </label>
            <Input
              value={(selectedTable.data?.label as string) || ''}
              onChange={(e) => updateTableName(selectedTable.id, e.target.value)}
              placeholder="Enter table name"
              className="bg-white dark:bg-background border-neutral-300 dark:border-border"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Columns
            </label>
            <div className="text-sm text-muted-foreground bg-neutral-100 dark:bg-background p-2 rounded border border-neutral-200 dark:border-border">
              {(selectedTable.data?.columns as Column[] || []).length} columns defined
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Description
            </label>
            <textarea
              placeholder="Add table description..."
              className="w-full min-h-20 px-3 py-2 text-sm bg-white dark:bg-background border border-neutral-300 dark:border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="pt-2 border-t border-neutral-200 dark:border-border">
            <h3 className="text-xs font-medium text-foreground mb-2">Statistics</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Total Columns:</span>
                <span className="font-medium">{(selectedTable.data?.columns as Column[] || []).length}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Primary Keys:</span>
                <span className="font-medium">
                  {(selectedTable.data?.columns as Column[] || []).filter((col: Column) => col.isPrimaryKey).length}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Foreign Keys:</span>
                <span className="font-medium">
                  {(selectedTable.data?.columns as Column[] || []).filter((col: Column) => col.isForeignKey).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Column Properties View
  if (selectedItem.type === 'column' && selectedColumn) {
    return (
      <div className="w-80 h-full bg-neutral-50 dark:bg-card border-l border-neutral-200 dark:border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-border">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <h2 className="text-table-title text-foreground">Column Properties</h2>
          </div>
        </div>

        {/* Properties */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Column Name
            </label>
            <Input
              value={selectedColumn.name}
              onChange={(e) => handleColumnUpdate('name', e.target.value)}
              placeholder="column_name"
              className="bg-white dark:bg-background border-neutral-300 dark:border-border font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Data Type
            </label>
            <Select
              value={selectedColumn.dataType}
              onValueChange={(value) => handleColumnUpdate('dataType', value)}
            >
              <SelectTrigger className="bg-white dark:bg-background border-neutral-300 dark:border-border">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {SQLDataTypes.map((group) => (
                  <SelectGroup key={group.groupName}>
                    <SelectLabel>{group.groupName}</SelectLabel>
                    {group.types.map((dataType) => (
                      <SelectItem key={dataType.type} value={dataType.type}>
                        {dataType.type}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>

          {getDataTypeSupportsSize(selectedColumn.dataType) && (
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Size / Length
              </label>
              <Input
                type="number"
                value={selectedColumn.size || ''}
                onChange={(e) => handleColumnUpdate('size', e.target.value)}
                placeholder="255"
                className="bg-white dark:bg-background border-neutral-300 dark:border-border"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Default Value
            </label>
            <Input
              value={selectedColumn.defaultValue || ''}
              onChange={(e) => handleColumnUpdate('defaultValue', e.target.value)}
              placeholder="NULL"
              className="bg-white dark:bg-background border-neutral-300 dark:border-border font-mono"
            />
          </div>

          <div className="pt-2 border-t border-neutral-200 dark:border-border">
            <h3 className="text-xs font-medium text-foreground mb-3 inline-flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5" />
              Constraints
            </h3>
            
            <div className="space-y-2.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedColumn.isPrimaryKey || false}
                  onChange={(e) => handleColumnUpdate('isPrimaryKey', e.target.checked)}
                  className="w-4 h-4 text-primary border-neutral-300 dark:border-border rounded focus:ring-primary"
                />
                <span className="text-sm text-foreground">Primary Key</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedColumn.isUnique || false}
                  onChange={(e) => handleColumnUpdate('isUnique', e.target.checked)}
                  className="w-4 h-4 text-primary border-neutral-300 dark:border-border rounded focus:ring-primary"
                />
                <span className="text-sm text-foreground">Unique</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedColumn.isNullable || false}
                  onChange={(e) => handleColumnUpdate('isNullable', e.target.checked)}
                  className="w-4 h-4 text-primary border-neutral-300 dark:border-border rounded focus:ring-primary"
                />
                <span className="text-sm text-foreground">Nullable</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedColumn.isAutoIncrement || false}
                  onChange={(e) => handleColumnUpdate('isAutoIncrement', e.target.checked)}
                  className="w-4 h-4 text-primary border-neutral-300 dark:border-border rounded focus:ring-primary"
                />
                <span className="text-sm text-foreground">Auto Increment</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedColumn.isForeignKey || false}
                  onChange={(e) => handleColumnUpdate('isForeignKey', e.target.checked)}
                  className="w-4 h-4 text-primary border-neutral-300 dark:border-border rounded focus:ring-primary"
                />
                <span className="text-sm text-foreground">Foreign Key</span>
              </label>
            </div>
          </div>

          {selectedColumn.isForeignKey && (
            <div className="pt-2 border-t border-neutral-200 dark:border-border">
              <h3 className="text-xs font-medium text-foreground mb-3 inline-flex items-center gap-1.5">
                <Link className="h-3.5 w-3.5" />
                Foreign Key Reference
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Reference Table
                  </label>
                  <Select
                    value={selectedColumn.foreignKeyTable || ''}
                    onValueChange={(value) => handleColumnUpdate('foreignKeyTable', value)}
                  >
                    <SelectTrigger className="bg-white dark:bg-background border-neutral-300 dark:border-border">
                      <SelectValue placeholder="Select table" />
                    </SelectTrigger>
                    <SelectContent>
                      {nodes.filter(n => n.id !== selectedItem.tableId).map((node) => (
                        <SelectItem key={node.id} value={node.id}>
                          {(node.data?.label as string) || 'Untitled'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Reference Column
                  </label>
                  <Input
                    value={selectedColumn.foreignKeyColumn || ''}
                    onChange={(e) => handleColumnUpdate('foreignKeyColumn', e.target.value)}
                    placeholder="id"
                    className="bg-white dark:bg-background border-neutral-300 dark:border-border font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-neutral-200 dark:border-border">
            <label className="block text-xs font-medium text-foreground mb-1.5">
              <span className="inline-flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" />
                Description
              </span>
            </label>
            <textarea
              value={selectedColumn.description || ''}
              onChange={(e) => handleColumnUpdate('description', e.target.value)}
              placeholder="Add column description..."
              className="w-full min-h-16 px-3 py-2 text-sm bg-white dark:bg-background border border-neutral-300 dark:border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default RightSidebar;

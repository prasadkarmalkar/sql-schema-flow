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
import { Button } from "./ui/button";
import { 
  PlusIcon, 
  Trash, 
  GripVertical,
  Key,
  Link2,
  Clock,
  Shield
} from "lucide-react";
import { useSQLTables, type Column } from "../stores/sql-tables";

const TableNode = (props: { data: { label: string }; id: string }) => {
  const {
    addColumn,
    removeColumn,
    updateColumn,
    getTableColumns,
    updateTableName,
    removeTable,
    setSelectedItem
  } = useSQLTables();
  const columns = getTableColumns(props.id);

  const handleAddColumn = () => {
    addColumn(props.id);
  };

  const handleRemoveColumn = (columnId: string) => {
    removeColumn(props.id, columnId);
  };

  const handleUpdateColumn = (
    columnId: string,
    field: keyof Column,
    value: string | boolean
  ) => {
    updateColumn(props.id, columnId, field, value);
  };

  const handleDataTypeChange = (columnId: string, value: string) => {
    handleUpdateColumn(columnId, "dataType", value);
  };

  const handleTableNameChange = (name: string) => {
    updateTableName(props.id, name);
  };

  const getDataTypeSupportsSize = (dataType: string): boolean => {
    const selectedType = SQLDataTypes.flatMap((group) => group.types).find(
      (type) => type.type === dataType
    );
    return selectedType?.size || false;
  };

  const handleRemoveTable = () => {
    removeTable(props.id);
  };

  const handleColumnClick = (columnId: string) => {
    setSelectedItem({ type: 'column', tableId: props.id, columnId });
  };

  const handleTableClick = () => {
    setSelectedItem({ type: 'table', tableId: props.id });
  };

  const getColumnIcon = (column: Column) => {
    if (column.isPrimaryKey) {
      return (
        <div title="Primary Key">
          <Key className="h-3.5 w-3.5 text-warning" />
        </div>
      );
    }
    if (column.isForeignKey) {
      return (
        <div title="Foreign Key">
          <Link2 className="h-3.5 w-3.5 text-info" />
        </div>
      );
    }
    if (column.isUnique) {
      return (
        <div title="Unique">
          <Shield className="h-3.5 w-3.5 text-success" />
        </div>
      );
    }
    if (column.dataType.includes('TIME') || column.dataType === 'DATE') {
      return (
        <div title="Date/Time">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-card rounded-xl border-2 border-neutral-200 dark:border-border shadow-lg hover:shadow-xl transition-shadow duration-200 min-w-80 max-w-96">
      {/* Header */}
      <div 
        className="bg-linear-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 px-4 py-3 rounded-t-xl border-b border-neutral-200 dark:border-border flex items-center justify-between cursor-pointer group"
        onClick={handleTableClick}
      >
        <div className="flex items-center gap-2 flex-1">
          <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
          <Input
            id='tableName'
            name='tableName'
            placeholder='Table Name'
            className='flex-1 text-table-title font-semibold bg-transparent border-none shadow-none px-1 h-8 focus-visible:ring-1 focus-visible:ring-primary'
            value={props.data.label}
            onChange={(e) => handleTableNameChange(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      {/* Columns */}
      <div className="p-3 space-y-1.5 max-h-96 overflow-y-auto">
        {columns.length === 0 ? (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No columns yet. Add one below.
          </div>
        ) : (
          columns.map((column) => (
            <div 
              key={column.id} 
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-background border border-transparent hover:border-neutral-200 dark:hover:border-border transition-all cursor-pointer"
              onClick={() => handleColumnClick(column.id)}
            >
              {/* Column Icon */}
              <div className="w-4 shrink-0">
                {getColumnIcon(column)}
              </div>

              {/* Column Name */}
              <Input
                id={`columnName-${column.id}`}
                name={`columnName-${column.id}`}
                placeholder='column_name'
                className='flex-1 text-column h-8 bg-transparent border-none shadow-none px-1 font-mono focus-visible:ring-1 focus-visible:ring-primary'
                value={column.name}
                onChange={(e) => {
                  e.stopPropagation();
                  handleUpdateColumn(column.id, "name", e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
              />

              {/* Data Type */}
              <Select
                value={column.dataType}
                onValueChange={(value) => {
                  handleDataTypeChange(column.id, value);
                }}
              >
                <SelectTrigger 
                  className='w-28 h-8 text-xs bg-transparent border-none shadow-none focus:ring-1 focus:ring-primary'
                  onClick={(e) => e.stopPropagation()}
                >
                  <SelectValue placeholder='Type' />
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

              {/* Size (if applicable) */}
              {getDataTypeSupportsSize(column.dataType) && (
                <Input
                  id={`dataTypeSize-${column.id}`}
                  type='number'
                  name={`dataTypeSize-${column.id}`}
                  placeholder='Size'
                  className='w-14 h-8 text-xs text-center bg-transparent border-none shadow-none focus-visible:ring-1 focus-visible:ring-primary'
                  value={column.size}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleUpdateColumn(column.id, "size", e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              )}

              {/* Delete button */}
              <Button
                variant='ghost'
                size='icon'
                className='h-7 w-7 opacity-0 group-hover/row:opacity-100 transition-opacity'
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveColumn(column.id);
                }}
                aria-label='Remove column'
              >
                <Trash className='h-3.5 w-3.5 text-danger' />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className='flex items-center gap-2 p-3 pt-2 border-t border-neutral-200 dark:border-border bg-neutral-50 dark:bg-background rounded-b-xl'>
        <Button
          variant='outline'
          size='sm'
          onClick={handleAddColumn}
          aria-label='Add column'
          className='flex-1 h-8 text-xs gap-1.5 border-neutral-300 dark:border-border hover:bg-white dark:hover:bg-card hover:border-primary'
        >
          <PlusIcon className='h-3.5 w-3.5' />
          Add Column
        </Button>
        <Button
          variant='ghost'
          size='icon'
          onClick={handleRemoveTable}
          className='h-8 w-8 hover:bg-danger/10 hover:text-danger'
          title='Delete table'
        >
          <Trash className='h-3.5 w-3.5' />
        </Button>
      </div>
    </div>
  );
};

export default TableNode;


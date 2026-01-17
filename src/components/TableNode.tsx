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
import { PlusIcon, Trash } from "lucide-react";
import { useSQLTables, type Column } from "../stores/sql-tables";

const TableNode = (props: { data: { label: string }; id: string }) => {
  const {
    addColumn,
    removeColumn,
    updateColumn,
    getTableColumns,
    updateTableName,
    removeTable
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
    value: string
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
  }
  return (
    <div className='bg-white text-sm p-4 rounded-lg border border-gray-300 shadow-sm min-w-64'>
      <Input
        id='tableName'
        name='tableName'
        placeholder='Table Name'
        className='text-center mb-4'
        value={props.data.label}
        onChange={(e) => handleTableNameChange(e.target.value)}
      />
      <div className='space-y-2'>
        {columns.map((column) => (
          <div key={column.id} className='flex items-center gap-2'>
            <Input
              id={`columnName-${column.id}`}
              name={`columnName-${column.id}`}
              placeholder='Column Name'
              className='flex-1'
              value={column.name}
              onChange={(e) =>
                handleUpdateColumn(column.id, "name", e.target.value)
              }
            />
            <Select
              value={column.dataType}
              onValueChange={(value) => handleDataTypeChange(column.id, value)}
            >
              <SelectTrigger className='w-32 text-xs'>
                <SelectValue placeholder='Data type' />
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
            {getDataTypeSupportsSize(column.dataType) && (
              <Input
                id={`dataTypeSize-${column.id}`}
                type='number'
                name={`dataTypeSize-${column.id}`}
                placeholder='Size'
                className='w-16'
                value={column.size}
                onChange={(e) =>
                  handleUpdateColumn(column.id, "size", e.target.value)
                }
              />
            )}
            <Button
              variant='outline'
              className='cursor-pointer'
              size='icon'
              onClick={() => handleRemoveColumn(column.id)}
              aria-label='Remove column'
            >
              <Trash className='h-4 w-4 text-red-500' />
            </Button>
          </div>
        ))}
      </div>
      <div className='flex justify-end mt-3 gap-2'>
        <Button
          variant='outline'
          size='default'
          onClick={handleAddColumn}
          aria-label='Add column'
          className='cursor-pointer'
        >
          <PlusIcon className='h-4 w-4' />
          Add Column
        </Button>
        <Button
          variant='destructive'
          size='default'
          onClick={handleRemoveTable}
          className='cursor-pointer ml-2'
        >
          <Trash className='h-4 w-4' />
          Delete Table
        </Button>
      </div>
    </div>
  );
};

export default TableNode;

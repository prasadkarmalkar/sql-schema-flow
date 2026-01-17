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
import { useState } from 'react';
import { Button } from './ui/button';
import { PlusIcon, Trash } from 'lucide-react';

type Column = {
  id: string;
  name: string;
  dataType: string;
  size?: string;
};

const TableNode = (props: { data: { label: string } }) => {
  const [columns, setColumns] = useState<Column[]>([
    { id: '1', name: '', dataType: '', size: '' }
  ]);

  const addColumn = () => {
    const newColumn: Column = {
      id: Date.now().toString(),
      name: '',
      dataType: '',
      size: ''
    };
    setColumns([...columns, newColumn]);
  };

  const removeColumn = (id: string) => {
    setColumns(columns.filter(column => column.id !== id));
  };

  const updateColumn = (id: string, field: keyof Column, value: string) => {
    setColumns(columns.map(column => 
      column.id === id ? { ...column, [field]: value } : column
    ));
  };

  const handleDataTypeChange = (id: string, value: string) => {
    updateColumn(id, 'dataType', value);
  };

  const getDataTypeSupportsSize = (dataType: string): boolean => {
    const selectedType = SQLDataTypes.flatMap(group => group.types).find(type => type.type === dataType);
    return selectedType?.size || false;
  };
  return (
    <div className='bg-white text-sm p-4 rounded-lg border border-gray-300 shadow-sm min-w-64'>
      <Input
        id='tableName'
        name='tableName'
        placeholder='Table Name'
        className='text-center mb-4'
        value={props.data.label}
      />
      <div className='space-y-2'>
        {columns.map((column, index) => (
          <div key={column.id} className='flex items-center gap-2'>
            <Input
              id={`columnName-${column.id}`}
              name={`columnName-${column.id}`}
              placeholder='Column Name'
              className='flex-1'
              value={column.name}
              onChange={(e) => updateColumn(column.id, 'name', e.target.value)}
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
                onChange={(e) => updateColumn(column.id, 'size', e.target.value)}
              />
            )}
            {index === columns.length - 1 ? (
              <Button variant="outline" size="icon" onClick={addColumn} aria-label="Add column" className='cursor-pointer'>
                <PlusIcon className='h-4 w-4' />
              </Button>
            ) : (
              <Button 
                variant="outline"
                className='cursor-pointer' 
                size="icon" 
                onClick={() => removeColumn(column.id)} 
                aria-label="Remove column"
              >
                <Trash className='h-4 w-4 text-red-500' />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableNode;

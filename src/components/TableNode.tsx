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
import { PlusIcon } from 'lucide-react';

const TableNode = (props) => {
  const [ isDataTypeSize, setIsDataTypeSize] = useState<boolean>();

  const handleDataTypeChange = (value: string) => {
    const selectedType = SQLDataTypes.flatMap(group => group.types).find(type => type.type === value);
    if (selectedType) {
      setIsDataTypeSize(selectedType.size);
    }
  }
  return (
    <div className='bg-white text-sm p-4 rounded-lg border border-gray-300 shadow-sm min-w-64'>
      <Input
        id='tableName'
        name='tableName'
        placeholder='Table Name'
        className='text-center mb-4'
      />
      <div className='space-y-3 flex items-center gap-2'>
        <Input
          id='columnName'
          name='columnName'
          placeholder='Column Name'
          className='w-full mb-0'
        />
        <Select onValueChange={handleDataTypeChange}>
          <SelectTrigger className='text-xs mb-0'>
            <SelectValue placeholder='Select data type' />
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
        {isDataTypeSize && (
          <Input
            id='dataTypeSize'
            type='number'
            name='dataTypeSize'
            placeholder='Size'
            className='w-24 mb-0'
          />
        )}
        <Button variant="outline" size="icon" aria-label="Submit">
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
};

export default TableNode;

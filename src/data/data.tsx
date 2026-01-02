export type SQLDataType = {
    type: string;
    size: boolean;
};
const NumericTypes: SQLDataType[] = [
    { type: 'INT', size: false },
    { type: 'INTEGER', size: false },
    { type: 'SMALLINT', size: false },
    { type: 'BIGINT', size: false },
    { type: 'DOUBLE', size: true },
]
const StringTypes: SQLDataType[] = [
    { type: 'CHAR', size: true },
    { type: 'VARCHAR', size: true },
    { type: 'TEXT', size: false },
    { type: 'BINARY', size: true },
    { type: 'BLOB', size: false },
]
const DateTypes: SQLDataType[] = [
    { type: 'DATE', size: false },
    { type: 'DATETIME', size: true },
    { type: 'TIMESTAMP', size: true },
]

export type SQLDataTypesGroup = {
    groupName: string;
    types: SQLDataType[];
}

export const SQLDataTypes: SQLDataTypesGroup[] = [
   {
       groupName: "Numeric",
       types: NumericTypes
   },
   {
       groupName: "String",
       types: StringTypes
   },
   {
       groupName: "Date",
       types: DateTypes
   }
];
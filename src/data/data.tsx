export type SQLDataType = {
    type: string;
    size: boolean;
};
const NumericTypes: SQLDataType[] = [
    { type: 'INT', size: false },
    { type: 'INTEGER', size: false },
    { type: 'SMALLINT', size: false },
    { type: 'BIGINT', size: false },
    { type: 'TINYINT', size: false },
    { type: 'FLOAT', size: true },
    { type: 'DOUBLE', size: true },
    { type: 'DECIMAL', size: true },
    { type: 'NUMERIC', size: true },
    { type: 'BOOLEAN', size: false },
]
const StringTypes: SQLDataType[] = [
    { type: 'CHAR', size: true },
    { type: 'VARCHAR', size: true },
    { type: 'TEXT', size: false },
    { type: 'TINYTEXT', size: false },
    { type: 'MEDIUMTEXT', size: false },
    { type: 'LONGTEXT', size: false },
    { type: 'BINARY', size: true },
    { type: 'VARBINARY', size: true },
    { type: 'BLOB', size: false },
    { type: 'ENUM', size: false },
    { type: 'JSON', size: false },
    { type: 'UUID', size: false },
]
const DateTypes: SQLDataType[] = [
    { type: 'DATE', size: false },
    { type: 'TIME', size: false },
    { type: 'DATETIME', size: true },
    { type: 'TIMESTAMP', size: true },
    { type: 'YEAR', size: false },
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
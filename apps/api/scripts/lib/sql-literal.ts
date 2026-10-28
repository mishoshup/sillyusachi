/**
Quotes a value as a SQLite string literal.
*/
export const sqlLiteral = (value: string): string => `'${value.replaceAll("'", "''")}'`;

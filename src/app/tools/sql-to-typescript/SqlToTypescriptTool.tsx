"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

// ── Types ──

type OutputFormat = "typescript" | "prisma" | "drizzle";
type SqlDialect = "postgresql" | "mysql" | "sqlite";

interface OutputTab {
  id: OutputFormat;
  label: string;
  ext: string;
}

const OUTPUT_TABS: OutputTab[] = [
  { id: "typescript", label: "TypeScript", ext: ".ts" },
  { id: "prisma", label: "Prisma", ext: ".prisma" },
  { id: "drizzle", label: "Drizzle ORM", ext: ".ts" },
];

const DIALECT_OPTIONS: { id: SqlDialect; label: string }[] = [
  { id: "postgresql", label: "PostgreSQL" },
  { id: "mysql", label: "MySQL" },
  { id: "sqlite", label: "SQLite" },
];

// ── SQL Parser types ──

interface ParsedColumn {
  name: string;
  rawType: string;
  typeArgs: string;
  nullable: boolean;
  primaryKey: boolean;
  unique: boolean;
  defaultValue: string | null;
  autoIncrement: boolean;
  references: { table: string; column: string } | null;
}

interface ParsedForeignKey {
  columns: string[];
  refTable: string;
  refColumns: string[];
}

interface ParsedIndex {
  name: string;
  columns: string[];
  unique: boolean;
}

interface ParsedTable {
  name: string;
  columns: ParsedColumn[];
  foreignKeys: ParsedForeignKey[];
  indexes: ParsedIndex[];
  primaryKeyColumns: string[];
}

// ── SQL Parser ──

function stripComments(sql: string): string {
  // Remove single-line comments
  let result = sql.replace(/--.*$/gm, "");
  // Remove multi-line comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, "");
  return result;
}

function unquoteName(name: string): string {
  const trimmed = name.trim();
  if (
    (trimmed.startsWith("`") && trimmed.endsWith("`")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function splitTopLevel(str: string, delimiter: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === "(" || ch === "[") {
      depth++;
      current += ch;
    } else if (ch === ")" || ch === "]") {
      depth--;
      current += ch;
    } else if (depth === 0 && str.substring(i, i + delimiter.length) === delimiter) {
      parts.push(current.trim());
      current = "";
      i += delimiter.length - 1;
    } else {
      current += ch;
    }
  }
  if (current.trim()) {
    parts.push(current.trim());
  }
  return parts;
}

function parseColumnDef(def: string): ParsedColumn | null {
  const trimmed = def.trim();
  if (!trimmed) return null;

  const upper = trimmed.toUpperCase();

  // Skip constraint-only lines
  if (
    upper.startsWith("PRIMARY KEY") ||
    upper.startsWith("FOREIGN KEY") ||
    upper.startsWith("UNIQUE") ||
    upper.startsWith("CHECK") ||
    upper.startsWith("CONSTRAINT") ||
    upper.startsWith("INDEX") ||
    upper.startsWith("KEY ")
  ) {
    return null;
  }

  // Extract column name — handle quoted names
  let name = "";
  let rest = "";
  if (trimmed.startsWith("`") || trimmed.startsWith('"')) {
    const quoteChar = trimmed[0];
    const endQuote = trimmed.indexOf(quoteChar, 1);
    if (endQuote === -1) return null;
    name = trimmed.substring(1, endQuote);
    rest = trimmed.substring(endQuote + 1).trim();
  } else {
    const spaceIdx = trimmed.search(/\s/);
    if (spaceIdx === -1) return null;
    name = trimmed.substring(0, spaceIdx);
    rest = trimmed.substring(spaceIdx + 1).trim();
  }

  // Extract type with optional args
  let rawType = "";
  let typeArgs = "";
  const typeMatch = rest.match(/^(\w+(?:\s+\w+)*?)(?:\(([^)]*)\))?\s*([\s\S]*)/i);
  if (typeMatch) {
    rawType = typeMatch[1].toUpperCase().trim();
    typeArgs = typeMatch[2] || "";
    rest = typeMatch[3] || "";
  } else {
    return null;
  }

  // Handle multi-word types: TIMESTAMP WITH TIME ZONE, etc.
  const multiWordTypes = [
    "DOUBLE PRECISION",
    "TIMESTAMP WITH TIME ZONE",
    "TIMESTAMP WITHOUT TIME ZONE",
    "TIME WITH TIME ZONE",
    "TIME WITHOUT TIME ZONE",
    "CHARACTER VARYING",
    "BIT VARYING",
    "LONG TEXT",
    "LONG BLOB",
    "MEDIUM TEXT",
    "MEDIUM BLOB",
    "MEDIUM INT",
    "TINY INT",
    "TINY TEXT",
    "TINY BLOB",
    "BIG INT",
    "SMALL INT",
    "GENERATED ALWAYS",
  ];

  for (const multiType of multiWordTypes) {
    const parts = multiType.split(" ");
    if (rawType === parts[0]) {
      const remainingUpper = rest.toUpperCase();
      const restParts = parts.slice(1).join(" ");
      if (remainingUpper.startsWith(restParts)) {
        rawType = multiType;
        rest = rest.substring(restParts.length).trim();
        break;
      }
    }
  }

  const restUpper = rest.toUpperCase();

  const nullable = !restUpper.includes("NOT NULL");
  const primaryKey =
    restUpper.includes("PRIMARY KEY") || restUpper.includes("PRIMARY");
  const unique = restUpper.includes("UNIQUE");
  const autoIncrement =
    restUpper.includes("AUTO_INCREMENT") ||
    restUpper.includes("AUTOINCREMENT") ||
    rawType === "SERIAL" ||
    rawType === "BIGSERIAL" ||
    rawType === "SMALLSERIAL" ||
    restUpper.includes("GENERATED ALWAYS AS IDENTITY") ||
    restUpper.includes("GENERATED BY DEFAULT AS IDENTITY");

  // Extract DEFAULT value
  let defaultValue: string | null = null;
  const defaultMatch = rest.match(/DEFAULT\s+('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|\S+)/i);
  if (defaultMatch) {
    defaultValue = defaultMatch[1];
  }

  // Extract inline REFERENCES
  let references: { table: string; column: string } | null = null;
  const refMatch = rest.match(
    /REFERENCES\s+[`"]?(\w+)[`"]?\s*\(\s*[`"]?(\w+)[`"]?\s*\)/i,
  );
  if (refMatch) {
    references = { table: refMatch[1], column: refMatch[2] };
  }

  return {
    name,
    rawType,
    typeArgs,
    nullable,
    primaryKey,
    unique,
    defaultValue,
    autoIncrement,
    references,
  };
}

function parseCreateTable(statement: string): ParsedTable | null {
  const cleaned = statement.trim().replace(/;\s*$/, "").trim();

  // Match CREATE TABLE [IF NOT EXISTS] <name> (<body>)
  const tableMatch = cleaned.match(
    /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?(\w+)[`"]?(?:\.[`"]?(\w+)[`"]?)?\s*\(([\s\S]*)\)$/i,
  );
  if (!tableMatch) return null;

  // If schema-qualified name, use the table name part
  const tableName = tableMatch[2] || tableMatch[1];
  const body = tableMatch[3];

  const definitions = splitTopLevel(body, ",");

  const columns: ParsedColumn[] = [];
  const foreignKeys: ParsedForeignKey[] = [];
  const primaryKeyColumns: string[] = [];

  for (const def of definitions) {
    const trimmed = def.trim();
    const upper = trimmed.toUpperCase();

    // Table-level PRIMARY KEY
    if (upper.startsWith("PRIMARY KEY") || (upper.startsWith("CONSTRAINT") && upper.includes("PRIMARY KEY"))) {
      const pkMatch = trimmed.match(/PRIMARY\s+KEY\s*\(([^)]+)\)/i);
      if (pkMatch) {
        const cols = pkMatch[1].split(",").map((c) => unquoteName(c.trim()));
        primaryKeyColumns.push(...cols);
      }
      continue;
    }

    // Table-level FOREIGN KEY
    if (upper.startsWith("FOREIGN KEY") || (upper.startsWith("CONSTRAINT") && upper.includes("FOREIGN KEY"))) {
      const fkMatch = trimmed.match(
        /FOREIGN\s+KEY\s*\(([^)]+)\)\s*REFERENCES\s+[`"]?(\w+)[`"]?\s*\(([^)]+)\)/i,
      );
      if (fkMatch) {
        foreignKeys.push({
          columns: fkMatch[1].split(",").map((c) => unquoteName(c.trim())),
          refTable: fkMatch[2],
          refColumns: fkMatch[3].split(",").map((c) => unquoteName(c.trim())),
        });
      }
      continue;
    }

    // Table-level UNIQUE constraint
    if (upper.startsWith("UNIQUE") || (upper.startsWith("CONSTRAINT") && upper.includes("UNIQUE"))) {
      continue;
    }

    // Table-level CHECK or INDEX
    if (upper.startsWith("CHECK") || upper.startsWith("INDEX") || upper.startsWith("KEY ")) {
      continue;
    }

    const col = parseColumnDef(trimmed);
    if (col) {
      columns.push(col);
    }
  }

  // Apply table-level primary key
  for (const pkCol of primaryKeyColumns) {
    const col = columns.find((c) => c.name.toLowerCase() === pkCol.toLowerCase());
    if (col) {
      col.primaryKey = true;
    }
  }

  // Apply table-level foreign keys
  for (const fk of foreignKeys) {
    for (let i = 0; i < fk.columns.length; i++) {
      const col = columns.find(
        (c) => c.name.toLowerCase() === fk.columns[i].toLowerCase(),
      );
      if (col && !col.references) {
        col.references = { table: fk.refTable, column: fk.refColumns[i] || fk.refColumns[0] };
      }
    }
  }

  return {
    name: tableName,
    columns,
    foreignKeys,
    indexes: [],
    primaryKeyColumns:
      primaryKeyColumns.length > 0
        ? primaryKeyColumns
        : columns.filter((c) => c.primaryKey).map((c) => c.name),
  };
}

function parseCreateIndex(statement: string): ParsedIndex | null {
  const match = statement.match(
    /CREATE\s+(UNIQUE\s+)?INDEX\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?(\w+)[`"]?\s+ON\s+[`"]?(\w+)[`"]?\s*\(([^)]+)\)/i,
  );
  if (!match) return null;
  return {
    name: match[2],
    columns: match[4].split(",").map((c) => unquoteName(c.trim().replace(/\s+(ASC|DESC)/i, ""))),
    unique: !!match[1],
  };
}

function parseSql(sql: string): { tables: ParsedTable[]; indexes: ParsedIndex[] } {
  const cleaned = stripComments(sql);
  const tables: ParsedTable[] = [];
  const indexes: ParsedIndex[] = [];

  // Split into statements
  const statements = cleaned
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const stmt of statements) {
    const upper = stmt.toUpperCase().trim();
    if (upper.startsWith("CREATE TABLE")) {
      const table = parseCreateTable(stmt);
      if (table) tables.push(table);
    } else if (upper.startsWith("CREATE UNIQUE INDEX") || upper.startsWith("CREATE INDEX")) {
      const idx = parseCreateIndex(stmt);
      if (idx) indexes.push(idx);
    }
  }

  // Attach indexes to tables
  for (const idx of indexes) {
    // Match by scanning the CREATE INDEX statement for the table name
    const idxStmt = statements.find(
      (s) =>
        s.toUpperCase().includes("CREATE") &&
        s.toUpperCase().includes("INDEX") &&
        s.includes(idx.name),
    );
    if (idxStmt) {
      const onMatch = idxStmt.match(/ON\s+[`"]?(\w+)[`"]?/i);
      if (onMatch) {
        const table = tables.find(
          (t) => t.name.toLowerCase() === onMatch[1].toLowerCase(),
        );
        if (table) {
          table.indexes.push(idx);
        }
      }
    }
  }

  return { tables, indexes };
}

// ── Name helpers ──

function toPascalCase(name: string): string {
  return name
    .split(/[-_\s]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");
}

function toCamelCase(name: string): string {
  const pascal = toPascalCase(name);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

// ── TypeScript Generator ──

function sqlTypeToTs(rawType: string): string {
  const t = rawType.toUpperCase().replace(/\s+/g, " ");

  // Numeric types
  if (
    t === "INT" || t === "INTEGER" || t === "SMALLINT" || t === "TINYINT" ||
    t === "MEDIUMINT" || t === "BIGINT" || t === "SERIAL" || t === "BIGSERIAL" ||
    t === "SMALLSERIAL" || t === "INT2" || t === "INT4" || t === "INT8" ||
    t === "SMALL INT" || t === "BIG INT" || t === "MEDIUM INT" || t === "TINY INT"
  )
    return "number";

  if (
    t === "FLOAT" || t === "DOUBLE" || t === "DOUBLE PRECISION" ||
    t === "REAL" || t === "NUMERIC" || t === "DECIMAL" || t === "MONEY"
  )
    return "number";

  // Boolean
  if (t === "BOOLEAN" || t === "BOOL") return "boolean";

  // Date/time
  if (
    t === "DATE" || t === "DATETIME" || t === "TIMESTAMP" ||
    t === "TIMESTAMP WITH TIME ZONE" || t === "TIMESTAMP WITHOUT TIME ZONE" ||
    t === "TIMESTAMPTZ" || t === "TIME" || t === "TIME WITH TIME ZONE" ||
    t === "TIME WITHOUT TIME ZONE" || t === "TIMETZ"
  )
    return "Date";

  // JSON
  if (t === "JSON" || t === "JSONB") return "Record<string, unknown>";

  // UUID
  if (t === "UUID") return "string";

  // Binary
  if (t === "BYTEA" || t === "BLOB" || t === "BINARY" || t === "VARBINARY" ||
    t === "LONG BLOB" || t === "MEDIUM BLOB" || t === "TINY BLOB")
    return "Buffer";

  // Text types — default
  return "string";
}

function generateTypescript(
  tables: ParsedTable[],
  useExport: boolean,
  useOptional: boolean,
): string {
  const lines: string[] = [];

  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    const name = toPascalCase(table.name);
    const prefix = useExport ? "export " : "";

    lines.push(`${prefix}interface ${name} {`);
    for (const col of table.columns) {
      const tsType = sqlTypeToTs(col.rawType);
      if (useOptional && col.nullable) {
        lines.push(`  ${toCamelCase(col.name)}?: ${tsType};`);
      } else if (col.nullable) {
        lines.push(`  ${toCamelCase(col.name)}: ${tsType} | null;`);
      } else {
        lines.push(`  ${toCamelCase(col.name)}: ${tsType};`);
      }
    }
    lines.push("}");

    if (i < tables.length - 1) lines.push("");
  }

  return lines.join("\n");
}

// ── Prisma Generator ──

function sqlTypeToPrisma(rawType: string, _typeArgs: string): string {
  const t = rawType.toUpperCase().replace(/\s+/g, " ");

  if (t === "SERIAL" || t === "SMALLSERIAL") return "Int";
  if (t === "BIGSERIAL") return "BigInt";
  if (
    t === "INT" || t === "INTEGER" || t === "SMALLINT" || t === "TINYINT" ||
    t === "MEDIUMINT" || t === "INT2" || t === "INT4" ||
    t === "SMALL INT" || t === "MEDIUM INT" || t === "TINY INT"
  )
    return "Int";
  if (t === "BIGINT" || t === "INT8" || t === "BIG INT") return "BigInt";

  if (t === "FLOAT" || t === "REAL") return "Float";
  if (t === "DOUBLE" || t === "DOUBLE PRECISION") return "Float";
  if (t === "NUMERIC" || t === "DECIMAL" || t === "MONEY") return "Decimal";

  if (t === "BOOLEAN" || t === "BOOL") return "Boolean";

  if (
    t === "TIMESTAMP" || t === "TIMESTAMP WITH TIME ZONE" ||
    t === "TIMESTAMP WITHOUT TIME ZONE" || t === "TIMESTAMPTZ" ||
    t === "DATETIME" || t === "DATE"
  )
    return "DateTime";
  if (t === "TIME" || t === "TIME WITH TIME ZONE" || t === "TIME WITHOUT TIME ZONE" || t === "TIMETZ")
    return "DateTime";

  if (t === "JSON" || t === "JSONB") return "Json";
  if (t === "UUID") return "String";
  if (t === "BYTEA" || t === "BLOB" || t === "BINARY" || t === "VARBINARY" ||
    t === "LONG BLOB" || t === "MEDIUM BLOB" || t === "TINY BLOB")
    return "Bytes";

  // Text types
  if (t === "TEXT" || t === "VARCHAR" || t === "CHAR" || t === "CHARACTER" ||
    t === "CHARACTER VARYING" || t === "LONG TEXT" || t === "MEDIUM TEXT" || t === "TINY TEXT")
    return "String";

  // ENUM treated as String
  if (t === "ENUM") return "String";

  return "String";
}

function prismaDbAnnotation(rawType: string, typeArgs: string): string {
  const t = rawType.toUpperCase().replace(/\s+/g, " ");

  if (t === "UUID") return "@db.Uuid";
  if (t === "JSONB") return "@db.JsonB";
  if (t === "TEXT") return "@db.Text";
  if ((t === "VARCHAR" || t === "CHARACTER VARYING") && typeArgs) return `@db.VarChar(${typeArgs})`;
  if (t === "CHAR" && typeArgs) return `@db.Char(${typeArgs})`;
  if (t === "DECIMAL" || t === "NUMERIC") {
    if (typeArgs) return `@db.Decimal(${typeArgs})`;
    return "@db.Decimal";
  }
  if (t === "TIMESTAMP WITH TIME ZONE" || t === "TIMESTAMPTZ") return "@db.Timestamptz";
  if (t === "TIMESTAMP" || t === "TIMESTAMP WITHOUT TIME ZONE") return "@db.Timestamp";
  if (t === "SMALLINT" || t === "INT2" || t === "SMALL INT") return "@db.SmallInt";
  if (t === "DOUBLE PRECISION") return "@db.DoublePrecision";
  if (t === "REAL") return "@db.Real";
  if (t === "BYTEA") return "@db.ByteA";
  if (t === "MONEY") return "@db.Money";

  return "";
}

function prismaDefaultValue(col: ParsedColumn): string {
  if (col.autoIncrement) return "@default(autoincrement())";

  if (col.defaultValue) {
    const dv = col.defaultValue;
    const dvUpper = dv.toUpperCase();

    if (dvUpper === "NOW()" || dvUpper === "CURRENT_TIMESTAMP" || dvUpper === "CURRENT_TIMESTAMP()") {
      return "@default(now())";
    }
    if (dvUpper === "GEN_RANDOM_UUID()" || dvUpper === "UUID_GENERATE_V4()" || dvUpper === "UUID()") {
      return "@default(uuid())";
    }
    if (dvUpper === "TRUE" || dvUpper === "FALSE") {
      return `@default(${dvUpper.toLowerCase()})`;
    }
    // Numeric default
    if (/^-?\d+(\.\d+)?$/.test(dv)) {
      return `@default(${dv})`;
    }
    // String default (strip quotes)
    if ((dv.startsWith("'") && dv.endsWith("'")) || (dv.startsWith('"') && dv.endsWith('"'))) {
      return `@default(${dv})`;
    }
  }

  return "";
}

function generatePrisma(tables: ParsedTable[]): string {
  const lines: string[] = [];

  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    const modelName = toPascalCase(table.name);

    lines.push(`model ${modelName} {`);

    for (const col of table.columns) {
      const prismaType = sqlTypeToPrisma(col.rawType, col.typeArgs);
      const nullable = col.nullable && !col.primaryKey ? "?" : "";
      const annotations: string[] = [];

      if (col.primaryKey) annotations.push("@id");
      if (col.unique) annotations.push("@unique");

      const defaultVal = prismaDefaultValue(col);
      if (defaultVal) annotations.push(defaultVal);

      const dbAnnotation = prismaDbAnnotation(col.rawType, col.typeArgs);
      if (dbAnnotation) annotations.push(dbAnnotation);

      // Map column name if different from camelCase
      const fieldName = toCamelCase(col.name);
      if (fieldName !== col.name) {
        annotations.push(`@map("${col.name}")`);
      }

      const annStr = annotations.length > 0 ? " " + annotations.join(" ") : "";
      lines.push(`  ${fieldName} ${prismaType}${nullable}${annStr}`);
    }

    // Table-level indexes
    if (table.indexes.length > 0) {
      lines.push("");
      for (const idx of table.indexes) {
        const cols = idx.columns.map((c) => toCamelCase(c)).join(", ");
        if (idx.unique) {
          lines.push(`  @@unique([${cols}])`);
        } else {
          lines.push(`  @@index([${cols}])`);
        }
      }
    }

    // Map table name
    lines.push(`  @@map("${table.name}")`);
    lines.push("}");

    if (i < tables.length - 1) lines.push("");
  }

  return lines.join("\n");
}

// ── Drizzle Generator ──

function drizzleColumnType(col: ParsedColumn, dialect: SqlDialect): string {
  const t = col.rawType.toUpperCase().replace(/\s+/g, " ");
  const args = col.typeArgs;

  if (dialect === "postgresql") {
    if (t === "SERIAL") return `serial('${col.name}')`;
    if (t === "BIGSERIAL") return `bigserial('${col.name}', { mode: 'number' })`;
    if (t === "SMALLSERIAL") return `smallserial('${col.name}')`;
    if (t === "INTEGER" || t === "INT" || t === "INT4") return `integer('${col.name}')`;
    if (t === "SMALLINT" || t === "INT2" || t === "SMALL INT") return `smallint('${col.name}')`;
    if (t === "BIGINT" || t === "INT8" || t === "BIG INT") return `bigint('${col.name}', { mode: 'number' })`;
    if (t === "BOOLEAN" || t === "BOOL") return `boolean('${col.name}')`;
    if (t === "TEXT" || t === "LONG TEXT" || t === "MEDIUM TEXT" || t === "TINY TEXT") return `text('${col.name}')`;
    if (t === "VARCHAR" || t === "CHARACTER VARYING") {
      return args ? `varchar('${col.name}', { length: ${args} })` : `varchar('${col.name}')`;
    }
    if (t === "CHAR" || t === "CHARACTER") {
      return args ? `char('${col.name}', { length: ${args} })` : `char('${col.name}')`;
    }
    if (t === "TIMESTAMP" || t === "TIMESTAMP WITHOUT TIME ZONE") return `timestamp('${col.name}')`;
    if (t === "TIMESTAMP WITH TIME ZONE" || t === "TIMESTAMPTZ") return `timestamp('${col.name}', { withTimezone: true })`;
    if (t === "DATE") return `date('${col.name}')`;
    if (t === "TIME" || t === "TIME WITHOUT TIME ZONE") return `time('${col.name}')`;
    if (t === "REAL" || t === "FLOAT") return `real('${col.name}')`;
    if (t === "DOUBLE PRECISION" || t === "DOUBLE") return `doublePrecision('${col.name}')`;
    if (t === "NUMERIC" || t === "DECIMAL") {
      if (args) {
        const [p, s] = args.split(",").map((x: string) => x.trim());
        return `numeric('${col.name}', { precision: ${p}, scale: ${s || 0} })`;
      }
      return `numeric('${col.name}')`;
    }
    if (t === "UUID") return `uuid('${col.name}')`;
    if (t === "JSON") return `json('${col.name}')`;
    if (t === "JSONB") return `jsonb('${col.name}')`;
    if (t === "BYTEA") return `text('${col.name}')`;
    return `text('${col.name}')`;
  }

  if (dialect === "mysql") {
    if (t === "INT" || t === "INTEGER") return `int('${col.name}')`;
    if (t === "TINYINT" || t === "TINY INT") return `tinyint('${col.name}')`;
    if (t === "SMALLINT" || t === "SMALL INT") return `smallint('${col.name}')`;
    if (t === "MEDIUMINT" || t === "MEDIUM INT") return `mediumint('${col.name}')`;
    if (t === "BIGINT" || t === "BIG INT") return `bigint('${col.name}', { mode: 'number' })`;
    if (t === "SERIAL") return `serial('${col.name}')`;
    if (t === "BOOLEAN" || t === "BOOL") return `boolean('${col.name}')`;
    if (t === "TEXT" || t === "LONG TEXT" || t === "MEDIUM TEXT" || t === "TINY TEXT") return `text('${col.name}')`;
    if (t === "VARCHAR" || t === "CHARACTER VARYING") {
      return args ? `varchar('${col.name}', { length: ${args} })` : `varchar('${col.name}', { length: 255 })`;
    }
    if (t === "CHAR" || t === "CHARACTER") {
      return args ? `char('${col.name}', { length: ${args} })` : `char('${col.name}', { length: 1 })`;
    }
    if (t === "TIMESTAMP") return `timestamp('${col.name}')`;
    if (t === "DATETIME") return `datetime('${col.name}')`;
    if (t === "DATE") return `date('${col.name}')`;
    if (t === "TIME") return `time('${col.name}')`;
    if (t === "FLOAT" || t === "REAL") return `float('${col.name}')`;
    if (t === "DOUBLE" || t === "DOUBLE PRECISION") return `double('${col.name}')`;
    if (t === "DECIMAL" || t === "NUMERIC") {
      if (args) {
        const [p, s] = args.split(",").map((x: string) => x.trim());
        return `decimal('${col.name}', { precision: ${p}, scale: ${s || 0} })`;
      }
      return `decimal('${col.name}')`;
    }
    if (t === "JSON") return `json('${col.name}')`;
    if (t === "BINARY" || t === "VARBINARY" || t === "BLOB") return `binary('${col.name}')`;
    if (t === "ENUM") return `text('${col.name}')`;
    return `text('${col.name}')`;
  }

  // SQLite
  if (
    t === "INT" || t === "INTEGER" || t === "TINYINT" || t === "SMALLINT" ||
    t === "MEDIUMINT" || t === "BIGINT" || t === "SERIAL" || t === "BIGSERIAL" ||
    t === "BOOLEAN" || t === "BOOL" || t === "SMALL INT" || t === "BIG INT" ||
    t === "TINY INT" || t === "MEDIUM INT"
  )
    return `integer('${col.name}')`;
  if (t === "REAL" || t === "FLOAT" || t === "DOUBLE" || t === "DOUBLE PRECISION" ||
    t === "NUMERIC" || t === "DECIMAL")
    return `real('${col.name}')`;
  if (t === "BLOB" || t === "BYTEA" || t === "BINARY" || t === "VARBINARY")
    return `blob('${col.name}')`;
  return `text('${col.name}')`;
}

function drizzleDefault(col: ParsedColumn, dialect: SqlDialect): string {
  if (!col.defaultValue) return "";
  const dv = col.defaultValue;
  const dvUpper = dv.toUpperCase();

  if (dvUpper === "NOW()" || dvUpper === "CURRENT_TIMESTAMP" || dvUpper === "CURRENT_TIMESTAMP()") {
    if (dialect === "sqlite") return ".default(sql`CURRENT_TIMESTAMP`)";
    return ".defaultNow()";
  }
  if (dvUpper === "GEN_RANDOM_UUID()" || dvUpper === "UUID_GENERATE_V4()" || dvUpper === "UUID()") {
    return ".default(sql`gen_random_uuid()`)";
  }
  if (dvUpper === "TRUE") return ".default(true)";
  if (dvUpper === "FALSE") return ".default(false)";
  if (/^-?\d+(\.\d+)?$/.test(dv)) return `.default(${dv})`;
  if ((dv.startsWith("'") && dv.endsWith("'")) || (dv.startsWith('"') && dv.endsWith('"'))) {
    return `.default(${dv})`;
  }
  return "";
}

function generateDrizzle(
  tables: ParsedTable[],
  dialect: SqlDialect,
): string {
  const lines: string[] = [];
  const tableFunc =
    dialect === "postgresql" ? "pgTable" : dialect === "mysql" ? "mysqlTable" : "sqliteTable";
  const importFrom =
    dialect === "postgresql"
      ? "drizzle-orm/pg-core"
      : dialect === "mysql"
        ? "drizzle-orm/mysql-core"
        : "drizzle-orm/sqlite-core";

  // Collect all needed column type functions
  const usedFunctions = new Set<string>();
  usedFunctions.add(tableFunc);
  let usesSql = false;

  // Pre-scan for sql usage
  for (const table of tables) {
    for (const col of table.columns) {
      if (col.defaultValue) {
        const dvUpper = col.defaultValue.toUpperCase();
        if (
          (dvUpper === "CURRENT_TIMESTAMP" || dvUpper === "NOW()" || dvUpper === "CURRENT_TIMESTAMP()") && dialect === "sqlite"
        ) {
          usesSql = true;
        }
        if (dvUpper === "GEN_RANDOM_UUID()" || dvUpper === "UUID_GENERATE_V4()" || dvUpper === "UUID()") {
          usesSql = true;
        }
      }
    }
  }

  lines.push(`import { ${tableFunc} } from '${importFrom}';`);
  if (usesSql) {
    lines.push(`import { sql } from 'drizzle-orm';`);
  }
  lines.push("");

  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    const varName = toCamelCase(table.name);

    lines.push(`export const ${varName} = ${tableFunc}('${table.name}', {`);

    for (const col of table.columns) {
      const fieldName = toCamelCase(col.name);
      let colDef = drizzleColumnType(col, dialect);

      if (col.primaryKey) colDef += ".primaryKey()";
      if (!col.nullable && !col.primaryKey && !col.autoIncrement) colDef += ".notNull()";
      if (col.unique) colDef += ".unique()";
      if (col.autoIncrement && dialect === "mysql" && col.rawType.toUpperCase() !== "SERIAL") {
        colDef += ".autoincrement()";
      }

      const defaultStr = drizzleDefault(col, dialect);
      if (defaultStr) colDef += defaultStr;

      if (col.references) {
        colDef += `.references(() => ${toCamelCase(col.references.table)}.${toCamelCase(col.references.column)})`;
      }

      lines.push(`  ${fieldName}: ${colDef},`);
    }

    lines.push("});");

    if (i < tables.length - 1) lines.push("");
  }

  return lines.join("\n");
}

// ── Stats ──

interface ConversionStats {
  tables: number;
  columns: number;
  foreignKeys: number;
  indexes: number;
}

function computeStats(tables: ParsedTable[], indexes: ParsedIndex[]): ConversionStats {
  let columns = 0;
  for (const t of tables) {
    columns += t.columns.length;
  }
  // Deduplicate foreign keys using a set
  const totalFk = new Set<string>();
  for (const t of tables) {
    for (const c of t.columns) {
      if (c.references) {
        totalFk.add(`${t.name}.${c.name}->${c.references.table}.${c.references.column}`);
      }
    }
  }
  return {
    tables: tables.length,
    columns,
    foreignKeys: totalFk.size,
    indexes: indexes.length + tables.reduce((sum, t) => sum + t.indexes.length, 0),
  };
}

// ── Samples ──

const SAMPLES: { label: string; sql: string }[] = [
  {
    label: "Users (basic)",
    sql: `CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);`,
  },
  {
    label: "E-commerce",
    sql: `CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  total DECIMAL(10,2) NOT NULL,
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);`,
  },
  {
    label: "Blog",
    sql: `CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  author_id INTEGER NOT NULL REFERENCES users(id),
  title VARCHAR(300) NOT NULL,
  slug VARCHAR(300) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE post_tags (
  post_id INTEGER NOT NULL REFERENCES posts(id),
  tag_id INTEGER NOT NULL REFERENCES tags(id),
  PRIMARY KEY (post_id, tag_id)
);

CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_comments_post ON comments(post_id);`,
  },
  {
    label: "PostgreSQL-specific",
    sql: `CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
  display_name VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,
  metadata JSONB DEFAULT '{}',
  settings JSONB,
  login_count INTEGER DEFAULT 0,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_metadata ON profiles USING gin(metadata);
CREATE UNIQUE INDEX idx_profiles_user ON profiles(user_id);`,
  },
];

// ── Component ──

export default function SqlToTypescriptTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [format, setFormat] = useState<OutputFormat>("typescript");
  const [dialect, setDialect] = useState<SqlDialect>("postgresql");
  const [useExport, setUseExport] = useState(true);
  const [useOptional, setUseOptional] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<ConversionStats | null>(null);

  const { trackAction } = useToolAnalytics("sql-to-typescript");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("sql-to-typescript");

  const handleConvert = useCallback(() => {
    setError("");
    setOutput("");
    setCopied(false);
    setStats(null);

    if (!input.trim()) {
      setError("Please enter SQL CREATE TABLE statements to convert.");
      return;
    }

    if (isLimited) return;
    recordUsage();
    trackAction("convert");

    try {
      const { tables, indexes } = parseSql(input);

      if (tables.length === 0) {
        setError(
          "No valid CREATE TABLE statements found. Check your SQL syntax.",
        );
        return;
      }

      let result = "";
      switch (format) {
        case "typescript":
          result = generateTypescript(tables, useExport, useOptional);
          break;
        case "prisma":
          result = generatePrisma(tables);
          break;
        case "drizzle":
          result = generateDrizzle(tables, dialect);
          break;
      }

      setOutput(result);
      setStats(computeStats(tables, indexes));
    } catch (err) {
      setError(
        `Error parsing SQL: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  }, [input, format, dialect, useExport, useOptional, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleConvert);

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDownload() {
    const tab = OUTPUT_TABS.find((t) => t.id === format)!;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `schema${tab.ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleLoadSample(idx: number) {
    setInput(SAMPLES[idx].sql);
    setOutput("");
    setError("");
    setStats(null);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        SQL to TypeScript / Prisma / Drizzle Converter
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Convert SQL CREATE TABLE statements into TypeScript interfaces, Prisma
        schema, or Drizzle ORM table definitions. Supports PostgreSQL, MySQL,
        and SQLite syntax.
      </p>

      <RateLimitBanner
        remaining={remaining}
        dailyLimit={dailyLimit}
        isLimited={isLimited}
      />

      {/* Output format tabs */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Output Format
        </label>
        <div className="flex flex-wrap gap-2">
          {OUTPUT_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setFormat(tab.id);
                setOutput("");
                setStats(null);
              }}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                format === tab.id
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-300"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Options row */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {/* SQL dialect selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            SQL Dialect:
          </label>
          <select
            value={dialect}
            onChange={(e) => {
              setDialect(e.target.value as SqlDialect);
              setOutput("");
              setStats(null);
            }}
            className="rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {DIALECT_OPTIONS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Export toggle — TypeScript only */}
        {format === "typescript" && (
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={useExport}
              onChange={(e) => setUseExport(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Export keyword
          </label>
        )}

        {/* Optional vs null — TypeScript only */}
        {format === "typescript" && (
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={useOptional}
              onChange={(e) => setUseOptional(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Optional (?) instead of | null
          </label>
        )}
      </div>

      {/* Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            SQL Input
          </label>
          <div className="flex gap-2">
            {SAMPLES.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleLoadSample(idx)}
                className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`CREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(100) NOT NULL,\n  email VARCHAR(255) UNIQUE,\n  created_at TIMESTAMP DEFAULT NOW()\n);`}
          rows={14}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
          spellCheck={false}
        />
      </div>

      {/* Convert button */}
      <button
        onClick={handleConvert}
        disabled={isLimited || !input.trim()}
        className="mb-6 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900"
      >
        Convert{" "}
        <kbd className="ml-1.5 hidden rounded bg-indigo-500 px-1.5 py-0.5 text-xs font-medium sm:inline-block">
          Ctrl+Enter
        </kbd>
      </button>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>
            <strong>{stats.tables}</strong> table{stats.tables !== 1 ? "s" : ""}
          </span>
          <span>
            <strong>{stats.columns}</strong> column
            {stats.columns !== 1 ? "s" : ""}
          </span>
          <span>
            <strong>{stats.foreignKeys}</strong> foreign key
            {stats.foreignKeys !== 1 ? "s" : ""}
          </span>
          {stats.indexes > 0 && (
            <span>
              <strong>{stats.indexes}</strong> index
              {stats.indexes !== 1 ? "es" : ""}
            </span>
          )}
        </div>
      )}

      {/* Output */}
      {output && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {OUTPUT_TABS.find((t) => t.id === format)!.label} Output
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handleDownload}
                className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              >
                Download
              </button>
            </div>
          </div>
          <pre className="max-h-[32rem] overflow-auto rounded-lg border border-gray-200 bg-white p-4 font-mono text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
            {output}
          </pre>
        </div>
      )}

      {/* Type mapping reference */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          SQL Type Mapping Reference
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="pb-2 text-left font-medium text-gray-600 dark:text-gray-400">
                  SQL Type
                </th>
                <th className="pb-2 text-left font-medium text-gray-600 dark:text-gray-400">
                  TypeScript
                </th>
                <th className="pb-2 text-left font-medium text-gray-600 dark:text-gray-400">
                  Prisma
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-1.5">INT / INTEGER / SERIAL</td>
                <td className="py-1.5"><code className="text-xs">number</code></td>
                <td className="py-1.5"><code className="text-xs">Int</code></td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-1.5">BIGINT / BIGSERIAL</td>
                <td className="py-1.5"><code className="text-xs">number</code></td>
                <td className="py-1.5"><code className="text-xs">BigInt</code></td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-1.5">VARCHAR / TEXT / CHAR</td>
                <td className="py-1.5"><code className="text-xs">string</code></td>
                <td className="py-1.5"><code className="text-xs">String</code></td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-1.5">BOOLEAN / BOOL</td>
                <td className="py-1.5"><code className="text-xs">boolean</code></td>
                <td className="py-1.5"><code className="text-xs">Boolean</code></td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-1.5">TIMESTAMP / DATETIME</td>
                <td className="py-1.5"><code className="text-xs">Date</code></td>
                <td className="py-1.5"><code className="text-xs">DateTime</code></td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-1.5">DECIMAL / NUMERIC</td>
                <td className="py-1.5"><code className="text-xs">number</code></td>
                <td className="py-1.5"><code className="text-xs">Decimal</code></td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-1.5">JSON / JSONB</td>
                <td className="py-1.5"><code className="text-xs">{"Record<string, unknown>"}</code></td>
                <td className="py-1.5"><code className="text-xs">Json</code></td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-1.5">UUID</td>
                <td className="py-1.5"><code className="text-xs">string</code></td>
                <td className="py-1.5"><code className="text-xs">String</code></td>
              </tr>
              <tr>
                <td className="py-1.5">BYTEA / BLOB</td>
                <td className="py-1.5"><code className="text-xs">Buffer</code></td>
                <td className="py-1.5"><code className="text-xs">Bytes</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* How it works */}
      <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          How It Works
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <strong>SQL Parser</strong> -- parses CREATE TABLE statements
            supporting PostgreSQL, MySQL, and SQLite syntax including quoted
            identifiers, multi-word types, and constraints.
          </li>
          <li>
            <strong>TypeScript</strong> -- generates typed interfaces with SQL
            type mapping, nullable fields as <code className="text-xs">| null</code> or optional <code className="text-xs">?</code>.
          </li>
          <li>
            <strong>Prisma</strong> -- generates Prisma models with @id,
            @default, @unique, @map, and @db.* annotations.
          </li>
          <li>
            <strong>Drizzle ORM</strong> -- generates table definitions using
            pgTable/mysqlTable/sqliteTable with correct column types and
            modifiers.
          </li>
          <li>
            <strong>Foreign keys</strong> -- detected from both inline
            REFERENCES and table-level FOREIGN KEY constraints.
          </li>
          <li>
            Everything runs in your browser -- no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}

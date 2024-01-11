import { useMemo } from 'react';
import { generateColumns } from './columns';
import { Table } from './Table';
import { Field, Fields } from '../types';
import * as React from 'react';

interface Props<T extends string> {
  fields: Fields<T>;
}

const titleMap: Record<Field<string>['fieldType']['type'], string> = {
  checkbox: 'Boolean',
  select: 'Options',
  input: 'Text',
};

export const generateExampleRow = <T extends string>(fields: Fields<T>) => [
  fields.reduce(
    (acc, field) => {
      acc[field.key as T] = field.example || titleMap[field.fieldType.type];
      return acc;
    },
    {} as Record<T, string>,
  ),
];

export const ExampleTable = <T extends string>({ fields }: Props<T>) => {
  const data = useMemo(() => generateExampleRow(fields), [fields]);
  const columns = useMemo(() => generateColumns(fields), [fields]);

  return (
    <Table
      rows={data}
      columns={columns}
      style={{
        borderBottom: 'none',
      }}
    />
  );
};

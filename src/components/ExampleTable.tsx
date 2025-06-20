import * as React from 'react';

import { DataGrid } from '@mui/x-data-grid';

import { Field, Fields } from '../types';

import { generateColumns } from './columns';

interface Props<T extends string> {
  fields: Fields<T>;
}

const titleMap: Record<Field<string>['fieldType']['type'], string> = {
  checkbox: 'Boolean',
  select: 'Options',
  input: 'Text',
};

export const generateExampleRow = <T extends string>(fields: Fields<T>) => {
  const exampleRow: Record<string, string> = {};

  for (const field of fields) {
    const { key, example, fieldType } = field;
    exampleRow[key] = example ?? titleMap[fieldType.type];
  }

  return [
    {
      id: 1,
      ...exampleRow,
    },
  ];
};

export const ExampleTable = <T extends string>({ fields }: Props<T>) => {
  const rows = React.useMemo(() => {
    return generateExampleRow(fields);
  }, [fields]);
  const columns = React.useMemo(() => {
    return generateColumns(fields);
  }, [fields]);

  return (
    <DataGrid rows={rows} columns={columns} hideFooter disableColumnSorting disableColumnFilter disableColumnMenu />
  );
};

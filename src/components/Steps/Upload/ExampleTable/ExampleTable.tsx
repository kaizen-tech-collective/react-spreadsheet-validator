import * as React from 'react';

import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { Field, Fields } from '../../../../types';
import { generateColumns } from '../../../columns';

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

const ExampleTable = <T extends string>({ fields }: Props<T>) => {
  const rows = React.useMemo(() => {
    return generateExampleRow(fields);
  }, [fields]);
  const columns = React.useMemo(() => {
    return generateColumns(fields);
  }, [fields]);

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      hideFooter
      disableColumnSorting
      disableColumnFilter
      disableColumnMenu
      disableRowSelectionOnClick
      disableColumnResize
      disableVirtualization={false}
      disableMultipleRowSelection
      disableDensitySelector
      disableEval
      sx={{
        [`.${gridClasses.virtualScroller}, .${gridClasses.scrollbar}`]: {
          overflow: 'hidden',
        },
        [`.${gridClasses.row}:hover`]: {
          backgroundColor: 'inherit',
        },
        [`.${gridClasses.cell}`]: {
          cursor: 'default',
        },
        [`.${gridClasses.columnHeader}`]: {
          cursor: 'default',
        },
        [`& .${gridClasses.cell}:focus`]: {
          outline: 'none',
        },
        [`& .${gridClasses.columnHeader}:focus`]: {
          outline: 'none',
        },
        [`& .${gridClasses.columnHeader}:focus-within`]: {
          outline: 'none',
        },
        [`& .${gridClasses.columnSeparator}, & .${gridClasses.columnHeader}:focus .${gridClasses.columnSeparator}`]: {
          display: 'flex !important',
          visibility: 'visible !important',
          opacity: '1 !important',
        },
      }}
    />
  );
};

export default ExampleTable;

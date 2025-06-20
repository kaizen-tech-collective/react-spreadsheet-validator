import * as React from 'react';

import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import Tooltip from '@mui/material/Tooltip';

import { GridColDef } from '@mui/x-data-grid';

import { Fields, RawData } from '../types';

export const generateColumns = <T extends string>(fields: Fields<T>) => {
  return fields.map((column): GridColDef<any> => {
    return {
      field: column.key,
      headerName: column.label,
      minWidth: 150,
      valueFormatter: (_, row) => {
        <Box sx={{ minWidth: '100%', minHeight: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {row[column.key]}
        </Box>;
      },
      renderHeader: () => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', position: 'relative' }}>
          <Box sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{column.label}</Box>
          {column.description && (
            <Tooltip placement="top" title={column.description}>
              <Box flex={'0 0 auto'}>
                <InfoOutlineIcon sx={{ fontSize: '1rem' }} />
              </Box>
            </Tooltip>
          )}
        </Box>
      ),
    };
  });
};

export const generateSelectionColumns = (
  data: RawData[],
  selectedId: number | null,
  onSelect: (id: number) => void,
): GridColDef[] => {
  const longestRowLength = data.reduce((acc, curr) => {
    return Math.max(acc, curr.length);
  }, 0);

  const radioColumn: GridColDef = {
    field: '__radio__',
    renderCell: params => (
      <Radio
        checked={selectedId === params.id}
        onChange={() => {
          return onSelect(params.id as number);
        }}
        value={params.id}
        slotProps={{ input: { 'aria-label': `Select row ${params.id}` } }}
      />
    ),
  };

  const dataColumns: GridColDef[] = Array.from({ length: longestRowLength }, (_, index) => {
    return {
      field: index.toString(),
      name: '',
      minWidth: 150,
    };
  });

  return [radioColumn, ...dataColumns];
};

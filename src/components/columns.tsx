import * as React from 'react';

import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import { GridColDef } from '@mui/x-data-grid';

import { SelectColumn } from 'react-data-grid';

import { Fields, RawData } from '../types';

export const generateColumns = <T extends string>(fields: Fields<T>) => {
  return fields.map(
    (column): GridColDef<any> => ({
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
    }),
  );
};

export const generateSelectionColumns = (data: RawData[]) => {
  const longestRowLength = data.reduce((acc, curr) => (acc > curr.length ? acc : curr.length), 0);
  return [
    SelectColumn,
    ...Array.from(Array(longestRowLength), (_, index) => ({
      key: index.toString(),
      name: '',
    })),
  ];
};

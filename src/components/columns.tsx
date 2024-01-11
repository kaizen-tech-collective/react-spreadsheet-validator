import type { Column } from 'react-data-grid';
import { CgInfo } from 'react-icons/cg';
import { Box, Tooltip } from '@mui/material';
import * as React from 'react';
import {Fields, RawData} from '../types';
import {SelectColumn} from "react-data-grid";

export const generateColumns = <T extends string>(fields: Fields<T>) =>
  fields.map(
    (column): Column<any> => ({
      key: column.key,
      name: column.label,
      minWidth: 150,
      headerRenderer: () => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', position: 'relative' }}>
          <Box sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{column.label}</Box>
          {column.description && (
            <Tooltip placement="top" title={column.description}>
              <Box flex={'0 0 auto'}>
                <CgInfo size="1rem" />
              </Box>
            </Tooltip>
          )}
        </Box>
      ),
      formatter: ({ row }) => (
        <Box sx={{ minWidth: '100%', minHeight: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {row[column.key]}
        </Box>
      ),
    }),
  );

export const generateSelectionColumns = (data: RawData[]) => {
    const longestRowLength = data.reduce((acc, curr) => (acc > curr.length ? acc : curr.length), 0)
    return [
        SelectColumn,
        ...Array.from(Array(longestRowLength), (_, index) => ({
            key: index.toString(),
            name: "",
        })),
    ]
}

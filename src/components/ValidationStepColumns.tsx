import * as React from 'react';

import { GridColDef } from '@mui/x-data-grid';

import InfoIcon from '@mui/icons-material/Info';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';

import type { Data, Fields, Meta } from '../types';

import { MatchColumnSelect } from './MatchColumnSelect';

type Row = Data<string> & Meta;

export const generateColumns = <T extends string>(fields: Fields<T>): GridColDef<Row>[] => {
  return fields.map(
    (column): GridColDef<Row> => ({
      field: column.key,
      headerName: column.label,
      minWidth: 150,
      editable: column.fieldType.type !== 'checkbox',

      headerClassName: 'custom-header',
      renderHeader: () => (
        <Box display="flex" gap={1} alignItems="center">
          <Box flex={1} overflow="hidden" textOverflow="ellipsis">
            {column.label}
          </Box>
          {column.description && (
            <Tooltip title={column.description}>
              <InfoIcon sx={{ fontSize: '1rem' }} />
            </Tooltip>
          )}
        </Box>
      ),

      renderCell: params => {
        const value = params.row[column.key];
        const error = params.row.__errors?.[column.key];

        let content: React.ReactNode;

        switch (column.fieldType.type) {
          case 'checkbox':
            content = (
              <Box onClick={e => e.stopPropagation()}>
                <Switch
                  checked={!!value}
                  onChange={() => params.api.updateRows([{ ...params.row, [column.key]: !value }])}
                />
              </Box>
            );
            break;

          case 'select':
            content = (
              <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {column.fieldType.options.find(o => o.value === value)?.label ?? value}
              </Box>
            );
            break;

          default:
            content = <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</Box>;
        }

        return error ? (
          <Tooltip title={error.message} placement="top">
            {content}
          </Tooltip>
        ) : (
          content
        );
      },

      renderEditCell: params => {
        const value = params.row[column.key];

        switch (column.fieldType.type) {
          case 'select':
            return (
              <MatchColumnSelect
                value={String(value)}
                onChange={val => {
                  params.api.updateRows([{ ...params.row, [column.key]: val }]);
                }}
                options={column.fieldType.options}
              />
            );

          default:
            return (
              <Input
                value={value ?? ''}
                autoFocus
                fullWidth
                size="small"
                onChange={e => params.api.updateRows([{ ...params.row, [column.key]: e.target.value }])}
              />
            );
        }
      },

      cellClassName: params => {
        const error = params.row.__errors?.[column.key];
        if (!error) return '';
        switch (error.level) {
          case 'error':
            return 'rdg-cell-error';
          case 'warning':
            return 'rdg-cell-warning';
          case 'info':
            return 'rdg-cell-info';
          default:
            return '';
        }
      },
    }),
  );
};

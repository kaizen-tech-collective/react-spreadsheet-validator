import * as React from 'react';
import clsx from 'clsx';

import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';

import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

import { GridColDef } from '@mui/x-data-grid';

import { Fields } from '../types';

import { MatchColumnSelect } from './MatchColumnSelect';

export const validationStepColumnStyling = {
  '& .rdg-cell-info': {
    backgroundColor: 'info.light',
    color: 'info.contrastText',
  },
  '& .rdg-cell-error': {
    backgroundColor: 'error.light',
    color: 'error.contrastText',
  },
  '& .rdg-cell-warning': {
    backgroundColor: 'warning.light',
    color: 'warning.contrastText',
  },
};

function generateValidationStepColumns<T extends string>(fields: Fields<T>): GridColDef[] {
  return fields.map(field => {
    return {
      field: field.key,
      headerName: field.label,
      minWidth: 300,
      editable: true,
      cellClassName: params => {
        const error = params.row.__errors?.[field.key];

        if (!error?.level) {
          return '';
        }

        return clsx(`rdg-cell-${error.level}`);
      },
      renderHeader: () => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', position: 'relative' }}>
          <Box sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{field.label}</Box>
          {field.description && (
            <Tooltip placement="top" title={field.description}>
              <Box flex={'0 0 auto'}>
                <InfoOutlineIcon sx={{ fontSize: '1rem' }} />
              </Box>
            </Tooltip>
          )}
        </Box>
      ),
      renderCell: params => {
        const value = params.row[field.key];
        const error = params.row.__errors?.[field.key];

        let content: React.ReactNode;

        switch (field.fieldType.type) {
          case 'checkbox':
            content = (
              <Box
                onClick={e => {
                  return e.stopPropagation();
                }}
              >
                <Switch
                  checked={!!value}
                  onChange={() => {
                    return params.api.updateRows([{ ...params.row, [field.key]: !value }]);
                  }}
                />
              </Box>
            );
            break;

          case 'select':
            content = (
              <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {field.fieldType.options.find(o => {
                  return o.value === value;
                })?.label ?? value}
              </Box>
            );
            break;

          default:
            content = <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</Box>;
        }

        if (!error) {
          return content;
        }

        return (
          <Tooltip title={error.message} placement="top">
            {content ?? ''}
          </Tooltip>
        );
      },

      renderEditCell: params => {
        const value = params.row[field.key];

        async function handleOnChange(event: any, options?: any) {
          await params.api.setEditCellValue(
            {
              id: params.row.__index,
              field: params.field,
              value: event.target.value,
            },
            event,
          );
          if (options?.stopCellEditMode) {
            params.api.stopCellEditMode({ id: params.row.__index, field: params.field });
          }
        }

        switch (field.fieldType.type) {
          case 'select':
            return (
              <MatchColumnSelect
                value={value}
                options={field.fieldType.options}
                onChange={event => {
                  return handleOnChange(event, { stopCellEditMode: true });
                }}
              />
            );

          default:
            return (
              <Input
                value={value}
                autoFocus
                fullWidth
                onChange={event => {
                  return handleOnChange(event);
                }}
              />
            );
        }
      },
    };
  });
}

export default generateValidationStepColumns;

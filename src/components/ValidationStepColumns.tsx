import { Column, useRowSelection } from 'react-data-grid';
import type { ChangeEvent } from 'react';
import type { Data, Fields, Meta } from '../types';
import { CgInfo } from 'react-icons/cg';
import * as React from 'react';
import { MatchColumnSelect } from './MatchColumnSelect';
import { Box, Checkbox, Input, Switch, Tooltip } from '@mui/material';

const SELECT_COLUMN_KEY = 'select-row';
//
// function autoFocusAndSelect(input: HTMLInputElement | null) {
//   input?.focus();
//   input?.select();
// }

export const generateColumns = <T extends string>(fields: Fields<T>): Column<Data<T> & Meta>[] => [
  {
    key: SELECT_COLUMN_KEY,
    name: '',
    width: 50,
    minWidth: 50,
    maxWidth: 50,
    resizable: false,
    sortable: false,
    frozen: true,
    formatter: props => {
      const [isRowSelected, onRowSelectionChange] = useRowSelection();
      return (
        <Checkbox
          aria-label="Select"
          checked={isRowSelected}
          onChange={event => {
            onRowSelectionChange({
              row: props.row,
              checked: Boolean(event.target.checked),
              isShiftClick: (event.nativeEvent as MouseEvent).shiftKey,
            });
          }}
        />
      );
    },
  },
  ...fields.map(
    (column): Column<Data<T> & Meta> => ({
      key: column.key,
      name: column.label,
      minWidth: 150,
      resizable: true,
      headerRenderer: () => (
        <Box display="flex" gap={1} alignItems="center" position="relative">
          <Box flex={1} overflow="hidden" textOverflow="ellipsis">
            {column.label}
          </Box>
          {column.description && (
            <Tooltip placement="top" title={column.description}>
              <Box flex={'0 0 auto'}>
                <CgInfo size="1rem" />
              </Box>
            </Tooltip>
          )}
        </Box>
      ),
      editable: column.fieldType.type !== 'checkbox',
      editor: ({ row, onRowChange, onClose }) => {
        let component;

        switch (column.fieldType.type) {
          case 'select':
            component = (
              <MatchColumnSelect
                value={column.fieldType.options.find(option => option.value === (row[column.key] as string))}
                onChange={value => {
                  onRowChange({ ...row, [column.key]: value?.value }, true);
                }}
                options={column.fieldType.options}
              />
            );
            break;
          default:
            component = (
              <Box sx={{ paddingInlineStart: '0.5rem' }}>
                <Input
                  autoFocus
                  size="small"
                  value={row[column.key] as string}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    onRowChange({ ...row, [column.key]: event.target.value });
                  }}
                  onBlur={() => onClose(true)}
                />
              </Box>
            );
        }

        return component;
      },
      editorOptions: {
        editOnClick: true,
      },
      formatter: ({ row, onRowChange }) => {
        let component;

        switch (column.fieldType.type) {
          case 'checkbox':
            component = (
              <Box
                display="flex"
                alignItems="center"
                height="100%"
                onClick={event => {
                  event.stopPropagation();
                }}
              >
                <Switch
                  checked={row[column.key] as boolean}
                  onChange={() => {
                    onRowChange({ ...row, [column.key]: !row[column.key as T] });
                  }}
                />
              </Box>
            );
            break;
          case 'select':
            component = (
              <Box minWidth="100%" minHeight="100%" overflow="hidden" textOverflow="ellipsis">
                {column.fieldType.options.find(option => option.value === row[column.key as T])?.label || null}
              </Box>
            );
            break;
          default:
            component = (
              <Box minWidth="100%" minHeight="100%" overflow="hidden" textOverflow="ellipsis">
                {row[column.key as T]}
              </Box>
            );
        }

        if (row.__errors?.[column.key]) {
          return (
            <Tooltip placement="top" title={row.__errors?.[column.key]?.message}>
              {component}
            </Tooltip>
          );
        }

        return component;
      },
      cellClass: (row: Meta) => {
        switch (row.__errors?.[column.key]?.level) {
          case 'error':
            return 'rdg-cell-error';
            case 'warning':
            return 'background: aliceblue;';
          case 'info':
            return 'rdg-cell-info';
          default:
            return '';
        }
      },
    }),
  ),
];

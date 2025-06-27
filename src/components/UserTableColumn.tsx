import * as React from 'react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import CloseIcon from '@mui/icons-material/Close';
import UndoIcon from '@mui/icons-material/Undo';

import { RawData } from '../types';

import type { Column } from './Steps/MatchColumns';
import { ColumnType } from './Steps/MatchColumns';

type UserTableColumnProps<T extends string> = {
  column: Column<T>;
  entries: RawData;
  onIgnore: (index: number) => void;
  onRevertIgnore: (index: number) => void;
};

export const UserTableColumn = <T extends string>(props: UserTableColumnProps<T>) => {
  const {
    column: { header, index, type },
    entries,
    onIgnore,
    onRevertIgnore,
  } = props;
  const isIgnored = type === ColumnType.ignored;
  return (
    <>
      <Box sx={{ justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
        <Typography variant="subtitle2" color={isIgnored ? '#a0aec0' : 'black'} sx={{ px: '24px', py: '16px' }}>
          {header}
        </Typography>
        <Box sx={{ mr: '50px' }}>
          {type === ColumnType.ignored ? (
            <IconButton size="small" aria-labelledby="Ignore column" onClick={() => onRevertIgnore(index)}>
              <UndoIcon fontSize="small" />
            </IconButton>
          ) : (
            <IconButton size="small" aria-labelledby="Ignore column" onClick={() => onIgnore(index)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>
      <Box sx={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        {entries.map((entry, index) => (
          <Typography
            variant="body2"
            key={(entry || '') + index}
            data-ignored={isIgnored}
            sx={{ px: '24px', py: '16px' }}
            color={isIgnored ? '#a0aec0' : 'black'}
          >
            {entry}
          </Typography>
        ))}
      </Box>
    </>
  );
};

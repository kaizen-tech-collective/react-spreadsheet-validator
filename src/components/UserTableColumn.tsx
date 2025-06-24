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
      <Box sx={{ padding: 2, justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
        <Typography color={isIgnored ? '#a0aec0' : 'black'}>{header}</Typography>
        {type === ColumnType.ignored ? (
          <IconButton aria-labelledby="Ignore column" onClick={() => onRevertIgnore(index)}>
            <UndoIcon />
          </IconButton>
        ) : (
          <IconButton aria-labelledby="Ignore column" onClick={() => onIgnore(index)}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      <Box sx={{ padding: 2, justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        {entries.map((entry, index) => (
          <Typography key={(entry || '') + index} data-ignored={isIgnored}>
            {entry}
          </Typography>
        ))}
      </Box>
    </>
  );
};

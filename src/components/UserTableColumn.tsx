import { CgClose, CgUndo } from 'react-icons/cg';
import type { Column } from './Steps/MatchColumns';
import { ColumnType } from './Steps/MatchColumns';
import { RawData } from '../types';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Box, IconButton } from '@mui/material';

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
            <CgUndo />
          </IconButton>
        ) : (
          <IconButton aria-labelledby="Ignore column" onClick={() => onIgnore(index)}>
            <CgClose />
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

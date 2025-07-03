import * as React from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Toolbar } from '@mui/x-data-grid';

import { QuickSearch } from './QuickFilters';

export type ValidationFilterOptions = 'all' | 'errors' | 'warnings';

interface ValidationToolbarProps {
  activeFilter: ValidationFilterOptions;
  onFilterChange: (filter: ValidationFilterOptions) => void;
  totalRows: number;
  errorRows: number;
  warningRows: number;
}

/**
 * Custom toolbar component for the validation step DataGrid
 * Provides quick search functionality and custom filtering options using interactive chips
 */
const ValidationToolbar = ({
  activeFilter,
  onFilterChange,
  totalRows,
  errorRows,
  warningRows,
}: ValidationToolbarProps) => {
  const handleErrorsClick = () => {
    if (errorRows > 0) {
      onFilterChange(activeFilter === 'errors' ? 'all' : 'errors');
    }
  };

  const handleWarningsClick = () => {
    if (warningRows > 0) {
      onFilterChange(activeFilter === 'warnings' ? 'all' : 'warnings');
    }
  };

  return (
    <Toolbar>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, mx: 0.5 }}>
        <Typography variant="subtitle1" sx={{ flex: 1 }}>
          {totalRows} total {totalRows === 1 ? 'row' : 'rows'}
        </Typography>
      </Box>
      <Stack direction="row" spacing={1} sx={{ flex: 1, justifyContent: 'flex-end', mr: 0.5 }}>
        {errorRows > 0 && (
          <Chip
            label={`${errorRows} ${errorRows === 1 ? 'error' : 'errors'}`}
            onClick={handleErrorsClick}
            variant={activeFilter === 'errors' ? 'filled' : 'outlined'}
            color="error"
            size="small"
            clickable
          />
        )}

        {warningRows > 0 && (
          <Chip
            label={`${warningRows} ${warningRows === 1 ? 'warning' : 'warnings'}`}
            onClick={handleWarningsClick}
            variant={activeFilter === 'warnings' ? 'filled' : 'outlined'}
            color="warning"
            size="small"
            clickable
          />
        )}
      </Stack>
      <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />
      <QuickSearch />
    </Toolbar>
  );
};

export default ValidationToolbar;

import * as React from 'react';

import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { Toolbar } from '@mui/x-data-grid';

import { QuickSearch } from './Search';
import { FilterChips, type ValidationFilterOptions, type FilterChipsProps } from './Filter';

export type { ValidationFilterOptions };

interface ValidationToolbarProps extends FilterChipsProps {
  totalRows: number;
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
  return (
    <Toolbar>
      <Typography sx={{ flex: 1, ml: 0.5 }}>
        Preparing to upload{' '}
        <strong>
          {totalRows.toLocaleString()} {totalRows === 1 ? 'row' : 'rows'}
        </strong>
      </Typography>
      <FilterChips
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
        errorRows={errorRows}
        warningRows={warningRows}
      />
      <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />
      <QuickSearch />
    </Toolbar>
  );
};

export default ValidationToolbar;

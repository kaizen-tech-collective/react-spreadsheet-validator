import * as React from 'react';

import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { Toolbar } from '@mui/x-data-grid';

import { QuickSearch } from './Search';
import { FilterChips, type ValidationFilterOptions, type FilterChipsProps } from './Filter';

export type { ValidationFilterOptions };

export interface ValidationToolbarProps extends FilterChipsProps {
  totalRows: number;
  selectedRowCount: number;
}

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides extends ValidationToolbarProps {}
}

/**
 * Custom toolbar component for the validation step DataGrid
 * Provides quick search functionality and custom filtering options using interactive chips
 */
const ValidationToolbar = ({
  activeFilter,
  onFilterChange,
  totalRows,
  selectedRowCount,
  errorRows,
  warningRows,
}: ValidationToolbarProps) => {
  const displayCount = selectedRowCount > 0 ? selectedRowCount : totalRows;
  const label = selectedRowCount > 0 ? 'selected row' : 'row';

  return (
    <Toolbar>
      <Typography sx={{ flex: 1, ml: 0.5 }}>
        Preparing to upload{' '}
        <strong>
          {displayCount.toLocaleString()} {displayCount === 1 ? label : `${label}s`}
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

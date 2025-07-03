import * as React from 'react';

import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { Toolbar } from '@mui/x-data-grid';

import { FilterMenu, QuickSearch, type ValidationFilterOptions } from './QuickFilters';

export type { ValidationFilterOptions };

interface ValidationToolbarProps {
  activeFilter: ValidationFilterOptions;
  onFilterChange: (filter: ValidationFilterOptions) => void;
}

/**
 * Custom toolbar component for the validation step DataGrid
 * Provides quick search functionality and custom filtering options
 */
const ValidationToolbar: React.FC<ValidationToolbarProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <Toolbar>
      <Typography fontWeight="medium" sx={{ flex: 1, mx: 0.5 }}>
        # of rows
      </Typography>
      <FilterMenu activeFilter={activeFilter} onFilterChange={onFilterChange} />
      <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />
      <QuickSearch />
    </Toolbar>
  );
};

export default ValidationToolbar;

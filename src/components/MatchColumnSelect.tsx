import * as React from 'react';

import TextField from '@mui/material/TextField';

import { SelectOption } from '../types';

interface Props {
  onChange: (event: any) => void;
  value?: string;
  options: readonly SelectOption[];
  placeholder?: string;
  name?: string;
}

export const MatchColumnSelect = ({ onChange, value, options, placeholder, name }: Props) => {
  // const styles = useStyleConfig("MatchColumnsStep") as Styles
  return (
    <TextField
      select
      fullWidth
      name={name}
      value={value ?? ''}
      onChange={onChange}
      slotProps={{
        select: {
          native: true,
        },
      }}
    >
      <option value="" disabled>
        {placeholder ?? '-- Select --'}
      </option>
      {options.map(option => {
        return (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        );
      })}
    </TextField>
  );
};

import * as React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { useRsi } from '../hooks/useRsi';

import type { MatchedOptions, MatchedSelectColumn, MatchedSelectOptionsColumn } from './Steps/MatchColumns';

import { getFieldOptions } from './MatchColumns/getFieldOptions';
import { MatchColumnSelect } from './MatchColumnSelect';

interface Props<T> {
  option: MatchedOptions<T> | Partial<MatchedOptions<T>>;
  column: MatchedSelectColumn<T> | MatchedSelectOptionsColumn<T>;
  onSubChange: (val: T, index: number, option: string) => void;
}

export const SubMatchingSelect = <T extends string>({ option, column, onSubChange }: Props<T>) => {
  // const styles = useStyleConfig("MatchColumnsStep") as Styles
  const { translations, fields } = useRsi<T>();
  const options = getFieldOptions(fields, column.value);
  const value = option.value ?? '';

  return (
    <Box px={2} pb={1}>
      <Typography>{option.entry}</Typography>
      <MatchColumnSelect
        value={value}
        placeholder={translations.matchColumnsStep.subSelectPlaceholder}
        onChange={event => {
          return onSubChange(event.target.value as T, column.index, option.entry!);
        }}
        options={options}
        name={option.entry}
      />
    </Box>
  );
};

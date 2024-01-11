import type { MatchedOptions, MatchedSelectColumn, MatchedSelectOptionsColumn } from './Steps/MatchColumns';
import { useRsi } from '../hooks/useRsi';
import { getFieldOptions } from './MatchColumns/getFieldOptions';
import Typography from '@mui/material/Typography';
import { MatchColumnSelect } from './MatchColumnSelect';
import { Box } from '@mui/material';
import * as React from 'react';

interface Props<T> {
  option: MatchedOptions<T> | Partial<MatchedOptions<T>>;
  column: MatchedSelectColumn<T> | MatchedSelectOptionsColumn<T>;
  onSubChange: (val: T, index: number, option: string) => void;
}

export const SubMatchingSelect = <T extends string>({ option, column, onSubChange }: Props<T>) => {
  // const styles = useStyleConfig("MatchColumnsStep") as Styles
  const { translations, fields } = useRsi<T>();
  const options = getFieldOptions(fields, column.value);
  const value = options.find(opt => opt.value == option.value);
console.log(value);
  return (
    <Box pl={2} pb="0.375rem">
      <Typography>{option.entry}</Typography>
      <MatchColumnSelect
        value={value}
        placeholder={translations.matchColumnsStep.subSelectPlaceholder}
        onChange={value => onSubChange(value?.value as T, column.index, option.entry!)}
        options={options}
        name={option.entry}
      />
    </Box>
  );
};

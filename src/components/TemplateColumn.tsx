import type { Column } from './Steps/MatchColumns';
import { ColumnType } from './Steps/MatchColumns';
import type { Fields } from '../types';
import type { Translations } from '../translationsRSIProps';
import { SubMatchingSelect } from './SubMatchingSelect';
import { useRsi } from '../hooks/useRsi';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Accordion, AccordionSummary, Box, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import { MatchColumnSelect } from './MatchColumnSelect';
import {FaCheckCircle, FaCircle, FaCircleNotch, FaRegCircle} from 'react-icons/fa';

const getAccordionTitle = <T extends string>(fields: Fields<T>, column: Column<T>, translations: Translations) => {
  const fieldLabel = fields.find(field => 'value' in column && field.key === column.value)!.label;
  return `${translations.matchColumnsStep.matchDropdownTitle} ${fieldLabel} (${
    'matchedOptions' in column && column.matchedOptions.length
  } ${translations.matchColumnsStep.unmatched})`;
};

type TemplateColumnProps<T extends string> = {
  onChange: (val: T, index: number) => void;
  onSubChange: (val: T, index: number, option: string) => void;
  column: Column<T>;
};

export const TemplateColumn = <T extends string>({ column, onChange, onSubChange }: TemplateColumnProps<T>) => {
  const { translations, fields } = useRsi<T>();
  // const styles = useStyleConfig("MatchColumnsStep") as Styles
  const isIgnored = column.type === ColumnType.ignored;
  const isChecked =
    column.type === ColumnType.matched ||
    column.type === ColumnType.matchedCheckbox ||
    column.type === ColumnType.matchedSelectOptions;
  const isSelect = 'matchedOptions' in column;
  const selectOptions = fields.map(({ label, key }) => ({ value: key, label }));
  const selectValue = selectOptions.find(({ value }) => 'value' in column && column.value === value);

  return (
    <Box sx={{ minHeight: 10, width: '100%', flexDirection: 'column', justifyContent: 'center' }}>
      {isIgnored ? (
        <Typography color={'#a0aec0'}>{translations.matchColumnsStep.ignoredColumnText}</Typography>
      ) : (
        <>
          <Grid container>
            <Grid item xs={10}>
              <MatchColumnSelect
                placeholder={translations.matchColumnsStep.selectPlaceholder}
                value={selectValue}
                onChange={value => onChange(value?.value as T, column.index)}
                options={selectOptions}
                name={column.header}
              />
            </Grid>
            <Grid item xs={2} display={'flex'} style={{ alignItems: 'center', justifyContent: 'center' }}>
              {isChecked ? <FaCheckCircle color={'green'} size="1.5rem" /> : <FaRegCircle size="1.5rem" color={'orange'}/>}
            </Grid>
          </Grid>
          {isSelect && (
            <Box width="100%">
              <Accordion>
                <AccordionSummary
                  expandIcon={
                    <Button sx={{ ':hover': { bg: 'transparent' }, ':focus': { shadow: 'none' }, px: 0, py: 4 }} />
                  }
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Box textAlign="left">
                    <Typography>{getAccordionTitle<T>(fields, column, translations)}</Typography>
                  </Box>
                </AccordionSummary>
                <Box sx={{ pb: 4, pr: 3, display: 'flex', flexDir: 'column' }}>
                  {column.matchedOptions.map(option => (
                    <SubMatchingSelect option={option} column={column} onSubChange={onSubChange} key={option.entry} />
                  ))}
                </Box>
              </Accordion>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

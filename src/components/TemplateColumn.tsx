import * as React from 'react';

import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';

import { useRsi } from '../hooks/useRsi';
import type { Translations } from '../translationsRSIProps';
import type { Fields } from '../types';

import { MatchColumnSelect } from './MatchColumnSelect';
import type { Column } from './Steps/MatchColumns';
import { ColumnType } from './Steps/MatchColumns';
import { SubMatchingSelect } from './SubMatchingSelect';

const getAccordionTitle = <T extends string>(fields: Fields<T>, column: Column<T>, translations: Translations) => {
  const fieldLabel = fields.find(field => {
    return 'value' in column && field.key === column.value;
  })!.label;
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
  const selectOptions = fields.map(({ label, key }) => {
    return { value: key, label };
  });

  return (
    <Box sx={{ minHeight: 10, width: '100%', flexDirection: 'column', justifyContent: 'center' }}>
      {isIgnored ? (
        <Typography sx={{ py: '16px' }} color="#a0aec0">
          {translations.matchColumnsStep.ignoredColumnText}
        </Typography>
      ) : (
        <>
          <Grid container>
            <Grid size={10}>
              <MatchColumnSelect
                placeholder={translations.matchColumnsStep.selectPlaceholder}
                value={'value' in column ? column.value : ''}
                options={selectOptions}
                name={column.header}
                onChange={event => {
                  return onChange(event.target.value as T, column.index);
                }}
              />
            </Grid>
            <Grid size={2} display={'flex'} style={{ alignItems: 'center', justifyContent: 'center' }}>
              {isChecked ? (
                <CheckCircleIcon fontSize="large" color="primary" />
              ) : (
                <CircleOutlinedIcon fontSize="large" color="disabled" />
              )}
            </Grid>
          </Grid>
          {isSelect && (
            <Box width="100%">
              <Accordion elevation={0}>
                <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
                  <Box textAlign="left">
                    <Typography sx={{ color: 'primary.main' }}>
                      {getAccordionTitle<T>(fields, column, translations)}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <Stack>
                  {column.matchedOptions.map(option => (
                    <SubMatchingSelect option={option} column={column} onSubChange={onSubChange} key={option.entry} />
                  ))}
                </Stack>
              </Accordion>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

import type { Column, Columns } from './Steps/MatchColumns';
import { FadingWrapper } from './FadingWrapper';
import { Button, DialogActions, DialogContent } from '@mui/material';
import { useRsi } from '../hooks/useRsi';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import React from 'react';

type ColumnGridProps<T extends string> = {
  columns: Columns<T>;
  userColumn: (column: Column<T>) => React.ReactNode;
  templateColumn: (column: Column<T>) => React.ReactNode;
  onContinue: () => void;
  isLoading: boolean;
};

// export type Styles = (typeof themeOverrides)["components"]["MatchColumnsStep"]["baseStyle"]

export const ColumnGrid = <T extends string>({
  columns,
  userColumn,
  templateColumn,
  onContinue,
  isLoading,
}: ColumnGridProps<T>) => {
  const { translations } = useRsi();
  // const styles = useStyleConfig("MatchColumnsStep") as Styles
  return (
    <>
      <Box
        flex={1}
        display="grid"
        gridTemplateRows="auto auto auto 1fr"
        gridTemplateColumns={`0.75rem repeat(${columns.length}, minmax(18rem, auto)) 0.75rem`}
      >
        <Box gridColumn={`1/${columns.length + 3}`}>
          <Typography variant={'h5'} gutterBottom>
            {translations.matchColumnsStep.userTableTitle}
          </Typography>
        </Box>
        <>
          {columns.map((column, index) => (
            <Box gridRow="2/3" gridColumn={`${index + 2}/${index + 3}`} pt={3} key={column.header + index}>
              {userColumn(column)}
            </Box>
          ))}
          <FadingWrapper gridColumn={`1/${columns.length + 3}`} gridRow="2/3" />
          <Box gridColumn={`1/${columns.length + 3}`} mt={7}>
            <Typography variant={'h5'} gutterBottom>
              {translations.matchColumnsStep.templateTitle}
            </Typography>
          </Box>
          <FadingWrapper gridColumn={`1/${columns.length + 3}`} gridRow="4/5" />
          {columns.map((column, index) => (
            <Box
              key={column.header + index}
              sx={{
                gridRow: '4/5',
                gridColumn: `${index + 2}/${index + 3}`,
                py: '1.125rem',
                pl: 2,
                pr: 3,
              }}
            >
              {templateColumn(column)}
            </Box>
          ))}
        </>
      </Box>
    </>
  );
};

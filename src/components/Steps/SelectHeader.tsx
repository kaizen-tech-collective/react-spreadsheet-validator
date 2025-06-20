import * as React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { GridRowSelectionModel } from '@mui/x-data-grid';

import { useRsi } from '../../hooks/useRsi';
import type { RawData } from '../../types';

import { SelectHeaderTable } from '../SelectHeaderTable';

type SelectHeaderProps = {
  data: RawData[];
  onContinue: (headerValues: RawData, data: RawData[]) => Promise<void>;
};

export const SelectHeaderStep = ({ data, onContinue }: SelectHeaderProps) => {
  // const styles = useStyleConfig(
  //     "SelectHeaderStep",
  // ) as (typeof themeOverrides)["components"]["SelectHeaderStep"]["baseStyle"]
  const { translations } = useRsi();
  const [selectedRows, setSelectedRows] = React.useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set<number>([0]), // Auto-select first row (id = 0)
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const handleContinue = React.useCallback(async () => {
    const [rawId] = Array.from(selectedRows.ids);
    const selectedRowId = Number(rawId);

    if (!Number.isNaN(selectedRowId)) {
      const header = data[selectedRowId];
      const trimmedData = data.slice(selectedRowId + 1);

      setIsLoading(true);
      await onContinue(header, trimmedData);
      setIsLoading(false);
    }
  }, [onContinue, data, selectedRows]);

  return (
    <>
      <Typography variant={'h4'} gutterBottom>
        {translations.selectHeaderStep.title}
      </Typography>
      <Box style={{ height: '50vh', display: 'flex', flexDirection: 'column' }}>
        <SelectHeaderTable data={data} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
      </Box>
      {isLoading ? (
        <>Loading...</>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: 2,
          }}
        >
          <Button
            variant="contained"
            style={{ width: 300 }}
            onClick={() => {
              return handleContinue();
            }}
          >
            {translations.selectHeaderStep.nextButtonTitle}
          </Button>
        </Box>
      )}
    </>
  );
};

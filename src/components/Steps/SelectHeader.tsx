import { useCallback, useState } from 'react';
import { useRsi } from '../../hooks/useRsi';
import type { RawData } from '../../types';
import { Box, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import * as React from 'react';
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
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<number>>(new Set([0]));
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = useCallback(async () => {
    const [selectedRowIndex] = selectedRows;
    // We consider data above header to be redundant
    const trimmedData = data.slice(selectedRowIndex + 1);
    setIsLoading(true);
    await onContinue(data[selectedRowIndex], trimmedData);
    setIsLoading(false);
  }, [onContinue, data, selectedRows]);

  return (
    <>
      <Typography variant={'h4'} gutterBottom>{translations.selectHeaderStep.title}</Typography>
      <Box sx={{ h: 0, flexGrow: 1 }}>
        <SelectHeaderTable data={data} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
      </Box>
      {isLoading ? (
        <>{'Loading...'}</>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: 2,
          }}
        >
          <Button variant={'contained'} onClick={() => handleContinue()} style={{ width: 300 }}>
            {translations.selectHeaderStep.nextButtonTitle}
          </Button>
        </Box>
      )}
    </>
  );
};

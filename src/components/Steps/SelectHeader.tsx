import * as React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import DialogActions from '@mui/material/DialogActions';
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {isLoading ? (
        // TODO: Abstract this to a re-usable component between steps
        <Box
          sx={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}
        >
          <CircularProgress size="80px" />
          <Typography variant="h6" color="text.secondary">
            <strong>Processing...</strong>
          </Typography>
        </Box>
      ) : (
        <>
          <Typography variant="h5" sx={{ mb: '32px' }}>
            {translations.selectHeaderStep.title}
          </Typography>
          <SelectHeaderTable data={data} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
          <DialogActions
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
          </DialogActions>
        </>
      )}
    </Box>
  );
};

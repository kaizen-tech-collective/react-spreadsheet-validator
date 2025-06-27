import * as React from 'react';

import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';

import CloseIcon from '@mui/icons-material/Close';

import HorizontalStepper from './components/Stepper';
import { Providers } from './Providers';
import { translations } from './translationsRSIProps';
import { RsiProps } from './types';

export const defaultRSIProps: Partial<RsiProps<any>> = {
  autoMapHeaders: true,
  allowInvalidSubmit: true,
  autoMapDistance: 2,
  translations,
  uploadStepHook: async (value: any) => {
    return value;
  },
  selectHeaderStepHook: async (headerValues: any, data: any) => {
    return { headerValues, data };
  },
  matchColumnsStepHook: async (table: any) => {
    return table;
  },
  dateFormat: 'yyyy-mm-dd', // ISO 8601,
  parseRaw: true,
};

export const ReactSpreadsheetImport = <T extends string>(props: RsiProps<T>) => {
  const { isOpen, onClose } = props;

  const handleClose = React.useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Providers rsiValues={{ ...props, translations }}>
      <Dialog
        fullScreen
        open={isOpen}
        onClose={handleClose}
        sx={{ m: '32px' }}
        slotProps={{
          paper: {
            sx: { borderRadius: '24px' },
          },
        }}
      >
        <IconButton size="small" sx={{ position: 'fixed', top: '8px', right: '8px' }}>
          <CloseIcon fontSize="small" color="disabled" />
        </IconButton>
        <HorizontalStepper />
      </Dialog>
    </Providers>
  );
};

ReactSpreadsheetImport.defaultProps = defaultRSIProps;

import * as React from 'react';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';

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
  return (
    <Providers rsiValues={{ ...props, translations }}>
      <Dialog fullWidth maxWidth={'lg'} open={props.isOpen} onClose={props.onClose}>
        <Box>
          <HorizontalStepper />
        </Box>
      </Dialog>
    </Providers>
  );
};

ReactSpreadsheetImport.defaultProps = defaultRSIProps;

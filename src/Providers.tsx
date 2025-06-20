import * as React from 'react';
import { createContext } from 'react';
import { RsiProps } from './types';

export const RsiContext = createContext({} as any);

type ProvidersProps<T extends string> = {
  children: React.ReactNode;
  rsiValues: RsiProps<T>;
};

export const Providers = <T extends string>({ children, rsiValues }: ProvidersProps<T>) => {
  if (!rsiValues.fields) {
    throw new Error('Fields must be provided to react-spreadsheet-import');
  }

  return <RsiContext.Provider value={rsiValues}>{children}</RsiContext.Provider>;
};

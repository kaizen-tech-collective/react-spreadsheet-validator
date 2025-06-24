import { useContext } from 'react';
import type { MarkRequired } from 'ts-essentials';

import { RsiContext } from '../Providers';
import type { Translations } from '../translationsRSIProps';
import { translations } from '../translationsRSIProps';
import type { RsiProps } from '../types';

export const defaultRSIProps: Partial<RsiProps<any>> = {
  allowInvalidSubmit: true,
  translations: translations,
  uploadStepHook: async value => value,
  selectHeaderStepHook: async (headerValues, data) => ({ headerValues, data }),
  matchColumnsStepHook: async table => table,
  dateFormat: 'yyyy-mm-dd', // ISO 8601,
  parseRaw: true,
} as const;

export const useRsi = <T extends string>() =>
  useContext<MarkRequired<RsiProps<T>, keyof typeof defaultRSIProps> & { translations: Translations }>(RsiContext);

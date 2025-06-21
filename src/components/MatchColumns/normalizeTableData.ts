import { RawData, Fields, Data } from '../../types';

import type { Columns } from '../Steps/MatchColumns';
import { ColumnType } from '../Steps/MatchColumns';

import { normalizeCheckboxValue } from './normalizeCheckboxValue';

export const normalizeTableData = <T extends string>(columns: Columns<T>, data: RawData[], fields: Fields<T>) => {
  return data.map(row =>
    columns.reduce((acc, column, index) => {
      const curr = row[index];
      switch (column.type) {
        case ColumnType.matchedCheckbox: {
          const field = fields.find(field => {
            return field.key === column.value;
          })!;
          if ('booleanMatches' in field.fieldType && Object.keys(field.fieldType).length) {
            const booleanMatchKey = Object.keys(field.fieldType.booleanMatches || []).find(key => {
              return key.toLowerCase() === curr?.toLowerCase();
            })!;
            const booleanMatch = field.fieldType.booleanMatches?.[booleanMatchKey];
            acc[column.value] = booleanMatchKey ? booleanMatch : normalizeCheckboxValue(curr);
          } else {
            acc[column.value] = normalizeCheckboxValue(curr);
          }
          return acc;
        }
        case ColumnType.matched: {
          acc[column.value] = curr === '' ? undefined : curr;
          return acc;
        }
        case ColumnType.matchedSelect:
        case ColumnType.matchedSelectOptions: {
          const matchedOption = column.matchedOptions.find(({ entry }) => {
            return entry === curr;
          });
          acc[column.value] = matchedOption?.value || undefined;
          return acc;
        }
        case ColumnType.empty:
        case ColumnType.ignored: {
          return acc;
        }
        default:
          return acc;
      }
    }, {} as Data<T>),
  );
};

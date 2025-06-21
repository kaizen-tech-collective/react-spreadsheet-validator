import { Fields } from '../../types';

import { Columns } from '../Steps/MatchColumns';

export const findUnmatchedRequiredFields = <T extends string>(fields: Fields<T>, columns: Columns<T>) => {
  return (
    fields
      .filter(field => {
        return field.validations?.some(validation => {
          return validation.rule === 'required';
        });
      })
      .filter(field => {
        return (
          columns.findIndex(column => {
            return 'value' in column && column.value === field.key;
          }) === -1
        );
      })
      .map(field => {
        return field.label;
      }) || []
  );
};

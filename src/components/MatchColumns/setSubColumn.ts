import { ColumnType, MatchedOptions, MatchedSelectColumn, MatchedSelectOptionsColumn } from '../Steps/MatchColumns';

export const setSubColumn = <T>(
  oldColumn: MatchedSelectColumn<T> | MatchedSelectOptionsColumn<T>,
  entry: string,
  value: string,
): MatchedSelectColumn<T> | MatchedSelectOptionsColumn<T> => {
  const options = oldColumn.matchedOptions.map(option => {
    return option.entry === entry ? { ...option, value } : option;
  });
  const allMathced = options.every(({ value }) => {
    return !!value;
  });
  if (allMathced) {
    return { ...oldColumn, matchedOptions: options as MatchedOptions<T>[], type: ColumnType.matchedSelectOptions };
  } else {
    return { ...oldColumn, matchedOptions: options as MatchedOptions<T>[], type: ColumnType.matchedSelect };
  }
};

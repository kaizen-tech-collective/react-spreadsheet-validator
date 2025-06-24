import { Column, ColumnType } from '../Steps/MatchColumns';

export const setIgnoreColumn = <T extends string>({ header, index }: Column<T>): Column<T> => {
  return {
    header,
    index,
    type: ColumnType.ignored,
  };
};

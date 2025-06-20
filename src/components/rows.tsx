import { RawData } from '../types';

export const generateSelectionRows = (data: RawData[]) => {
  return data.map((row, index) => {
    const obj: Record<string, any> = { id: index };
    row.forEach((cell, colIndex) => {
      obj[colIndex.toString()] = cell;
    });
    return obj;
  });
};

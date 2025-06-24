import * as React from 'react';

import { DataGrid, GridRowSelectionModel, gridClasses } from '@mui/x-data-grid';

import { RawData } from '../types';

import { generateSelectionColumns } from './columns';
import { generateSelectionRows } from './rows';

interface Props {
  data: RawData[];
  selectedRows: GridRowSelectionModel;
  setSelectedRows: (rows: GridRowSelectionModel) => void;
}

export const SelectHeaderTable = ({ data, selectedRows, setSelectedRows }: Props) => {
  const rows = React.useMemo(() => {
    return generateSelectionRows(data);
  }, [data]);

  const selectedId = React.useMemo(() => {
    const values = [...selectedRows.ids];
    if (values.length <= 0) {
      return null;
    }
    return Number(values[0]);
  }, [selectedRows]);

  const handleRowSelect = (id: number) => {
    setSelectedRows({ type: 'include', ids: new Set([id]) });
  };

  const columns = React.useMemo(() => {
    return generateSelectionColumns(data, selectedId, handleRowSelect);
  }, [data, selectedId]);

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      hideFooter
      disableColumnSorting
      disableColumnFilter
      disableColumnMenu
      rowSelectionModel={selectedRows}
      onRowClick={params => {
        handleRowSelect(params.id as number);
      }}
      sx={{
        // Hide header row of the data grid
        [`.${gridClasses['container--top']}`]: {
          display: 'none',
        },
      }}
    />
  );
};

import * as React from 'react';

import { DataGrid, GridColDef, GridRowSelectionModel, GridRowId } from '@mui/x-data-grid';

import { useRsi } from '../hooks/useRsi';

export type RowData = Record<string, any> & { __index: GridRowId };

interface Props {
  rows: RowData[];
  columns: GridColDef[];
  selectedRows: GridRowSelectionModel;
  setSelectedRow: (rows: GridRowSelectionModel) => void;
  onRowsChange: (rows: RowData[], changedIndexes?: number[]) => void;
  rowHeight?: number;
  hiddenHeader?: boolean;
  components?: {
    noRowsFallback?: React.ReactNode;
  };
}

export const Table = ({ rows, columns, selectedRows, setSelectedRow, onRowsChange, components }: Props) => {
  const { rtl } = useRsi();

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      getRowId={row => row.__index}
      checkboxSelection
      disableRowSelectionOnClick
      rowSelectionModel={selectedRows}
      onRowSelectionModelChange={setSelectedRow}
      processRowUpdate={newRow => {
        const idx = rows.findIndex(r => r.__index === newRow.__index);
        const updatedRows = [...rows];
        updatedRows[idx] = newRow;
        onRowsChange(updatedRows, [idx]);
        return newRow;
      }}
      onProcessRowUpdateError={error => {
        console.error('Edit failed:', error);
      }}
      editMode="cell"
      hideFooter
      sx={{
        direction: rtl ? 'rtl' : 'ltr',
      }}
      slots={{
        noRowsOverlay: () =>
          components?.noRowsFallback ? (
            <>{components.noRowsFallback}</>
          ) : (
            <div style={{ textAlign: 'center', padding: 20 }}>No rows</div>
          ),
      }}
    />
  );
};

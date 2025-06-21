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
      onRowSelectionModelChange={newRowSelectionModel => {
        setSelectedRow(newRowSelectionModel);
      }}
      onRowEditStop={(params, event) => {
        // Add edit handling here if using cell editing
      }}
      processRowUpdate={(newRow, oldRow) => {
        const updatedRows = rows.map(r => (r.__index === newRow.__index ? newRow : r));
        onRowsChange(updatedRows, [newRow.__index]);
        return newRow;
      }}
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

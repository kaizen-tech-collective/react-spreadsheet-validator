import * as React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { DataGrid, GridRowModel } from '@mui/x-data-grid';

import { useRsi } from '../../hooks/useRsi';
import type { Data, Meta } from '../../types';

import { addErrorsAndRunHooks } from '../dataMutations';
import generateValidationStepColumns, { validationStepColumnStyling } from '../ValidationStepColumns';

type Props<T extends string> = {
  initialData: Data<T>[];
};

export const ValidationStep = <T extends string>({ initialData }: Props<T>) => {
  const { fields, rowHook, rtl, tableHook, translations } = useRsi<T>();

  const [rows, setRows] = React.useState<(Data<T> & Meta)[]>(
    React.useMemo(() => {
      return addErrorsAndRunHooks<T>(initialData, fields, rowHook, tableHook);
    }, []),
  );

  const handleProcessRowUpdate = React.useCallback(
    (newRow: GridRowModel) => {
      const rowIndex = rows.findIndex(row => {
        return row.__index === newRow.__index;
      });

      if (rowIndex === -1) {
        return newRow;
      }

      const updateData = [...rows];
      updateData[rowIndex] = { ...rows[rowIndex], ...newRow };

      const validated = addErrorsAndRunHooks<T>(updateData, fields, rowHook, tableHook);
      setRows(validated);

      return validated[rowIndex] ?? newRow;
    },
    [rows, fields, rowHook, tableHook],
  );

  const columns = React.useMemo(() => {
    return generateValidationStepColumns(fields);
  }, [fields]);

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="2rem" flexWrap="wrap" gap="8px">
        <Typography variant={'h4'}>{translations.validationStep.title}</Typography>
      </Box>
      <Box
        sx={{
          height: '50vh',
          display: 'flex',
          flexDirection: 'column',
          ...validationStepColumnStyling,
        }}
      >
        {/*
          TODO:
          - Abstract to a component
          - Enable 'single click editing: https://mui.com/x/react-data-grid/recipes-editing/#single-click-editing
        */}
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={row => row.__index}
          checkboxSelection
          disableRowSelectionOnClick
          disableColumnSorting
          disableColumnFilter
          disableColumnMenu
          processRowUpdate={handleProcessRowUpdate}
          hideFooter
          sx={{
            direction: rtl ? 'rtl' : 'ltr',
          }}
        />
      </Box>
    </>
  );
};

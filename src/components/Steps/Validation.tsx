import * as React from 'react';

import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import Switch from '@mui/material/Switch';
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

  const [data, setData] = React.useState<(Data<T> & Meta)[]>(
    React.useMemo(() => {
      return addErrorsAndRunHooks<T>(initialData, fields, rowHook, tableHook);
    }, []),
  );
  const [filterByErrors, setFilterByErrors] = React.useState(false);

  const handleProcessRowUpdate = React.useCallback(
    (newRow: GridRowModel) => {
      const rowIndex = data.findIndex(row => {
        return row.__index === newRow.__index;
      });

      if (rowIndex === -1) {
        return newRow;
      }

      const updateData = [...data];
      updateData[rowIndex] = { ...data[rowIndex], ...newRow };

      const validated = addErrorsAndRunHooks<T>(updateData, fields, rowHook, tableHook);
      setData(validated);

      return validated[rowIndex] ?? newRow;
    },
    [data, fields, rowHook, tableHook],
  );

  const columns = React.useMemo(() => {
    return generateValidationStepColumns(fields);
  }, [fields]);

  const rows = React.useMemo(() => {
    if (filterByErrors) {
      return data.filter(value => {
        if (value?.__errors) {
          return Object.values(value.__errors)?.filter(error => {
            return error.level === 'error';
          }).length;
        }
        return false;
      });
    }
    return data;
  }, [data, filterByErrors]);

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="2rem" flexWrap="wrap" gap="8px">
        <Typography variant={'h4'}>{translations.validationStep.title}</Typography>
        <Box display="flex" gap="16px" alignItems="center" flexWrap="wrap">
          {/* <Button onClick={deleteSelectedRows} size={'small'} variant={'outlined'}>
            {translations.validationStep.discardButtonTitle}
          </Button> */}
          <Switch
            sx={{ display: 'flex', alignItems: 'center' }}
            checked={filterByErrors}
            onChange={() => {
              return setFilterByErrors(!filterByErrors);
            }}
          />
          <FormLabel component="legend">{translations.validationStep.filterSwitchTitle}</FormLabel>
        </Box>
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
